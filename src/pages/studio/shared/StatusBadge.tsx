import type { TranslationStatus } from '@/types/studio';

const STYLES: Record<TranslationStatus, string> = {
  approved: 'bg-primary-100 text-primary-800',
  rejected: 'bg-accent-100 text-accent-800',
  pending: 'bg-background-200 text-foreground-600',
};

const LABELS: Record<TranslationStatus, string> = {
  approved: 'Approved',
  rejected: 'Rejected',
  pending: 'Pending',
};

export default function StatusBadge({ status }: { status: TranslationStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
