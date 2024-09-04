import Button from '@/components/ui/Button'
import { FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { Field, Form, Formik, FormikState } from 'formik'
import * as Yup from 'yup'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { apiChangePassword } from '@/services/AuthService'
import { ChangePasswordPassword } from '@/@types/auth'

type PasswordFormModel = {
  password: string
  newPassword: string
  confirmNewPassword: string
}

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Password Required'),
  newPassword: Yup.string()
    .required('Enter your new password')
    .min(6, 'Too Short!'),
  // .matches(/^[A-Za-z0-9_-]*$/, 'Only Letters & Numbers Allowed')
  confirmNewPassword: Yup.string().oneOf(
    [Yup.ref('newPassword'), ''],
    'Password not match'
  ),
})

const Password = () => {
  const onFormSubmit = async (
    values: PasswordFormModel,
    setSubmitting: (isSubmitting: boolean) => void,
    resetForm: (
      nextState?:
        | Partial<
            FormikState<{
              password: string
              newPassword: string
              confirmNewPassword: string
            }>
          >
        | undefined
    ) => void
  ) => {
    try {
      const payload: ChangePasswordPassword = {
        oldPassword: values.password,
        password: values.newPassword,
        confirmPassword: values.confirmNewPassword,
      }
      await apiChangePassword(payload)
      toast.push(<Notification title={'Password updated'} type="success" />, {
        placement: 'top-center',
      })
      setSubmitting(false)
      resetForm()
    } catch (error: any) {
      console.log({ error })
      toast.push(
        <Notification
          title={error?.response?.data?.message || 'Update error'}
          type="danger"
        />,
        {
          placement: 'top-center',
        }
      )
      setSubmitting(false)
    }
  }

  return (
    <>
      <Formik
        initialValues={{
          password: '',
          newPassword: '',
          confirmNewPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true)
          onFormSubmit(values, setSubmitting, resetForm)
        }}
      >
        {({ touched, errors, isSubmitting, resetForm }) => {
          const validatorProps = { touched, errors }
          return (
            <Form>
              <FormContainer>
                <FormDesription
                  title="Password"
                  desc="Enter your current & new password to reset your password"
                />
                <FormRow
                  name="password"
                  label="Current Password"
                  {...validatorProps}
                >
                  <Field
                    type="password"
                    autoComplete="off"
                    name="password"
                    placeholder="Current Password"
                    component={Input}
                  />
                </FormRow>
                <FormRow
                  name="newPassword"
                  label="New Password"
                  {...validatorProps}
                >
                  <Field
                    type="password"
                    autoComplete="off"
                    name="newPassword"
                    placeholder="New Password"
                    component={Input}
                  />
                </FormRow>
                <FormRow
                  name="confirmNewPassword"
                  label="Confirm Password"
                  {...validatorProps}
                >
                  <Field
                    type="password"
                    autoComplete="off"
                    name="confirmNewPassword"
                    placeholder="Confirm Password"
                    component={Input}
                  />
                </FormRow>
                <div className="mt-4 ltr:text-right">
                  <Button
                    className="ltr:mr-2 rtl:ml-2"
                    type="button"
                    onClick={() => resetForm()}
                  >
                    Reset
                  </Button>
                  <Button variant="solid" loading={isSubmitting} type="submit">
                    {isSubmitting ? 'Updating' : 'Update Password'}
                  </Button>
                </div>
              </FormContainer>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default Password
