import { Staking } from '@/@types/staking'
import AdaptableCard from '@/components/shared/AdaptableCard'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { apiGetStakingById } from '@/services/StakingService'
import classNames from 'classnames'
import { Field, FieldProps, FormikErrors, FormikTouched } from 'formik'
import { ChangeEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import StakingImage from '../StakingNew/components/StakingImage'
import { Select } from '@/components/ui'
import store, { ChainEnum, useAppSelector } from '@/store'
import { useNetwork, useSwitchNetwork } from 'wagmi'
import appConfig from '@/configs/app.config'

type FormFieldsName = {
  file: File
  name: string
  rewardCoin: string
  rewardCoinName: string
  rewardCoinPrice: number
  stakeCoin: string
  stakeCoinName: string
  stakeCoinPrice: number
  description: string
  booster: string
  boosterName: string
  boosterRatio: 0
}

type BasicInformationFields = {
  touched: FormikTouched<FormFieldsName>
  errors: FormikErrors<FormFieldsName>
  values: FormFieldsName
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<FormFieldsName>>
  isSubmitting: boolean
}

const coinCronosOption: any = []

const coinPolygonOption = [
  {
    label: 'Soin',
    symbol: 'SOIN',
    value: '0x671c6896e598312853d0373501a226c1e1C19988',
  },
  {
    label: 'Social Interactive Coin',
    symbol: 'SIC',
    value: '0xc311fce99e622b89f273a38ce8ceb73d60ec9c20',
  },
  {
    label: 'Thao Nhan Coin',
    symbol: 'TNC',
    value: '0xa01691cde53a68bd9525e31e76d4edbf12d2ec74',
  },
]

const BasicInformationFields = (props: BasicInformationFields) => {
  const { touched, errors, setFieldValue, isSubmitting, values } = props
  const { id } = useParams()
  const [data, setData] = useState<Staking | undefined>()
  const chainConnected = useAppSelector(
    (state) => state.auth.user.wallet?.chain
  )
  const { chain } = useNetwork()

  useEffect(() => {
    const chainStored = store.getState().auth.user.wallet?.chain
    const chainConnected =
      chainStored === ChainEnum.CRONOS ? appConfig.chain[0] : appConfig.chain[1]
    if (chainConnected !== chain) {
      setFieldValue('coin', '')
    }
  }, [chain])

  useEffect(() => {
    fetchStakingById()
  }, [id])

  const fetchStakingById = async () => {
    try {
      if (!id) return
      const { data } = await apiGetStakingById<Staking, { id: string }>({
        id,
      })
      if (data) {
        setData(data)
        setFieldValue('imageOriginalUrl', data.img)
        setFieldValue('file', data.img)
        setFieldValue('name', data.name)
        setFieldValue('description', data.description)
        setFieldValue('stakeCoinName', data?.info.stakeCoinName)
        setFieldValue('stakeCoinPrice', data?.info.stakeCoinPrice)
        setFieldValue('stakeCoin', data?.info.stakeCoin)
        setFieldValue('rewardCoinName', data?.info.rewardCoinName)
        setFieldValue('rewardCoinPrice', data?.info.rewardCoinPrice)
        setFieldValue('rewardCoin', data?.info.rewardCoin)
        setFieldValue('booster', data?.info.booster)
        setFieldValue('boosterName', data?.info.boosterName)
        setFieldValue('boosterRatio', data?.info.boosterRatio)
      }
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <AdaptableCard divider className="mb-4">
      <h5>Basic Information</h5>
      <p className="mb-6">Section to config basic staking information</p>
      <div className="mb-6">
        <FormItem
          label="Image"
          invalid={errors.file as any}
          errorMessage={errors.file as string}
        >
          <Field name="file" disabled={isSubmitting}>
            {({ field, form }: FieldProps) => {
              return <StakingImage field={field} form={form} />
            }}
          </Field>
        </FormItem>
      </div>
      <FormItem
        label="Name"
        invalid={(errors.name && touched.name) as boolean}
        errorMessage={errors.name}
      >
        <Field
          type="text"
          autoComplete="off"
          name="name"
          placeholder="Name"
          component={Input}
          disabled={isSubmitting}
        />
      </FormItem>
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
        <FormItem
          className="col-span-1"
          label="Stake Coin Name"
          invalid={(errors.stakeCoinName && touched.stakeCoinName) as boolean}
          errorMessage={errors.stakeCoinName}
        >
          <Field name="stakeCoinName">
            {({ field, form }: FieldProps) => (
              <Select
                field={field}
                form={form}
                isDisabled={Boolean(id || isSubmitting)}
                options={
                  chainConnected === ChainEnum.CRONOS
                    ? coinCronosOption
                    : coinPolygonOption
                }
                value={(chainConnected === ChainEnum.CRONOS
                  ? coinCronosOption
                  : coinPolygonOption
                ).filter(
                  (option: any) =>
                    option &&
                    option.value ===
                      (values.stakeCoin.includes('|')
                        ? values.stakeCoin.split('|')[2]
                        : values.stakeCoin)
                )}
                onChange={(option) => {
                  console.log(option)
                  form.setFieldValue(
                    field.name,
                    `${option?.label}|${option?.symbol}|${option?.value}`
                  )
                }}
              />
            )}
          </Field>
        </FormItem>

        <FormItem
          className="col-span-1"
          label="Stake Coin Price"
          invalid={(errors.stakeCoinPrice && touched.stakeCoinPrice) as boolean}
          errorMessage={errors.stakeCoinPrice}
        >
          <Field
            type="text"
            autoComplete="off"
            name="stakeCoinPrice"
            placeholder="Stake coin price"
            component={Input}
            step="0.00000001"
            disabled={isSubmitting}
          />
        </FormItem>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
        <FormItem
          className="col-span-1"
          label="Reward Coin Name"
          invalid={(errors.rewardCoinName && touched.rewardCoinName) as boolean}
          errorMessage={errors.rewardCoinName}
        >
          <Field name="rewardCoinName">
            {({ field, form }: FieldProps) => (
              <Select
                field={field}
                form={form}
                isDisabled={Boolean(id || isSubmitting)}
                options={
                  chainConnected === ChainEnum.CRONOS
                    ? coinCronosOption
                    : coinPolygonOption
                }
                value={(chainConnected === ChainEnum.CRONOS
                  ? coinCronosOption
                  : coinPolygonOption
                ).filter(
                  (option: any) =>
                    option &&
                    option.value ===
                      (values.rewardCoin.includes('|')
                        ? values.rewardCoin.split('|')[2]
                        : values.rewardCoin)
                )}
                onChange={(option) =>
                  form.setFieldValue(
                    field.name,
                    `${option?.label}|${option?.symbol}|${option?.value}`
                  )
                }
              />
            )}
          </Field>
        </FormItem>
        <FormItem
          className="col-span-1"
          label="Reward Coin Price"
          invalid={
            (errors.rewardCoinPrice && touched.rewardCoinPrice) as boolean
          }
          errorMessage={errors.rewardCoinPrice}
        >
          <Field
            type="text"
            autoComplete="off"
            name="rewardCoinPrice"
            placeholder="Reward coin price"
            component={Input}
            step="0.00000001"
            disabled={isSubmitting}
          />
        </FormItem>
      </div>
      <div className={classNames('grid grid-cols-1 lg:grid-cols-3 lg:gap-4')}>
        <FormItem
          className="col-span-2"
          label="Booster Name"
          invalid={(errors.boosterName && touched.boosterName) as boolean}
          errorMessage={errors.boosterName}
        >
          <Field
            type="text"
            autoComplete="off"
            name="boosterName"
            placeholder="Booster name"
            component={Input}
            disabled={isSubmitting}
          />
        </FormItem>
        <FormItem
          className="col-span-1"
          label="Booster Ratio (1-32%)"
          invalid={(errors.boosterRatio && touched.boosterRatio) as boolean}
          errorMessage={errors.boosterRatio}
        >
          <Field
            type="text"
            autoComplete="off"
            name="boosterRatio"
            placeholder="0"
            disabled={isSubmitting}
            component={Input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value
              setFieldValue('boosterRatio', +value)
              id &&
                setFieldValue(
                  'isBoosterRatioChanged',
                  +value !== data?.info.boosterRatio
                )
            }}
          />
        </FormItem>
      </div>
      <FormItem
        className="col-span-1"
        label="Booster Address"
        invalid={(errors.booster && touched.booster) as boolean}
        errorMessage={errors.booster}
      >
        <Field
          type="text"
          autoComplete="off"
          name="booster"
          placeholder="0x..."
          component={Input}
          disabled={id || isSubmitting}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            setFieldValue('booster', value)
            id &&
              setFieldValue(
                'isBoosterAddressChanged',
                value !== data?.info.booster
              )
          }}
        />
      </FormItem>
      <FormItem
        label="Description"
        labelClass="!justify-start"
        invalid={(errors.description && touched.description) as boolean}
        errorMessage={errors.description}
      >
        <Field name="description" disabled={isSubmitting}>
          {({ field, form }: FieldProps) => (
            <RichTextEditor
              readOnly={isSubmitting}
              value={field.value}
              onChange={(val) => form.setFieldValue(field.name, val)}
            />
          )}
        </Field>
      </FormItem>
    </AdaptableCard>
  )
}

export default BasicInformationFields
