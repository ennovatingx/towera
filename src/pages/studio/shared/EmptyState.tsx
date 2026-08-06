interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon = 'ri-inbox-line', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-full bg-background-100 flex items-center justify-center mb-4">
        <i className={`${icon} text-2xl text-foreground-400`} />
      </div>
      <h3 className="font-heading text-lg text-foreground-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-foreground-500 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
