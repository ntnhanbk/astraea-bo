import { forwardRef, useRef, useState } from 'react'
import { HiOutlineFilter, HiOutlineSearch } from 'react-icons/hi'

import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { Field, Form, Formik, FormikProps } from 'formik'
import type { MouseEvent } from 'react'

type FormModel = {
  name: string
}

type FilterFormProps = {
  onSubmitComplete?: () => void
}

type DrawerFooterProps = {
  onSaveClick: (event: MouseEvent<HTMLButtonElement>) => void
  onCancel: (event: MouseEvent<HTMLButtonElement>) => void
}

const FilterForm = forwardRef<FormikProps<FormModel>, FilterFormProps>(
  ({ onSubmitComplete }, ref) => {
    const handleSubmit = (values: FormModel) => {
      onSubmitComplete?.()
    }

    return (
      <Formik
        enableReinitialize
        innerRef={ref}
        initialValues={{ name: '' }}
        onSubmit={(values) => {
          handleSubmit(values)
        }}
      >
        {({ values, touched, errors }) => (
          <Form>
            <FormContainer>
              <FormItem
                invalid={errors.name && touched.name}
                errorMessage={errors.name}
              >
                <h6 className="mb-4">Included text</h6>
                <Field
                  type="text"
                  autoComplete="off"
                  name="name"
                  placeholder="Keyword"
                  component={Input}
                  prefix={<HiOutlineSearch className="text-lg" />}
                />
              </FormItem>
            </FormContainer>
          </Form>
        )}
      </Formik>
    )
  }
)

const DrawerFooter = ({ onSaveClick, onCancel }: DrawerFooterProps) => {
  return (
    <div className="text-right w-full">
      <Button size="sm" className="mr-2" onClick={onCancel}>
        Cancel
      </Button>
      <Button size="sm" variant="solid" onClick={onSaveClick}>
        Query
      </Button>
    </div>
  )
}

const StakingFilter = () => {
  const formikRef = useRef<FormikProps<FormModel>>(null)

  const [isOpen, setIsOpen] = useState(false)

  const openDrawer = () => {
    setIsOpen(true)
  }

  const onDrawerClose = () => {
    setIsOpen(false)
  }

  const formSubmit = () => {
    formikRef.current?.submitForm()
  }

  return (
    <>
      <Button
        size="sm"
        className="block md:inline-block ltr:md:ml-2 rtl:md:mr-2 md:mb-0 mb-4"
        icon={<HiOutlineFilter />}
        onClick={() => openDrawer()}
      >
        Filter
      </Button>
      <Drawer
        title="Filter"
        isOpen={isOpen}
        footer={
          <DrawerFooter onCancel={onDrawerClose} onSaveClick={formSubmit} />
        }
        onClose={onDrawerClose}
        onRequestClose={onDrawerClose}
      >
        <FilterForm ref={formikRef} onSubmitComplete={onDrawerClose} />
      </Drawer>
    </>
  )
}

FilterForm.displayName = 'FilterForm'

export default StakingFilter
