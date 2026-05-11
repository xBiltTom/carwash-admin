import { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  title: string;
  description?: string;
  rows: T[];
  columns: Column<T>[];
  emptyMessage: string;
}

export function DataTable<T>({
  title,
  description,
  rows,
  columns,
  emptyMessage,
}: DataTableProps<T>) {
  return (
    <section className="card-surface overflow-hidden rounded-[1.8rem]">
      <div className="border-b border-white/8 px-5 py-5 sm:px-6">
        <p className="eyebrow">Listado</p>
        <h3 className="section-title mt-2 text-3xl text-stone-50">{title}</h3>
        {description ? <p className="mt-2 text-sm text-stone-300/75">{description}</p> : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-stone-200">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.22em] text-stone-400">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`px-5 py-4 font-medium ${column.className ?? ""}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-stone-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index} className="border-t border-white/6 align-top hover:bg-white/[0.025]">
                  {columns.map((column) => (
                    <td key={column.key} className={`px-5 py-4 ${column.className ?? ""}`}>
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
