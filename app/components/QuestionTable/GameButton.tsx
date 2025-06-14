"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Gamepad2 } from "lucide-react"

interface GameButtonProps {
  gameId: number
  onClick: () => void
}

export const GameButton: React.FC<GameButtonProps> = ({ gameId, onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="bg-[#8B5DFF] hover:bg-[#9d6fff] hover:shadow-[0_0_15px_rgba(139,93,255,0.4)] text-white transition-all duration-300"
      size="sm"
    >
      <Gamepad2 className="w-4 h-4 mr-2" />
      Play Game
    </Button>
  )
}
