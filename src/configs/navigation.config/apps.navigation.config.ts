import { APP_PREFIX_PATH } from '@/constants/route.constant'
import {
  NAV_ITEM_TYPE_TITLE,
  NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const appsNavigationConfig: NavigationTree[] = [
  {
    key: 'apps',
    path: '',
    title: 'APPS',
    translateKey: 'nav.apps',
    icon: 'apps',
    type: NAV_ITEM_TYPE_TITLE,
    authority: [ADMIN, USER],
    subMenu: [
      {
        key: 'appsCrypto.staking',
        path: `${APP_PREFIX_PATH}/staking`,
        title: 'Staking',
        translateKey: 'Staking',
        icon: 'staking',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        subMenu: [],
      },
      {
        key: 'appsCrypto.configs',
        path: `${APP_PREFIX_PATH}/configs`,
        title: 'Configs',
        translateKey: 'Configs',
        icon: 'configs',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        subMenu: [],
      },
    ],
  },
]

export default appsNavigationConfig
