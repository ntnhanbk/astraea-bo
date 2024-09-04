export type SignInCredential = {
  username: string
  password: string
}

export type SignInResponse = {
  refresh_token: string
  access_token: string
  role: string
}

export type RefreshTokenResponse = {
  refresh_token: string
  access_token: string
}

export type GetMeResponse = {
  _id: string
  deletedAt: any
  deletedBy: any
  isDeleted: boolean
  username: string
  role: string
  createdAt: string
  updatedAt: string
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
  userName: string
  email: string
  password: string
}

export type ForgotPassword = {
  email: string
}

export type ResetPassword = {
  password: string
}

export type ChangePasswordPassword = {
  oldPassword: string
  password: string
  confirmPassword: string
}
