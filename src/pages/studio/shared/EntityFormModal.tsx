import { useEffect, useState } from 'react';

export interface EntityFormField {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

interface EntityFormModalProps {
  open: boolean;
  title: string;
  fields: EntityFormField[];
  initialValues?: Record<string, string>;
  submitLabel?: string;
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
  onClose: () => void;
}

const fieldClasses =
  'w-full px-3 py-2 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-900 outline-none focus:border-primary-400 transition-colors duration-200';

export default function EntityFormModal({
  open,
  title,
  fields,
  initialValues,
  submitLabel = 'Save',
  onSubmit,
  onClose,
}: EntityFormModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValues(initialValues ?? {});
      setError(null);
    }
  }, [open, initialValues]);

  if (!open) return null;

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-900/40 px-4">
      <div className="w-full max-w-md bg-background-50 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg text-foreground-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background-200 transition-colors duration-200 cursor-pointer"
            aria-label="Close"
          >
            <i className="ri-close-line text-foreground-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-medium text-foreground-600 mb-1">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  value={values[field.name] ?? ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={3}
                  className={fieldClasses}
                />
              ) : field.type === 'select' ? (
                <select
                  value={values[field.name] ?? ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                  className={fieldClasses}
                >
                  <option value="" disabled>
                    Select...
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={values[field.name] ?? ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  className={fieldClasses}
                />
              )}
            </div>
          ))}
          {error && <p className="text-sm text-accent-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-sm font-medium text-foreground-600 hover:bg-background-200 transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-full text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors duration-200 cursor-pointer disabled:opacity-60"
            >
              {submitting ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
