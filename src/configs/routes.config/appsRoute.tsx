import { lazy } from 'react'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const appsRoute: Routes = [
  {
    key: 'appsCrypto.staking',
    path: `${APP_PREFIX_PATH}/staking`,
    component: lazy(() => import('@/views/crypto/StakingList')),
    authority: [ADMIN, USER],
  },
  {
    key: 'appsCrypto.configs',
    path: `${APP_PREFIX_PATH}/configs`,
    component: lazy(() => import('@/views/crypto/ConfigList')),
    authority: [ADMIN, USER],
  },
  {
    key: 'appsCrypto.stakingNew',
    path: `${APP_PREFIX_PATH}/staking-new`,
    component: lazy(() => import('@/views/crypto/StakingNew')),
    authority: [ADMIN, USER],
  },
  {
    key: 'appsCrypto.stakingEdit',
    path: `${APP_PREFIX_PATH}/staking-edit/:id`,
    component: lazy(() => import('@/views/crypto/StakingNew')),
    authority: [ADMIN, USER],
  },
  {
    key: 'appsAccount.settings',
    path: `${APP_PREFIX_PATH}/account/change-password`,
    component: lazy(() => import('@/views/account/Settings')),
    authority: [ADMIN, USER],
    meta: {
      header: 'Change Password',
      headerContainer: true,
    },
  },
]

export default appsRoute
