import { useState, useEffect } from 'react'

function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4)
}

export function useCountUp(targetValue: number, duration = 1000) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrameId: number

    const startValue = 0

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      if (progress < duration) {
        const easing = easeOutQuart(progress / duration)
        const current = startValue + (targetValue - startValue) * easing
        setValue(current)
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setValue(targetValue)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [targetValue, duration])

  return value
}
