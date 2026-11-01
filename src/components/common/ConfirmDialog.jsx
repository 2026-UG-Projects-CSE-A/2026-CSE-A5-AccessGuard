import Modal from './Modal'

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', tone = 'primary', onConfirm, onClose }) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-3 py-2 text-sm text-white ${tone === 'danger' ? 'bg-red-700 hover:bg-red-800' : 'bg-navy-800 hover:bg-navy-900'}`}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-slate-600">{message}</p>
    </Modal>
  )
}
