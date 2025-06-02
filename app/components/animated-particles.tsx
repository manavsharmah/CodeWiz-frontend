"use client"

import { useEffect, useState } from "react"

export default function AnimatedParticles() {
  const [particles, setParticles] = useState<Array<{
    top: string
    left: string
    animation: string
    opacity: number
  }>>([])

  useEffect(() => {
    // Generate particles only on client side
    const newParticles = Array.from({ length: 20 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animation: `float ${5 + Math.random() * 10}s linear infinite`,
      opacity: Math.random() * 0.5 + 0.3,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/30"
          style={{
            top: particle.top,
            left: particle.left,
            animation: particle.animation,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  )
} 