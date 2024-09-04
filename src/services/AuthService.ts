import ApiService from './ApiService'
import type {
  SignInCredential,
  SignUpCredential,
  ForgotPassword,
  ResetPassword,
  SignInResponse,
  SignUpResponse,
  GetMeResponse,
  RefreshTokenResponse,
  ChangePasswordPassword,
} from '@/@types/auth'

export async function apiSignIn(data: SignInCredential) {
  return ApiService.fetchData<SignInResponse>({
    url: '/auth/login',
    method: 'post',
    data,
  })
}

export async function apiGetMe() {
  return ApiService.fetchData<GetMeResponse>({
    url: '/auth/me',
    method: 'get',
  })
}

export async function apiSignUp(data: SignUpCredential) {
  return ApiService.fetchData<SignUpResponse>({
    url: '/sign-up',
    method: 'post',
    data,
  })
}

export async function apiForgotPassword(data: ForgotPassword) {
  return ApiService.fetchData({
    url: '/forgot-password',
    method: 'post',
    data,
  })
}

export async function apiResetPassword(data: ResetPassword) {
  return ApiService.fetchData({
    url: '/reset-password',
    method: 'post',
    data,
  })
}

export async function apiRefreshToken(payload: { reset_token: string | null }) {
  return ApiService.fetchData<RefreshTokenResponse>({
    url: '/auth/refresh-token',
    method: 'post',
    data: payload,
  })
}

export async function apiChangePassword(payload: ChangePasswordPassword) {
  return ApiService.fetchData({
    url: '/auth/change-password',
    method: 'post',
    data: payload,
  })
}
