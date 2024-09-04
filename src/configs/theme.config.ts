import { THEME_ENUM } from '@/constants/theme.constant'
import {
  Direction,
  Mode,
  ColorLevel,
  NavMode,
  ControlSize,
  LayoutType,
} from '@/@types/theme'

export type ThemeConfig = {
  themeColor: string
  direction: Direction
  mode: Mode
  primaryColorLevel: ColorLevel
  panelExpand: boolean
  navMode: NavMode
  controlSize: ControlSize
  cardBordered: boolean
  layout: {
    type: LayoutType
    sideNavCollapse: boolean
  }
}

export const themeConfig: ThemeConfig = {
  themeColor: 'indigo',
  direction: THEME_ENUM.DIR_LTR,
  mode: THEME_ENUM.MODE_LIGHT,
  primaryColorLevel: 600,
  cardBordered: true,
  panelExpand: false,
  controlSize: 'md',
  navMode: THEME_ENUM.NAV_MODE_LIGHT,
  layout: {
    type: THEME_ENUM.LAYOUT_TYPE_MODERN,
    sideNavCollapse: false,
  },
}
