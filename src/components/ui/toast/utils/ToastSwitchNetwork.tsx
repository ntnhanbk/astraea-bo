import toast from '../toast'
import Notification from '../../Notification'

const toastSwitchNetwork = () => {
  toast.push(
    <Notification
      closable
      type="warning"
      className="w-fit"
      title="You connected to wrong network"
      duration={5000}
    >
      Please switch network
    </Notification>,
    {
      placement: 'top-center',
    }
  )
}

export default toastSwitchNetwork
