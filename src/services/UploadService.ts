import ApiService from './ApiService'

type UploadResponse = {
  url: string
}

export async function apiUpload(formData: FormData) {
  const {
    data: { url },
  } = await ApiService.fetchData<UploadResponse>({
    url: '/public/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return url
}
