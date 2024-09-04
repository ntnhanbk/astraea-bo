import Loading from '@/components/shared/Loading'
import {
  LAYOUT_TYPE_BLANK,
  LAYOUT_TYPE_CLASSIC,
  LAYOUT_TYPE_DECKED,
  LAYOUT_TYPE_MODERN,
  LAYOUT_TYPE_SIMPLE,
  LAYOUT_TYPE_STACKED_SIDE,
} from '@/constants/theme.constant'
import { useAppSelector } from '@/store'
import useAuth from '@/utils/hooks/useAuth'
import useDirection from '@/utils/hooks/useDirection'
import useLocale from '@/utils/hooks/useLocale'
import { useWeb3ModalTheme } from '@web3modal/wagmi/react'
import { Suspense, lazy, useEffect, useMemo } from 'react'

const layouts = {
  [LAYOUT_TYPE_CLASSIC]: lazy(() => import('./ClassicLayout')),
  [LAYOUT_TYPE_MODERN]: lazy(() => import('./ModernLayout')),
  [LAYOUT_TYPE_STACKED_SIDE]: lazy(() => import('./StackedSideLayout')),
  [LAYOUT_TYPE_SIMPLE]: lazy(() => import('./SimpleLayout')),
  [LAYOUT_TYPE_DECKED]: lazy(() => import('./DeckedLayout')),
  [LAYOUT_TYPE_BLANK]: lazy(() => import('./BlankLayout')),
}

const Layout = () => {
  const layoutType = useAppSelector((state) => state.theme.layout.type)
  const mode = useAppSelector((state) => state.theme.mode)
  const { authenticated } = useAuth()
  const { setThemeMode } = useWeb3ModalTheme()

  useEffect(() => {
    setThemeMode(mode)
  }, [mode])

  useDirection()

  useLocale()

  const AppLayout = useMemo(() => {
    if (authenticated) {
      return layouts[layoutType]
    }
    return lazy(() => import('./AuthLayout'))
  }, [layoutType, authenticated])

  return (
    <Suspense
      fallback={
        <div className="flex flex-auto flex-col h-[100vh]">
          <Loading loading={true} />
        </div>
      }
    >
      <AppLayout />
    </Suspense>
  )
}

export default Layout
