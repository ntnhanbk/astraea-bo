import ApiService from './ApiService'

export async function apiGetStakingList<T, U extends Record<string, unknown>>(
  params: U
) {
  return ApiService.fetchData<T>({
    url: '/admin/staking-pool',
    method: 'get',
    params: {
      ...params,
      limit: params.size,
      searchBy: params.query,
      type: 'coin',
    },
  })
}

export async function apiCreateStaking<T, U extends Record<string, unknown>>(
  data: U
) {
  await ApiService.fetchData<T>({
    url: '/admin/staking-pool/token',
    method: 'post',
    data,
  })
  return true
}

export async function apiUpdateStaking<
  T,
  U extends Record<string, unknown>
>(data: { id: string; payload: U }) {
  await ApiService.fetchData<T>({
    url: `/admin/staking-pool/token/${data.id}`,
    method: 'patch',
    data: data.payload,
  })
  return true
}

export async function apiDeleteStaking<T, U extends Record<string, unknown>>(
  params: U
) {
  await ApiService.fetchData<T>({
    url: `/admin/staking-pool/${params.id}`,
    method: 'delete',
  })
  return true
}

export async function apiGetStakingById<T, U extends Record<string, unknown>>(
  params: U
) {
  return ApiService.fetchData<T>({
    url: `/public/staking-pool/${params.id}`,
    method: 'get',
  })
}

export async function apiUpdateFeeStaking<
  T,
  U extends Record<string, unknown>
>(data: { id: string; payload: U }) {
  await ApiService.fetchData<T>({
    url: `/admin/staking-pool/special-fees/${data.id}`,
    method: 'patch',
    data: data.payload,
  })
  return true
}
