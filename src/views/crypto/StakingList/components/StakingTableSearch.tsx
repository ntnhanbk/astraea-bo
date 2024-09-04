import { useRef } from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'

import debounce from 'lodash/debounce'
import type { ChangeEvent } from 'react'
import {
  getStakingList,
  setTableData,
  useAppDispatch,
  useAppSelector,
} from '../store'
import { cloneDeep } from 'lodash'
import { TableQueries } from '@/@types/common'

const StakingTableSearch = () => {
  const dispatch = useAppDispatch()

  const searchInput = useRef(null)

  const tableData = useAppSelector((state) => state.stakingList.data.tableData)

  const debounceFn = debounce(handleDebounceFn, 300)

  function handleDebounceFn(val: string) {
    const newTableData = cloneDeep(tableData)
    newTableData.query = val
    newTableData.page = 1
    if (typeof val === 'string' && val.length >= 1) {
      fetchData(newTableData)
    }

    if (typeof val === 'string' && val.length === 0) {
      fetchData(newTableData)
    }
  }

  const fetchData = (data: TableQueries) => {
    dispatch(setTableData(data))
    dispatch(getStakingList(data))
  }

  const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
    debounceFn(e.target.value)
  }

  return (
    <Input
      ref={searchInput}
      className="max-w-md md:w-52 md:mb-0 mb-4"
      size="sm"
      placeholder="Search staking"
      prefix={<HiOutlineSearch className="text-lg" />}
      onChange={onEdit}
    />
  )
}

export default StakingTableSearch
