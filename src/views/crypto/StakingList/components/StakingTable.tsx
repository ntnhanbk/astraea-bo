import DataTable from '@/components/shared/DataTable'
import Avatar from '@/components/ui/Avatar'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useRef } from 'react'
import { FiPackage } from 'react-icons/fi'

import { Staking } from '@/@types/staking'
import type {
  ColumnDef,
  DataTableResetHandle,
  OnSortParam,
} from '@/components/shared/DataTable'
import cleanHtml from '@/utils/cleanHtml'
import {
  getStakingList,
  setTableData,
  useAppDispatch,
  useAppSelector,
} from '../store'
import StakingDeleteConfirmation from './StakingDeleteConfirmation'
import ActionColumn from './ActionColumn'

const StakingColumn = ({ row }: { row: Staking }) => {
  const avatar =
    row.img && row.img.startsWith('https://') ? (
      <Avatar src={row.img} />
    ) : (
      <Avatar icon={<FiPackage />} />
    )
  return (
    <div className="flex items-center">
      {avatar}
      <span className={`ml-2 rtl:mr-2 font-semibold`}>{row.name}</span>
    </div>
  )
}

const StakingTable = () => {
  const tableRef = useRef<DataTableResetHandle>(null)
  const dispatch = useAppDispatch()
  const { page, size, sort, query, count } = useAppSelector(
    (state) => state.stakingList.data.tableData
  )

  const filterData = useAppSelector(
    (state) => state.stakingList.data.filterData
  )

  const loading = useAppSelector((state) => state.stakingList.data.loading)

  const data = useAppSelector((state) => state.stakingList.data.stakingList)

  const tableData = useMemo(
    () => ({ page, size, sort, query, count }),
    [page, size, sort, query, count]
  )

  const columns: ColumnDef<Staking>[] = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        cell: (props) => {
          const row = props.row.original
          return <StakingColumn row={row} />
        },
      },
      {
        header: 'Description',
        accessorKey: 'description',
        sortable: false,
        cell: (props) => {
          const row = props.row.original
          const clean = cleanHtml(row.description)
          return <div dangerouslySetInnerHTML={{ __html: clean }} />
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
  }, [page, size, sort])

  const fetchData = () => {
    dispatch(getStakingList({ page, size, sort, query, filterData }))
  }

  const onPaginationChange = (page: number) => {
    const newTableData = cloneDeep(tableData)
    newTableData.page = page
    dispatch(setTableData(newTableData))
  }

  const onSelectChange = (value: number) => {
    const newTableData = cloneDeep(tableData)
    newTableData.size = Number(value)
    newTableData.page = 1
    dispatch(setTableData(newTableData))
  }

  const onSort = (sort: OnSortParam) => {
    const newTableData = cloneDeep(tableData)
    newTableData.sort = sort
    dispatch(setTableData(newTableData))
  }

  return (
    <>
      <DataTable
        ref={tableRef}
        columns={columns}
        data={data}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ className: 'rounded-md' }}
        loading={loading}
        pagingData={{
          count: tableData.count as number,
          page: tableData.page as number,
          size: tableData.size as number,
        }}
        onPaginationChange={onPaginationChange}
        onSelectChange={onSelectChange}
        onSort={onSort}
      />
      <StakingDeleteConfirmation />
    </>
  )
}

export default StakingTable
