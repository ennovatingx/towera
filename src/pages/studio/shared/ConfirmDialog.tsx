interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-900/40 px-4">
      <div className="w-full max-w-sm bg-background-50 rounded-2xl shadow-xl p-6">
        <h3 className="font-heading text-lg text-foreground-900 mb-2">{title}</h3>
        {description && <p className="text-sm text-foreground-500 mb-6">{description}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-full text-sm font-medium text-foreground-600 hover:bg-background-200 transition-colors duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-full text-sm font-medium text-background-50 transition-colors duration-200 cursor-pointer ${
              danger ? 'bg-accent-500 hover:bg-accent-600' : 'bg-primary-500 hover:bg-primary-600'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
