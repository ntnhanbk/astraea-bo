import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import type { TableQueries } from '@/@types/common'
import { apiDeleteConfig, apiGetConfigByKey } from '@/services/ConfigService'

type Config = {
  _id: string
  key: string
  value?: {
    action: string
    fee: number
  }[]
  unit?: string
}

type FilterQueries = {
  name: string
}

export type ConfigFeeState = {
  loading: boolean
  selected: string
  deleteConfirmation: boolean
  tableData: TableQueries
  filterData: FilterQueries
  configList: Config[]
  actions: { action: string; fee: number }[]
  id: string
}

export const SLICE_NAME = 'configFee'

export const getConfigFee = createAsyncThunk(
  SLICE_NAME + '/getConfigFee',
  async () => {
    const { data } = await apiGetConfigByKey<Config[]>({
      keys: 'defaultFee',
    })
    const actions: any = data?.[0]?.value
    return {
      id: data?.[0]._id,
      actions: JSON.parse(actions!) ?? [],
    }
  }
)

export const deleteConfig = async (data: { id: string }) => {
  const response = await apiDeleteConfig<{ id: string }>(data)
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

const initialState: ConfigFeeState = {
  id: '',
  loading: false,
  deleteConfirmation: false,
  selected: '',
  configList: [],
  tableData: initialTableData,
  filterData: {
    name: '',
  },
  actions: [],
}

const configListSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    updateConfigList: (state, action) => {
      state.configList = action.payload
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
    setSelectedConfig: (state, action) => {
      state.selected = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConfigFee.fulfilled, (state, action) => {
        state.actions = action.payload.actions
        state.id = action.payload.id
        state.loading = false
      })
      .addCase(getConfigFee.pending, (state) => {
        state.loading = true
      })
  },
})

export const {
  updateConfigList,
  setTableData,
  setFilterData,
  toggleDeleteConfirmation,
  setSelectedConfig,
} = configListSlice.actions

export default configListSlice.reducer
