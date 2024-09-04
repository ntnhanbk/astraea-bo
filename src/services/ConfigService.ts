import ApiService from './ApiService'

export async function apiGetConfigList<T, U extends Record<string, unknown>>(
  params: U
) {
  return ApiService.fetchData<T>({
    url: '/public/sys-config',
    method: 'get',
    params: { ...params, limit: params.size },
  })
}

export async function apiCreateConfig<T, U extends Record<string, unknown>>(
  data: U
) {
  await ApiService.fetchData<T>({
    url: '/admin/sys-config',
    method: 'post',
    data,
  })
  return true
}

export async function apiUpdateConfig<
  T,
  U extends Record<string, unknown>
>(data: { id: string; payload: U }) {
  await ApiService.fetchData<T>({
    url: `/admin/sys-config/${data.id}`,
    method: 'patch',
    data: data.payload,
  })
  return true
}

export async function apiDeleteConfig<T>(params: { id: string }) {
  await ApiService.fetchData<T>({
    url: `/admin/sys-config/${params.id}`,
    method: 'delete',
  })
  return true
}

export async function apiGetConfigById<T, U extends Record<string, unknown>>(
  params: U
) {
  return ApiService.fetchData<T>({
    url: `/admin/sys-config/${params.id}`,
    method: 'get',
  })
}

export async function apiGetConfigByKey<T>(params: { keys: string }) {
  return ApiService.fetchData<T>({
    url: `/public/sys-config/keys`,
    method: 'get',
    params,
  })
}
