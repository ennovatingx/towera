export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyState?: React.ReactNode;
}

export default function DataTable<T>({ columns, rows, rowKey, emptyState }: DataTableProps<T>) {
  if (rows.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-background-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-background-100 text-left">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium text-foreground-600 whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-t border-background-200 hover:bg-background-100/60 transition-colors duration-150"
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-foreground-800 ${col.className ?? ''}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
