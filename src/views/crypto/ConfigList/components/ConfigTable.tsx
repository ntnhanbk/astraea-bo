import { useEffect, useMemo, useRef } from 'react'

import { Config } from '@/@types/config'
import type {
  ColumnDef,
  DataTableResetHandle,
} from '@/components/shared/DataTable'
import { getConfigFee, useAppDispatch, useAppSelector } from '../store'
import ActionColumn from './ActionColumn'
import DataTable from '@/components/shared/DataTable'
import ConfigDeleteConfirmation from './ConfigDeleteDeleteConfirmation'
import convertToTitleCase from '@/utils/convertToTitleCase'

const ConfigTable = () => {
  const tableRef = useRef<DataTableResetHandle>(null)
  const dispatch = useAppDispatch()

  const loading = useAppSelector((state) => state.configFee.data.loading)

  const actions = useAppSelector((state) => state.configFee.data.actions)

  const columns: ColumnDef<{ action: string; fee: number }>[] = useMemo(
    () => [
      {
        header: 'Action',
        accessorKey: 'action-key',
        cell: (props) => {
          const row = props.row.original
          return convertToTitleCase(row.action)
        },
      },
      {
        header: 'Fee',
        accessorKey: 'fee',
        sortable: false,
        cell: (props) => {
          const row = props.row.original
          return row.fee
        },
      },
      {
        header: '',
        id: 'action',
        cell: (props) => <ActionColumn row={props.row.original} />,
      },
    ],
    []
  )

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    dispatch(getConfigFee())
  }

  return (
    <>
      <DataTable
        ref={tableRef}
        columns={columns}
        data={actions}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ className: 'rounded-md' }}
        loading={loading}
        disabledPaginate
      />
      <ConfigDeleteConfirmation />
    </>
  )
}

export default ConfigTable
