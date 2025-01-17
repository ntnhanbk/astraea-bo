import navigationIcon from '@/configs/navigation-icon.config'
import { useAppSelector } from '@/store'
import type { ElementType, ComponentPropsWithRef } from 'react'

type VerticalMenuIconProps = {
  icon: string
  gutter: string
}

export const Icon = <T extends ElementType>({
  component,
  ...props
}: {
  header: T
} & ComponentPropsWithRef<T>) => {
  const Component = component
  return <Component {...props} />
}

const VerticalMenuIcon = ({ icon, gutter }: VerticalMenuIconProps) => {
  const { sideNavCollapse } = useAppSelector((state) => state.theme.layout)
  if (typeof icon !== 'string' && !icon) {
    return <></>
  }

  return (
    <span
      className={`text-2xl ${
        gutter && !sideNavCollapse ? 'ltr:mr-2 rtl:ml-2' : ''
      }`}
    >
      {navigationIcon[icon]}
    </span>
  )
}

VerticalMenuIcon.defaultProps = {
  gutter: true,
}

export default VerticalMenuIcon
