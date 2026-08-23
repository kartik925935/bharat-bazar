export async function simulateLatency(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
