import Header from '@/components/template/Header'
import MobileNav from '@/components/template/MobileNav'
import Notification from '@/components/template/Notification'
import Search from '@/components/template/Search'
import SideNav from '@/components/template/SideNav'
import SideNavToggle from '@/components/template/SideNavToggle'
import SidePanel from '@/components/template/SidePanel'
import UserDropdown from '@/components/template/UserDropdown'
import View from '@/views'
import ConnectWallet from '../template/ConnectWallet'

const HeaderActionsStart = () => {
  return (
    <>
      <MobileNav />
      <SideNavToggle />
    </>
  )
}

const HeaderActionsEnd = () => {
  return (
    <>
      <ConnectWallet />
      <SidePanel />
      <UserDropdown hoverable={false} />
    </>
  )
}

const ModernLayout = () => {
  return (
    <div className="app-layout-modern flex flex-auto flex-col">
      <div className="flex flex-auto min-w-0">
        <SideNav />
        <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          <Header
            className="border-b border-gray-200 dark:border-gray-700"
            headerEnd={<HeaderActionsEnd />}
            headerStart={<HeaderActionsStart />}
          />
          <View />
        </div>
      </div>
    </div>
  )
}

export default ModernLayout