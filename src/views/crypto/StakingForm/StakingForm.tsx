import ConfirmDialog from '@/components/shared/ConfirmDialog'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import { FormContainer } from '@/components/ui/Form'
import { Form, Formik, FormikProps } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { forwardRef, useState } from 'react'
import { AiOutlineSave } from 'react-icons/ai'
import { HiOutlineTrash } from 'react-icons/hi'
import * as Yup from 'yup'
import BasicInformationFields from './BasicInformationFields'

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type FormikRef = FormikProps<any>

export type InitialData = {
  name?: string
  file?: File
  description?: string
  isFileChange?: boolean
  imageOriginalUrl?: string
  rewardCoin: string
  rewardCoinName: string
  rewardCoinPrice: number
  stakeCoin: string
  stakeCoinName: string
  stakeCoinPrice: number
  booster: string
  boosterName: string
  boosterRatio: number
  isBoosterRatioChanged?: boolean
  isBoosterAddressChanged?: boolean
}

export type SetSubmitting = (isSubmitting: boolean) => void

export type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>

type OnDelete = (callback: OnDeleteCallback) => void

type StakingForm = {
  initialData?: InitialData
  type: 'edit' | 'new'
  onDiscard?: () => void
  onDelete?: OnDelete
  onFormSubmit: (formData: InitialData, setSubmitting: SetSubmitting) => void
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Staking name required'),
  file: Yup.mixed().required('Image required'),
  // rewardCoin: Yup.string()
  //   .required('Reward coin address required')
  //   .test('is-hex-prefixed', 'Address invalid', (value) => {
  //     return value?.startsWith('0x')
  //   }),
  rewardCoinName: Yup.string().required('Reward coin name required'),
  rewardCoinPrice: Yup.number()
    .typeError('Must be a number')
    .required('Reward coin price required')
    .moreThan(0, 'Must be greater than 0'),
  // stakeCoin: Yup.string()
  //   .required('Stake coin address required')
  //   .test('is-hex-prefixed', 'Address invalid', (value) => {
  //     return value?.startsWith('0x')
  //   }),
  stakeCoinName: Yup.string().required('Stake coin name required'),
  stakeCoinPrice: Yup.number()
    .typeError('Must be a number')
    .required('Stake coin price required')
    .moreThan(0, 'Must be greater than 0'),
  booster: Yup.string()
    .required('Booster address required')
    .test('is-hex-prefixed', 'Address invalid', (value) => {
      return value?.startsWith('0x')
    }),
  boosterName: Yup.string().required('Booster Name required'),
  boosterRatio: Yup.number()
    .typeError('Must be a number')
    .required('Booster Ratio required')
    .moreThan(0, 'Must be greater than 0')
    .max(32, 'Maximum is 32%'),
})

const StakingForm = forwardRef<FormikRef, StakingForm>((props, ref) => {
  const {
    type,
    initialData = {
      name: '',
      file: undefined,
      description: '',
      rewardCoin: '',
      rewardCoinName: '',
      stakeCoin: '',
      stakeCoinName: '',
      booster: '',
      boosterName: '',
      boosterRatio: 0,
      rewardCoinPrice: 0,
      stakeCoinPrice: 0,
    },
    onFormSubmit,
    onDiscard,
    onDelete,
  } = props

  return (
    <>
      <Formik
        innerRef={ref}
        initialValues={{
          ...initialData,
        }}
        validationSchema={validationSchema}
        onSubmit={(values: InitialData, { setSubmitting }) => {
          const formData = cloneDeep(values)
          if (type === 'new') {
            onFormSubmit?.(formData, setSubmitting)
          }
          if (type === 'edit') {
            onFormSubmit?.(formData, setSubmitting)
          }
        }}
      >
        {({ values, touched, errors, isSubmitting, setFieldValue }) => (
          <Form>
            <FormContainer>
              <div className="grid grid-cols-1 gap-4">
                <div className="lg:col-span-2">
                  <BasicInformationFields
                    touched={touched}
                    errors={errors}
                    values={values}
                    setFieldValue={setFieldValue}
                    isSubmitting={isSubmitting}
                  />
                </div>
              </div>
              <StickyFooter
                className="-mx-8 px-8 flex items-center justify-end py-4"
                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div className="md:flex items-center">
                  <Button
                    size="sm"
                    className="ltr:mr-3 rtl:ml-3"
                    type="button"
                    onClick={() => onDiscard?.()}
                    disabled={isSubmitting}
                  >
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    variant="solid"
                    loading={isSubmitting}
                    icon={<AiOutlineSave />}
                    type="submit"
                  >
                    {type === 'new' ? 'Save' : 'Update'}
                  </Button>
                </div>
              </StickyFooter>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </>
  )
})

StakingForm.displayName = 'StakingForm'

export default StakingForm
