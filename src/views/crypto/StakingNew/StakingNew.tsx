import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import toastConnectWallet from '@/components/ui/toast/utils/ToastConnectWallet'
import toastError from '@/components/ui/toast/utils/ToastError'
import toastSwitchNetwork from '@/components/ui/toast/utils/ToastSwitchNetwork'
import {
  deployStaking,
  setBoosterRatio,
} from '@/contracts/functions/StakingRewards'
import { getSigner } from '@/contracts/utils'
import { isSupportedNetwork } from '@/lib/isSupportedNetwork'
import {
  apiCreateStaking,
  apiDeleteStaking,
  apiUpdateStaking,
} from '@/services/StakingService'
import { apiUpload } from '@/services/UploadService'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAccount, useNetwork } from 'wagmi'
import StakingForm, { InitialData, SetSubmitting } from '../StakingForm'
import store, { ChainEnum } from '@/store'

const StakingNew = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { search } = useLocation()
  const stakingAddress = search?.split('=')?.[1]
  const { connector, isConnected } = useAccount()
  const { chain } = useNetwork()

  const addStaking = async (data: InitialData) => {
    try {
      const signer = await getSigner({
        connector,
        chainName: chain!.name,
        chainId: chain!.id,
      })
      if (!signer) return
      const address = await deployStaking({
        signer,
        stakingToken: data.stakeCoinName.split('|')[2],
        rewardToken: data.rewardCoinName.split('|')[2],
        booster: data.booster,
        boosterRatio: +data.boosterRatio.toFixed(2),
      })
      const chainConnected = store.getState().auth.user.wallet?.chain
      const imageUrl = await uploadFile(data.file as File)
      const payload = {
        ...data,
        address: address,
        img: imageUrl,
        rewardCoinPrice: +data.rewardCoinPrice,
        stakeCoinPrice: +data.stakeCoinPrice,
        stakeCoinName: data.stakeCoinName.split('|')[1],
        rewardCoinName: data.rewardCoinName.split('|')[1],
        stakeCoin: data.stakeCoinName.split('|')[2],
        rewardCoin: data.rewardCoinName.split('|')[2],
        stakeFee:
          chainConnected === ChainEnum.POLYGON
            ? import.meta.env.VITE_STAKE_FEE_POLYGON
            : import.meta.env.VITE_STAKE_FEE_CRONOS,
        externalLink:
          (chainConnected === ChainEnum.POLYGON
            ? import.meta.env.VITE_SCAN_URL_POLYGON
            : import.meta.env.VITE_SCAN_URL_CRONOS) +
          '/address/' +
          address,
        chainId: chain!.id.toString(),
      }
      delete payload.file
      delete payload.isFileChange
      console.log({ payload })
      const response = await apiCreateStaking<boolean, InitialData>(payload)
      return response
    } catch (error: any) {
      toastError(error.reason || error.message)
      console.log({ error })
    }
  }

  const updateStaking = async (data: InitialData) => {
    try {
      if (data.isBoosterRatioChanged) {
        const signer = await getSigner({
          connector,
          chainName: chain!.name,
          chainId: chain!.id,
        })
        await setBoosterRatio(signer, stakingAddress, data.boosterRatio)
      }
      let imageUrl = ''
      if (data.isFileChange) {
        imageUrl = await uploadFile(data.file as File)
      } else {
        imageUrl = data.imageOriginalUrl as string
      }
      const newData = {
        ...data,
        img: imageUrl,
      }
      delete newData.file
      console.log({ newData })
      if (!id) return
      const response = await apiUpdateStaking<boolean, InitialData>({
        id,
        payload: newData,
      })
      return response
    } catch (error: any) {
      toastError(error.reason || error.message)
      console.log({ error })
    }
  }

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const url = await apiUpload(formData)
    return url
  }

  const handleFormSubmit = async (
    values: InitialData,
    setSubmitting: SetSubmitting
  ) => {
    try {
      if (!isConnected) {
        toastConnectWallet()
        setSubmitting(false)
        return
      }
      if (!isSupportedNetwork(chain!.id)) {
        toastSwitchNetwork()
        setSubmitting(false)
        return
      }
      setSubmitting(true)
      let success
      if (!id) {
        success = await addStaking(values)
      } else {
        success = await updateStaking(values)
      }

      setSubmitting(false)
      if (success) {
        toast.push(
          <Notification
            title={'Successfully added'}
            type="success"
            duration={2500}
          >
            Product successfully added
          </Notification>,
          {
            placement: 'top-center',
          }
        )
        navigate('/app/staking-list')
      }
    } catch (error) {
      setSubmitting(false)
    }
  }

  const handleDeleteStaking = async () => {
    if (!id) return
    const success = await apiDeleteStaking({ id })
    if (success) {
      toast.push(
        <Notification
          title={'Successfully Deleted'}
          type="success"
          duration={2500}
        >
          Staking successfully deleted
        </Notification>,
        {
          placement: 'top-center',
        }
      )
      navigate('/app/staking-list')
    }
  }

  const handleDiscard = () => {
    navigate('/app/staking-list')
  }

  return (
    <>
      <StakingForm
        type={id ? 'edit' : 'new'}
        onFormSubmit={handleFormSubmit}
        onDiscard={handleDiscard}
        onDelete={handleDeleteStaking}
      />
    </>
  )
}

export default StakingNew
