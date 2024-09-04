import { useEffect, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import { HiOutlinePlus } from 'react-icons/hi'
import { FieldInputProps, FormikProps } from 'formik'
import classNames from 'classnames'

type Props = {
  field: FieldInputProps<any>
  form: FormikProps<any>
}

const StakingImage = (props: Props) => {
  const { field, form } = props
  const [avatarImg, setAvatarImg] = useState<string | null>(null)

  useEffect(() => {
    if (!field.value || typeof field.value !== 'string') return
    setAvatarImg(field.value)
    form.setFieldValue('isFileChange', false)
  }, [field.value])

  const onFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setAvatarImg(URL.createObjectURL(files[0]))
      form.setFieldValue(field.name, files[0])
      form.setFieldValue('isFileChange', true)
    }
  }

  const beforeUpload = (files: FileList | null) => {
    let valid: string | boolean = true

    const allowedFileType = ['image/jpeg', 'image/png', 'image/jpg']
    if (files && files[0]) {
      const file = files[0]
      if (!allowedFileType.includes(file.type)) {
        valid = 'Please upload a .jpeg or .png file!'
      }
    }
    return valid
  }

  return (
    <div>
      <Upload
        className="cursor-pointer"
        showList={false}
        uploadLimit={1}
        beforeUpload={beforeUpload}
        onChange={onFileUpload}
      >
        <Avatar
          className={classNames('w-full h-64', !avatarImg && '!w-64')}
          src={avatarImg as string}
          icon={<HiOutlinePlus />}
        />
      </Upload>
    </div>
  )
}

export default StakingImage
