import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
  deleteStaking,
  getStakingList,
  toggleDeleteConfirmation,
  useAppDispatch,
  useAppSelector,
} from '../store'

const StakingDeleteConfirmation = () => {
  const dispatch = useAppDispatch()
  const dialogOpen = useAppSelector(
    (state) => state.stakingList.data.deleteConfirmation
  )
  const selectedProduct = useAppSelector(
    (state) => state.stakingList.data.selected
  )
  const tableData = useAppSelector((state) => state.stakingList.data.tableData)

  const onDialogClose = () => {
    dispatch(toggleDeleteConfirmation(false))
  }

  const onDelete = async () => {
    dispatch(toggleDeleteConfirmation(false))
    const success = await deleteStaking({ id: selectedProduct })

    if (success) {
      dispatch(getStakingList(tableData))
      toast.push(
        <Notification
          title={'Successfully Deleted'}
          type="success"
          duration={2500}
        >
          Product successfully deleted
        </Notification>,
        {
          placement: 'top-center',
        }
      )
    }
  }
  return (
    <ConfirmDialog
      isOpen={dialogOpen}
      type="danger"
      title="Delete staking"
      confirmButtonColor="red-600"
      onClose={onDialogClose}
      onRequestClose={onDialogClose}
      onCancel={onDialogClose}
      onConfirm={onDelete}
    >
      <p>
        Are you sure you want to delete this staking? All record related to this
        staking will be deleted as well. This action cannot be undone.
      </p>
    </ConfirmDialog>
  )
}

export default StakingDeleteConfirmation
