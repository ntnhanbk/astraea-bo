import { Staking } from '@/@types/staking'
import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { Field, Form, FormikErrors, FormikTouched } from 'formik'
import { useEffect } from 'react'

type FormFieldsName = {
  weeks: number
  totalReward: number
}

type Props = {
  touched: FormikTouched<FormFieldsName>
  errors: FormikErrors<FormFieldsName>
  values: {
    weeks: number
    totalReward: number
  }
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<FormFieldsName>>
  isSubmitting: boolean
  onDialogClose: () => void
  data: Staking
}

const SetRewardForm = (props: Props) => {
  const { touched, errors, setFieldValue, isSubmitting, onDialogClose, data } =
    props

  useEffect(() => {
    setFieldValue('weeks', data.info.weeks || 0)
    setFieldValue('totalReward', data.info.totalReward || 0)
  }, [data])

  return (
    <Form>
      <FormContainer>
        <FormItem
          label="Weeks"
          invalid={(errors.weeks && touched.weeks) as boolean}
          errorMessage={errors.weeks}
        >
          <Field
            type="text"
            autoComplete="off"
            name="weeks"
            placeholder="weeks"
            pattern="[0-9]*"
            min={1}
            step={1}
            component={Input}
          />
        </FormItem>
        <FormItem
          label="Reward"
          invalid={(errors.totalReward && touched.totalReward) as boolean}
          errorMessage={errors.totalReward}
        >
          <Field
            type="text"
            autoComplete="off"
            name="totalReward"
            step="0.00000001"
            component={Input}
          />
        </FormItem>
      </FormContainer>
      <div className="text-right mt-6">
        <Button
          className="ltr:mr-2 rtl:ml-2"
          variant="plain"
          onClick={onDialogClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button variant="solid" type="submit" loading={isSubmitting}>
          Submit
        </Button>
      </div>
    </Form>
  )
}

export default SetRewardForm
