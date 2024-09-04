import { SpecialFee, Staking } from '@/@types/staking'
import {
  Button,
  FormContainer,
  FormItem,
  Input,
  Switcher,
} from '@/components/ui'
import { Field, Form, FormikErrors, FormikTouched } from 'formik'
import { ChangeEvent, useEffect, useState } from 'react'

type Props = {
  touched: FormikTouched<SpecialFee & { isInWhiteList: boolean }>
  errors: FormikErrors<SpecialFee & { isInWhiteList: boolean }>
  values: SpecialFee & { isInWhiteList: boolean }
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<SpecialFee & { isInWhiteList: boolean }>>
  isSubmitting: {
    loading: boolean
    type: string
  }
  onDialogClose: () => void
  data: Staking
  onSetFee: (
    type: 'stake' | 'withdraw' | 'claim' | 'addBooster' | 'removeBooster',
    value: number | string
  ) => Promise<void>
}

const SetFeeForm = (props: Props) => {
  const {
    values,
    touched,
    errors,
    setFieldValue,
    isSubmitting,
    onDialogClose,
    data,
    onSetFee,
  } = props

  useEffect(() => {
    if (values.isInWhiteList) {
      ;['stake', 'withdraw', 'claim', 'addBooster', 'removeBooster'].map(
        (key) => setFieldValue(key, 0)
      )
    } else {
      ;['stake', 'withdraw', 'claim', 'addBooster', 'removeBooster'].map(
        (key) =>
          setFieldValue(
            key,
            data?.specialFees?.[key as keyof typeof data.specialFees] ?? ''
          )
      )
    }
  }, [values.isInWhiteList, data.specialFees])

  return (
    <Form>
      <FormContainer>
        <div className="w-full flex items-center gap-2 mb-4">
          <span className="text-base font-medium">Whitelist</span>
          <Switcher
            checked={values.isInWhiteList}
            onChange={(value) => setFieldValue('isInWhiteList', !value)}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <FormItem
              className="flex-1"
              label="Stake"
              invalid={(errors.stake && touched.stake) as boolean}
              errorMessage={errors.stake}
            >
              <Field
                type="text"
                autoComplete="off"
                name="stake"
                component={Input}
                disabled={isSubmitting.loading}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  setFieldValue(
                    'isInWhiteList',
                    values.addBooster === '0' &&
                      values.removeBooster === '0' &&
                      values.claim === '0' &&
                      value === '0' &&
                      values.withdraw === '0'
                  )
                  setFieldValue('stake', value)
                }}
              />
            </FormItem>
            <Button
              variant="solid"
              type="button"
              disabled={isSubmitting.loading}
              loading={isSubmitting.loading && isSubmitting.type === 'stake'}
              onClick={() => onSetFee('stake', values.stake)}
            >
              {isSubmitting.loading && isSubmitting.type === 'stake'
                ? 'Loading'
                : 'Set'}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <FormItem
              className="flex-1"
              label="Withdraw"
              invalid={(errors.withdraw && touched.withdraw) as boolean}
              errorMessage={errors.withdraw}
            >
              <Field
                type="text"
                autoComplete="off"
                name="withdraw"
                component={Input}
                disabled={isSubmitting.loading}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  setFieldValue('withdraw', e.target.value)
                  setFieldValue(
                    'isInWhiteList',
                    values.addBooster === '0' &&
                      values.removeBooster === '0' &&
                      values.claim === '0' &&
                      value === '0' &&
                      values.stake === '0'
                  )
                }}
              />
            </FormItem>
            <Button
              variant="solid"
              type="button"
              disabled={isSubmitting.loading}
              loading={isSubmitting.loading && isSubmitting.type === 'withdraw'}
              onClick={() => onSetFee('withdraw', values.withdraw)}
            >
              {isSubmitting.loading && isSubmitting.type === 'withdraw'
                ? 'Loading'
                : 'Set'}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <FormItem
              className="flex-1"
              label="Claim"
              invalid={(errors.claim && touched.claim) as boolean}
              errorMessage={errors.claim}
            >
              <Field
                type="text"
                autoComplete="off"
                name="claim"
                component={Input}
                disabled={isSubmitting.loading}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  setFieldValue(
                    'isInWhiteList',
                    values.addBooster === '0' &&
                      values.removeBooster === '0' &&
                      values.withdraw === '0' &&
                      value === '0' &&
                      values.stake === '0'
                  )
                  setFieldValue('claim', value)
                }}
              />
            </FormItem>
            <Button
              variant="solid"
              type="button"
              disabled={isSubmitting.loading}
              loading={isSubmitting.loading && isSubmitting.type === 'claim'}
              onClick={() => onSetFee('claim', values.claim)}
            >
              {isSubmitting.loading && isSubmitting.type === 'claim'
                ? 'Loading'
                : 'Set'}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <FormItem
              className="flex-1"
              label="Add Booster"
              invalid={(errors.addBooster && touched.addBooster) as boolean}
              errorMessage={errors.addBooster}
            >
              <Field
                type="text"
                autoComplete="off"
                name="addBooster"
                component={Input}
                disabled={isSubmitting.loading}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  setFieldValue(
                    'isInWhiteList',
                    values.withdraw === '0' &&
                      values.removeBooster === '0' &&
                      values.claim === '0' &&
                      value === '0' &&
                      values.stake === '0'
                  )
                  setFieldValue('addBooster', value)
                }}
              />
            </FormItem>
            <Button
              variant="solid"
              type="button"
              loading={
                isSubmitting.loading && isSubmitting.type === 'addBooster'
              }
              disabled={isSubmitting.loading}
              onClick={() => onSetFee('addBooster', values.addBooster)}
            >
              {isSubmitting.loading && isSubmitting.type === 'addBooster'
                ? 'Loading'
                : 'Set'}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <FormItem
              className="flex-1"
              label="Remove Booster"
              invalid={
                (errors.removeBooster && touched.removeBooster) as boolean
              }
              errorMessage={errors.removeBooster}
            >
              <Field
                type="text"
                autoComplete="off"
                name="removeBooster"
                component={Input}
                disabled={isSubmitting.loading}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  setFieldValue(
                    'isInWhiteList',
                    values.addBooster === '0' &&
                      values.withdraw === '0' &&
                      values.claim === '0' &&
                      value === '0' &&
                      values.stake === '0'
                  )
                  setFieldValue('removeBooster', value)
                }}
              />
            </FormItem>
            <Button
              variant="solid"
              type="button"
              disabled={isSubmitting.loading}
              loading={
                isSubmitting.loading && isSubmitting.type === 'removeBooster'
              }
              onClick={() => onSetFee('removeBooster', values.removeBooster)}
            >
              {isSubmitting.loading && isSubmitting.type === 'removeBooster'
                ? 'Loading'
                : 'Set'}
            </Button>
          </div>
        </div>
      </FormContainer>
    </Form>
  )
}

export default SetFeeForm
