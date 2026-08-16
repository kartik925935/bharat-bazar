/**
 * exportToCSV — generates a real downloadable CSV file client-side.
 * No backend needed: uses Blob + URL.createObjectURL + temporary anchor click.
 */
export function exportToCSV<T>(
  data: T[],
  columns: { key: string; header: string; accessor: (row: T) => string | number }[],
  filename: string
): string {
  const header = columns.map((c) => `"${c.header}"`).join(',')
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = c.accessor(row)
        const str = String(val ?? '')
        // Escape quotes, wrap in quotes if contains comma/newline/quote
        const escaped = str.replace(/"/g, '""')
        return `"${escaped}"`
      })
      .join(',')
  )
  const csv = [header, ...rows].join('\n')
  return csv
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export function exportToJSON<T>(data: T[], filename: string) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename.replace('.csv', '.json')
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

/** Generate a timestamped filename: "customers_2025-01-15.csv" */
export function generateFilename(base: string, ext = 'csv'): string {
  const date = new Date().toISOString().split('T')[0]
  return `${base}_${date}.${ext}`
}
