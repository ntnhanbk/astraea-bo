import type { CommonProps } from '@/@types/common'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import { useAppSelector } from '@/store'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useAuth from '@/utils/hooks/useAuth'
import classNames from 'classnames'
import { HiOutlineLogout, HiOutlineUser } from 'react-icons/hi'
import { MdOutlinePassword } from 'react-icons/md'
import { Link } from 'react-router-dom'

type DropdownList = {
  label: string
  path: string
  icon: JSX.Element
}

const dropdownItemList: DropdownList[] = [
  {
    label: 'Change Password',
    path: '/app/account/change-password',
    icon: <MdOutlinePassword />,
  },
]

const _UserDropdown = ({ className }: CommonProps) => {
  const { avatar, username, authority } = useAppSelector(
    (state) => state.auth.user
  )

  const { signOut } = useAuth()

  const UserAvatar = (
    <div className={classNames(className, 'flex items-center gap-2')}>
      <Avatar
        size={32}
        shape="circle"
        src={avatar || '/img/logo/logo-dark-streamline.png'}
      />
      <div className="hidden md:block">
        <div className="text-xs capitalize">{authority || 'guest'}</div>
        <div className="font-bold">{username}</div>
      </div>
    </div>
  )

  return (
    <div>
      <Dropdown
        menuStyle={{ minWidth: 240 }}
        renderTitle={UserAvatar}
        placement="bottom-end"
      >
        <Dropdown.Item variant="header">
          <div className="py-2 px-3 flex items-center gap-2">
            <Avatar
              shape="circle"
              src={avatar || '/img/logo/logo-dark-streamline.png'}
            />
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100">
                {username}
              </div>
              <div className="text-xs">{username}</div>
            </div>
          </div>
        </Dropdown.Item>
        <Dropdown.Item variant="divider" />
        {dropdownItemList.map((item) => (
          <Dropdown.Item
            key={item.label}
            eventKey={item.label}
            className="mb-1 px-0"
          >
            <Link className="flex h-full w-full px-2" to={item.path}>
              <span className="flex gap-2 items-center w-full">
                <span className="text-xl opacity-50">{item.icon}</span>
                <span>{item.label}</span>
              </span>
            </Link>
          </Dropdown.Item>
        ))}
        <Dropdown.Item variant="divider" />
        <Dropdown.Item eventKey="Sign Out" className="gap-2" onClick={signOut}>
          <span className="text-xl opacity-50">
            <HiOutlineLogout />
          </span>
          <span>Sign Out</span>
        </Dropdown.Item>
      </Dropdown>
    </div>
  )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
