import { SpecialFee, Staking } from '@/@types/staking'
import { Dialog, Notification, Spinner, Tooltip, toast } from '@/components/ui'
import toastConnectWallet from '@/components/ui/toast/utils/ToastConnectWallet'
import toastError from '@/components/ui/toast/utils/ToastError'
import toastSwitchNetwork from '@/components/ui/toast/utils/ToastSwitchNetwork'
import { getErc20Balance } from '@/contracts/functions/ERC20'
import { setSpecialFee } from '@/contracts/functions/StakingFee'
import {
  getDetailStaking,
  notifyRewardAmount,
  setDuration,
  setPaused,
  transferStakingToken,
} from '@/contracts/functions/StakingRewards'
import { getSigner } from '@/contracts/utils'
import { isSupportedNetwork } from '@/lib/isSupportedNetwork'
import {
  apiUpdateFeeStaking,
  apiUpdateStaking,
} from '@/services/StakingService'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { Formik } from 'formik'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import { FaRegPauseCircle, FaRegPlayCircle } from 'react-icons/fa'
import {
  HiOutlineCurrencyDollar,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi'
import { MdOutlineTimer } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { useAccount, useNetwork } from 'wagmi'
import * as Yup from 'yup'
import {
  getStakingList,
  setSelectedStaking,
  toggleDeleteConfirmation,
  useAppDispatch,
  useAppSelector,
} from '../store'
import SetFeeForm from './SetFeeForm'
import SetRewardForm from './SetRewardForm'

const actionsWithIndex = {
  stake: 0,
  withdraw: 1,
  claim: 2,
  addBooster: 3,
  removeBooster: 4,
}

const ActionColumn = ({ row }: { row: Staking }) => {
  const dispatch = useAppDispatch()
  const { textTheme } = useThemeClass()
  const navigate = useNavigate()
  const { chain } = useNetwork()
  const [loadingPause, setLoadingPause] = useState(false)
  const [dialogIsOpen, setIsOpen] = useState(false)
  const [openFee, setOpenFee] = useState(false)
  const [tokenBalance, setTokenBalance] = useState(0)
  const [loadingFee, setLoadingFee] = useState({
    loading: false,
    type: '',
  })
  const { connector, isConnected, address } = useAccount()
  const [loadingReward, setLoadingReward] = useState(false)
  const tableData = useAppSelector((state) => state.stakingList.data.tableData)

  useEffect(() => {
    getBalanceReward()
  }, [isConnected, chain])

  const validationSchema = Yup.object().shape({
    weeks: Yup.number()
      .typeError('Weeks must be a number')
      .integer('Weeks must be an integer')
      .positive('Weeks must be a positive number')
      .required('Weeks required')
      .moreThan(0, 'Weeks must be greater than 0'),
    totalReward: Yup.number()
      .typeError('Reward must be a number')
      .required('Reward required')
      .moreThan(
        row.info.totalReward ?? 0,
        `Reward must be greater than ${row.info.totalReward ?? 0}`
      )
      .max(tokenBalance, 'Insufficient balance'),
  })

  const validationFeeSchema = Yup.object().shape({
    stake: Yup.number()
      .typeError('Must be a number')
      .min(0, 'Must be greater than 0'),
    withdraw: Yup.number()
      .typeError('Must be a number')
      .min(0, 'Must be greater than 0'),
    claim: Yup.number()
      .typeError('Must be a number')
      .min(0, 'Must be greater than 0'),
    addBooster: Yup.number()
      .typeError('Must be a number')
      .min(0, 'Must be greater than 0'),
    removeBooster: Yup.number()
      .typeError('Must be a number')
      .min(0, 'Must be greater than 0'),
  })

  const handleSetReward = async (data: {
    weeks: number
    totalReward: number
  }) => {
    if (!isConnected) {
      toastConnectWallet()
      setLoadingReward(false)
      return
    }
    if (!isSupportedNetwork(chain!.id)) {
      toastSwitchNetwork()
      setLoadingReward(false)
      return
    }
    try {
      setLoadingReward(true)
      const signer = await getSigner({
        connector,
        chainName: chain!.name,
        chainId: chain!.id,
      })
      if (!row?.info.totalReward || row?.info.totalReward === 0) {
        await setDuration({
          signer: signer,
          duration: (data.weeks * 7 * 24 * 60 * 60) as number,
          stakingAddress: row.address as string,
        })
      }

      const tx = await transferStakingToken(
        row.info.totalReward
          ? +data.totalReward - row.info.totalReward
          : +data.totalReward,
        row.address as string,
        signer,
        row.info.rewardCoin
      )
      const res = await tx.wait()
      if (
        (!row?.info.totalReward || row?.info.totalReward === 0) &&
        tx.hash &&
        res &&
        res.status === 1
      ) {
        await notifyRewardAmount(
          row.address as string,
          signer,
          data.totalReward
        )
      }
      const startTime = Date.now()
      const stakingRewards = await getDetailStaking(
        row.address as string,
        signer
      )
      console.log('🍕 ~ stakingRewards:', stakingRewards)

      const payload = {
        ...data,
        startTime,
        deposited: stakingRewards.totalSupply,
        periodFinish: stakingRewards.periodFinish,
        rewardRate: stakingRewards.rewardRate,
        rewardsDuration: stakingRewards.rewardsDuration,
        rewardPerTokenStored: stakingRewards.rewardPerTokenStored,
        rewardPerToken: stakingRewards.rewardPerToken,
        finished: false,
        paused: false,
      }
      const response = await apiUpdateStaking<boolean, typeof payload>({
        id: row._id,
        payload,
      })

      if (response) {
        toast.push(
          <Notification title={'Successfully'} type="success" duration={2500}>
            Successfully config staking
          </Notification>,
          {
            placement: 'top-center',
          }
        )
        setLoadingReward(false)
        onDialogClose()
        dispatch(getStakingList(tableData))
      }
    } catch (error: any) {
      setLoadingReward(false)
      toast.push(
        <Notification title={'Error'} type="danger" duration={2500}>
          {error?.reason || 'Something went wrong'}
        </Notification>,
        {
          placement: 'top-center',
        }
      )
    }
  }

  const handleSetFee = async (
    type: 'stake' | 'withdraw' | 'claim' | 'addBooster' | 'removeBooster',
    value: number | string
  ) => {
    console.log({ type, value })

    if (!isConnected) {
      toastConnectWallet()
      setLoadingFee({ loading: false, type: '' })
      return
    }
    if (!isSupportedNetwork(chain!.id)) {
      toastSwitchNetwork()
      setLoadingFee({ loading: false, type: '' })
      return
    }
    try {
      setLoadingFee({ loading: true, type })
      const signer = await getSigner({
        connector,
        chainId: chain!.id,
        chainName: chain!.name,
      })
      const index = actionsWithIndex[type as keyof typeof actionsWithIndex]
      if (
        !row.specialFees ||
        (row.specialFees && row.specialFees[type] !== value)
      ) {
        await setSpecialFee(signer, row.address, +value, index)
      }
      await apiUpdateFeeStaking<boolean, any>({
        id: row._id,
        payload: { ...row.specialFees, [type]: +value },
      })
      setLoadingFee({ loading: false, type: '' })
      // onDialogFeeClose()
      dispatch(getStakingList(tableData))
      toast.push(
        <Notification title={'Successfully'} type="success" duration={2500}>
          Successfully config fee
        </Notification>,
        {
          placement: 'top-center',
        }
      )
    } catch (error: any) {
      setLoadingFee({ loading: false, type: '' })
      toastError(error.reason || error.message)
      console.log({ error })
    }
  }

  const getBalanceReward = async () => {
    if (!isConnected || !isSupportedNetwork(chain?.id)) return
    const signer = await getSigner({
      connector,
      chainName: chain!.name,
      chainId: chain!.id,
    })
    const { balance } = await getErc20Balance(
      row.info.rewardCoin,
      signer,
      address as string
    )
    setTokenBalance(+balance)
  }

  const openDialog = () => {
    setIsOpen(true)
  }

  const onDialogClose = () => {
    if (loadingReward) return
    setIsOpen(false)
  }
  const onDialogFeeClose = () => {
    if (loadingFee.loading) return
    setOpenFee(false)
  }

  const onEdit = () => {
    navigate(`/app/staking-edit/${row._id}?address=${row.address}`)
  }

  const onDelete = () => {
    dispatch(toggleDeleteConfirmation(true))
    dispatch(setSelectedStaking(row._id))
  }

  const handleSetPause = async (paused: boolean) => {
    if (!isConnected) {
      toastConnectWallet()
      return
    }
    if (!isSupportedNetwork(chain!.id)) {
      toastSwitchNetwork()
      setLoadingPause(false)
      return
    }

    if (loadingPause || !chain) return
    try {
      setLoadingPause(true)
      const signer = await getSigner({
        connector,
        chainId: chain?.id,
        chainName: chain?.name,
      })
      await setPaused(signer, row.address, paused)
      await apiUpdateStaking({ id: row._id, payload: { paused } })
      setLoadingPause(false)
      dispatch(getStakingList(tableData))
    } catch (error: any) {
      console.log({ error })
      toastError(error.reason || error.message)
      setLoadingPause(false)
    }
  }

  return (
    <div className="flex justify-end text-lg">
      {row?.periodFinish && row?.periodFinish * 1000 > Date.now() ? (
        <span
          className={`cursor-pointer p-2 hover:${textTheme}`}
          onClick={() => handleSetPause(row.paused ? false : true)}
        >
          <Tooltip
            title={loadingPause ? 'Loading...' : row.paused ? 'Play' : 'Pause'}
          >
            {loadingPause ? (
              <Spinner size={20} />
            ) : row.paused ? (
              <FaRegPlayCircle />
            ) : (
              <FaRegPauseCircle />
            )}
          </Tooltip>
        </span>
      ) : null}
      <span
        className={`cursor-pointer p-2 hover:${textTheme}`}
        onClick={() => setOpenFee(true)}
      >
        <Tooltip title="Set Fee">
          <HiOutlineCurrencyDollar />
        </Tooltip>
      </span>
      <span
        className={`cursor-pointer p-2 hover:${textTheme}`}
        onClick={openDialog}
      >
        <Tooltip title="Set Reward & Duration">
          <MdOutlineTimer />
        </Tooltip>
      </span>
      <span
        className={`cursor-pointer p-2 hover:${textTheme}`}
        onClick={onEdit}
      >
        <Tooltip title="Edit Staking">
          <HiOutlinePencil />
        </Tooltip>
      </span>
      {row.periodFinish * 1000 < Date.now() && (
        <span
          className="cursor-pointer p-2 hover:text-red-500"
          onClick={onDelete}
        >
          <Tooltip title="Delete Staking">
            <HiOutlineTrash />
          </Tooltip>
        </span>
      )}

      <Dialog
        isOpen={dialogIsOpen}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        <h5 className="mb-4">Config Rewards & Duration </h5>
        <Formik
          initialValues={{
            weeks: 0,
            totalReward: 0,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const formData = cloneDeep(values)
            handleSetReward(formData)
          }}
        >
          {({ values, touched, errors, isSubmitting, setFieldValue }) => (
            <SetRewardForm
              touched={touched}
              errors={errors}
              values={values}
              setFieldValue={setFieldValue}
              isSubmitting={loadingReward}
              onDialogClose={onDialogClose}
              data={row}
            />
          )}
        </Formik>
      </Dialog>

      <Dialog
        isOpen={openFee}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        onClose={onDialogFeeClose}
        onRequestClose={onDialogFeeClose}
      >
        <h5 className="mb-4">Config Fee For Staking</h5>
        <Formik
          initialValues={{
            stake: '',
            withdraw: '',
            claim: '',
            addBooster: '',
            removeBooster: '',
            isInWhiteList: false,
          }}
          validationSchema={validationFeeSchema}
          onSubmit={(values) => {
            const formData = cloneDeep(values)
            console.log({ formData })
          }}
        >
          {({ values, touched, errors, setFieldValue }) => (
            <SetFeeForm
              touched={touched}
              errors={errors}
              values={values}
              setFieldValue={setFieldValue}
              isSubmitting={loadingFee}
              onDialogClose={onDialogFeeClose}
              data={row}
              onSetFee={handleSetFee}
            />
          )}
        </Formik>
      </Dialog>
    </div>
  )
}

export default ActionColumn
