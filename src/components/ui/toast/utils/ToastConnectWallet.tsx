import toast from '../toast'
import Notification from '../../Notification'

const toastConnectWallet = () => {
  toast.push(
    <Notification title={'Warning'} type="warning" duration={2500}>
      Please connect your wallet first
    </Notification>,
    {
      placement: 'top-center',
    }
  )
}

export default toastConnectWallet
