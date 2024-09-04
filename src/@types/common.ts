import { ReactNode, CSSProperties } from 'react'

export interface CommonProps {
  className?: string
  children?: ReactNode
  style?: CSSProperties
}

export type TableQueries = {
  count?: number
  page?: number
  size?: number
  query?: string
  sort?: {
    order: 'asc' | 'desc' | ''
    key: string | number
  }
}
