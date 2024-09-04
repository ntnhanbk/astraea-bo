import toast from '../toast'
import Notification from '../../Notification'

const toastSuccess = (message: string) => {
  toast.push(
    <Notification title={'Success'} type="success" duration={2500}>
      {message.charAt(0).toUpperCase() + message.slice(1)}
    </Notification>,
    {
      placement: 'top-center',
    }
  )
}

export default toastSuccess
