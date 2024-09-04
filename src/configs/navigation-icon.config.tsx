import { HiOutlineCurrencyDollar, HiOutlineViewGridAdd } from 'react-icons/hi'
import { IoLayersOutline } from 'react-icons/io5'
import { MdOutlineSettings } from 'react-icons/md'
import { RxDashboard } from 'react-icons/rx'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
  apps: <HiOutlineViewGridAdd />,
  crypto: <HiOutlineCurrencyDollar />,
  dashboard: <RxDashboard />,
  staking: <IoLayersOutline />,
  configs: <MdOutlineSettings />,
}

export default navigationIcon
