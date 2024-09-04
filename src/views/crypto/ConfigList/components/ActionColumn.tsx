import {
  Button,
  Dialog,
  FormContainer,
  FormItem,
  Input,
  Tooltip,
} from '@/components/ui'
import toastConnectWallet from '@/components/ui/toast/utils/ToastConnectWallet'
import { getFee, setDefaultFee } from '@/contracts/functions/StakingFee'
import { getSigner } from '@/contracts/utils'
import { apiUpdateConfig } from '@/services/ConfigService'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { Field, Form, Formik, FormikErrors, FormikTouched } from 'formik'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import { HiOutlinePencil } from 'react-icons/hi'
import { useAccount, useNetwork } from 'wagmi'
import * as Yup from 'yup'
import { getConfigFee, useAppDispatch, useAppSelector } from '../store'
import { isSupportedNetwork } from '@/lib/isSupportedNetwork'
import toastSwitchNetwork from '@/components/ui/toast/utils/ToastSwitchNetwork'
import convertToTitleCase from '@/utils/convertToTitleCase'
import toastError from '@/components/ui/toast/utils/ToastError'

const validationSchema = Yup.object().shape({
  fee: Yup.number()
    .typeError('Fee must be a number')
    .required('Fee required')
    .moreThan(0, 'Fee must be greater than 0'),
})

const actionsWithIndex = {
  stake: 0,
  withdraw: 1,
  claim: 2,
  addBooster: 3,
  removeBooster: 4,
}

const ActionColumn = ({ row }: { row: { action: string; fee: number } }) => {
  const dispatch = useAppDispatch()
  const { textTheme } = useThemeClass()
  const [dialogIsOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { isConnected, connector } = useAccount()
  const { chain } = useNetwork()

  const { actions, id } = useAppSelector((state) => state.configFee.data)

  const openDialog = () => {
    setIsOpen(true)
  }

  const onDialogClose = () => {
    if (loading) return
    setIsOpen(false)
  }

  const handleSubmit = async (data: { fee: number }) => {
    if (!isConnected) {
      toastConnectWallet()
      return
    }
    if (!isSupportedNetwork(chain?.id)) {
      toastSwitchNetwork()
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const signer = await getSigner({
        connector,
        chainName: chain!.name,
        chainId: chain!.id,
      })

      const newActions = actions.map((item) => {
        if (item.action === row.action) {
          return { ...item, fee: +data.fee }
        }
        return item
      })
      const index =
        actionsWithIndex[row.action as keyof typeof actionsWithIndex]

      await setDefaultFee(signer, +data.fee, index)
      await apiUpdateConfig<any, { value: string }>({
        id,
        payload: { value: JSON.stringify(newActions) },
      })
      dispatch(getConfigFee())
      setLoading(false)
      onDialogClose()
    } catch (error: any) {
      console.log({ error })
      toastError(error.reason || error.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-end text-lg">
      <span
        className={`cursor-pointer p-2 hover:${textTheme}`}
        onClick={openDialog}
      >
        <Tooltip title="Edit fee">
          <HiOutlinePencil />
        </Tooltip>
      </span>

      <Dialog
        isOpen={dialogIsOpen}
        style={{
          content: {
            marginTop: 250,
          },
        }}
        contentClassName="pb-0 px-0"
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        <div className="px-6 pb-6">
          <h5 className="mb-4">Change {convertToTitleCase(row.action)} fee</h5>
          <Formik
            initialValues={{
              fee: 0,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const formData = cloneDeep(values)
              handleSubmit(formData)
            }}
          >
            {({ touched, errors, setFieldValue }) => (
              <Form>
                <FormContainer>
                  <InputItem
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    fee={row.fee}
                    loading={loading}
                  />
                </FormContainer>
                <div className="flex items-center justify-end py-3">
                  <Button
                    className="ltr:mr-2 rtl:ml-2"
                    onClick={onDialogClose}
                    disabled={loading}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button variant="solid" type="submit" loading={loading}>
                    Submit
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Dialog>
    </div>
  )
}

export default ActionColumn

type InputProps = {
  errors: FormikErrors<{
    fee: number
  }>
  touched: FormikTouched<{
    fee: number
  }>
  loading: boolean
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<{
    fee: number
  }>>
  fee: number
}

const InputItem = (props: InputProps) => {
  const { errors, touched, loading, setFieldValue, fee } = props

  useEffect(() => {
    setFieldValue('fee', fee)
  }, [fee])

  return (
    <FormItem
      invalid={(errors.fee && touched.fee) as boolean}
      errorMessage={errors.fee}
    >
      <Field
        type="text"
        autoComplete="off"
        name="fee"
        placeholder="fee"
        component={Input}
        disabled={loading}
      />
    </FormItem>
  )
}
