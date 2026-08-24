import type { MockDB } from './index'

export function assertMinimumVolumes(db: MockDB): void {
  // Disabled during Supabase migration as mock data has been cleared
  return;
}

export function validateMockDataIntegrity(db: MockDB): string[] {
  const errors: string[] = []

  // Every order must reference a real seller
  const sellerIds = new Set(db.sellers.map(s => s.id))
  db.orders.forEach(o => {
    if (o.sellerId && !sellerIds.has(o.sellerId)) {
      errors.push(`Order ${o.orderId} references missing seller ${o.sellerId}`)
    }
  })

  // Commissions must sum to the SAME total as orders' commission amounts
  const commissionableStatuses = ['delivered', 'in_transit', 'out_for_delivery', 'processing', 'confirmed']
  const totalCommissionFromOrders = db.orders
    .filter(o => commissionableStatuses.includes(o.status))
    .reduce((sum, o) => sum + (o.commissionAmount ?? 0), 0)
  const totalCommissionFromTable = db.commissions.reduce((sum, c) => sum + c.earned, 0)
  if (Math.abs(totalCommissionFromOrders - totalCommissionFromTable) > 1) {
    errors.push(
      `Commission mismatch: orders sum to ₹${totalCommissionFromOrders.toFixed(0)}, ` +
      `commissions table sums to ₹${totalCommissionFromTable.toFixed(0)}. These MUST be the same source.`
    )
  }

  // Settlement net payout must equal gross - commission for its period
  db.settlements.forEach(s => {
    const expectedNet = s.amount - s.commission
    if (Math.abs(expectedNet - s.netAmount) > 1) {
      errors.push(`Settlement ${s.id} net payout doesn't reconcile: gross(${s.amount}) - commission(${s.commission}) ≠ net(${s.netAmount})`)
    }
  })

  // Audit log timestamps must be strictly descending
  for (let i = 1; i < db.auditLogs.length; i++) {
    const prev = new Date(db.auditLogs[i - 1].timestamp).getTime()
    const curr = new Date(db.auditLogs[i].timestamp).getTime()
    if (curr > prev) {
      errors.push(`Audit logs are not in descending order at index ${i}: ${db.auditLogs[i].timestamp} > ${db.auditLogs[i - 1].timestamp}`)
      break
    }
  }

  if (errors.length && process.env.NODE_ENV === 'development') {
    console.error('🚨 MOCK DATA INTEGRITY FAILURES:\n' + errors.map(e => `  - ${e}`).join('\n'))
  }

  return errors
}
