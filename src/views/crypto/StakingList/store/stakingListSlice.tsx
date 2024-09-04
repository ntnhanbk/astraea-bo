import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import type { TableQueries } from '@/@types/common'
import { apiDeleteStaking, apiGetStakingList } from '@/services/StakingService'

type Staking = {
  id: string
  name: string
  image: string
  description: string
  externalLink: string
  rewardToken: string
}

type StakingList = Staking[]

type GetStakingListResponse = {
  items: StakingList
  paginate: {
    page: number
    size: number
    count: number
  }
}

type FilterQueries = {
  name: string
}

export type StakingListState = {
  loading: boolean
  deleteConfirmation: boolean
  selected: string
  tableData: TableQueries
  filterData: FilterQueries
  stakingList: Staking[]
}

type GetStakingListRequest = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'stakingList'

export const getStakingList = createAsyncThunk(
  SLICE_NAME + '/getStakingList',
  async (data: GetStakingListRequest) => {
    const response = await apiGetStakingList<
      GetStakingListResponse,
      GetStakingListRequest
    >(data)
    return response.data
  }
)

export const deleteStaking = async (data: { id: string }) => {
  const response = await apiDeleteStaking<boolean, { id: string }>(data)
  return response
}

export const initialTableData: TableQueries = {
  count: 0,
  page: 1,
  size: 10,
  query: '',
  sort: {
    order: '',
    key: '',
  },
}

const initialState: StakingListState = {
  loading: false,
  deleteConfirmation: false,
  selected: '',
  stakingList: [],
  tableData: initialTableData,
  filterData: {
    name: '',
  },
}

const stakingListSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    updateStakingList: (state, action) => {
      state.stakingList = action.payload
    },
    setTableData: (state, action) => {
      state.tableData = action.payload
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload
    },
    toggleDeleteConfirmation: (state, action) => {
      state.deleteConfirmation = action.payload
    },
    setSelectedStaking: (state, action) => {
      state.selected = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStakingList.fulfilled, (state, action) => {
        state.stakingList = action.payload.items
        state.tableData.count = action.payload.paginate.count
        state.tableData.page = action.payload.paginate.page
        state.loading = false
      })
      .addCase(getStakingList.pending, (state) => {
        state.loading = true
      })
  },
})

export const {
  updateStakingList,
  setTableData,
  setFilterData,
  toggleDeleteConfirmation,
  setSelectedStaking,
} = stakingListSlice.actions

export default stakingListSlice.reducer
