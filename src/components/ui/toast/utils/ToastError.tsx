import toast from '../toast'
import Notification from '../../Notification'

const toastError = (message: string) => {
  toast.push(
    <Notification title={'Error'} type="danger" duration={2500}>
      {message.charAt(0).toUpperCase() + message.slice(1)}
    </Notification>,
    {
      placement: 'top-center',
    }
  )
}

export default toastError
