export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`
    return `₹${value.toString()}`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number, compact = false): string {
  if (compact) {
    if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`
    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toString()
  }
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercentage(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}

export function formatMetricValue(value: number, format: 'currency' | 'number' | 'percentage'): string {
  switch (format) {
    case 'currency': return formatCurrency(value)
    case 'number': return formatNumber(value)
    case 'percentage': return formatPercentage(value)
  }
}

export function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(new Date(isoString))
}
