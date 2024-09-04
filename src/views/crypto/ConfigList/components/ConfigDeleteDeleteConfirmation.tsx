import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
  deleteConfig,
  getConfigFee,
  toggleDeleteConfirmation,
  useAppDispatch,
  useAppSelector,
} from '../store'

const ConfigDeleteConfirmation = () => {
  const dispatch = useAppDispatch()
  const dialogOpen = useAppSelector(
    (state) => state.configFee.data.deleteConfirmation
  )
  const selectedProduct = useAppSelector(
    (state) => state.configFee.data.selected
  )
  const tableData = useAppSelector((state) => state.configFee.data.tableData)

  const onDialogClose = () => {
    dispatch(toggleDeleteConfirmation(false))
  }

  const onDelete = async () => {
    dispatch(toggleDeleteConfirmation(false))
    const success = await deleteConfig({ id: selectedProduct })

    if (success) {
      dispatch(getConfigFee())
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
      title="Delete config"
      confirmButtonColor="red-600"
      onClose={onDialogClose}
      onRequestClose={onDialogClose}
      onCancel={onDialogClose}
      onConfirm={onDelete}
    >
      <p>
        Are you sure you want to delete this config? All record related to this
        config will be deleted as well. This action cannot be undone.
      </p>
    </ConfirmDialog>
  )
}

export default ConfigDeleteConfirmation
