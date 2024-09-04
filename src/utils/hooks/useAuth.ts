import type { SignInCredential, SignUpCredential } from '@/@types/auth'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { apiGetMe, apiSignIn } from '@/services/AuthService'
import {
  setUser,
  signInSuccess,
  signOutSuccess,
  useAppDispatch,
  useAppSelector,
} from '@/store'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'

type Status = 'success' | 'failed'

function useAuth() {
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const query = useQuery()

  const { access_token, refresh_token, signedIn } = useAppSelector(
    (state) => state.auth.session
  )

  const signIn = async (
    values: SignInCredential
  ): Promise<
    | {
        status: Status
        message: string
      }
    | undefined
  > => {
    try {
      const { data } = await apiSignIn(values)
      if (data) {
        dispatch(signInSuccess(data))
        if (data) {
          const { data } = await apiGetMe()
          dispatch(
            setUser({
              avatar: '',
              username: data.username,
              authority: [data.role],
              id: data._id,
            })
          )
        }
        const redirectUrl = query.get(REDIRECT_URL_KEY)
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
        return {
          status: 'success',
          message: '',
        }
      }
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (errors: any) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      }
    }
  }

  const signUp = async (values: SignUpCredential) => {
    try {
      alert('Signup Clicked')
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (errors: any) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      }
    }
  }

  const handleSignOut = () => {
    dispatch(signOutSuccess())
    dispatch(
      setUser({
        avatar: '',
        username: '',
        authority: [],
      })
    )
    navigate(appConfig.unAuthenticatedEntryPath)
  }

  const signOut = async () => {
    handleSignOut()
  }

  return {
    authenticated: access_token && signedIn,
    signIn,
    signUp,
    signOut,
  }
}

export default useAuth
