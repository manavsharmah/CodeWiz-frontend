"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface GameContainerProps {
  gameId: string
  onClose?: () => void
}

const GameContainer: React.FC<GameContainerProps> = ({ gameId, onClose }) => {
  const gamePath = `/games/${gameId}/index.html`

  return (
    <div className="relative w-full h-full">
      {onClose && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={onClose}
            variant="outline"
            size="icon"
            className="bg-black/50 border border-gray-700 hover:bg-gray-800 hover:border-gray-600 rounded-full w-10 h-10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      <iframe
        src={gamePath}
        width="100%"
        height="100%"
        style={{
          display: "block",
          border: "none",
          height: "800px",
        }}
        frameBorder="0"
        title={`Game - ${gameId}`}
        allowFullScreen
      ></iframe>
    </div>
  )
}

export default GameContainer
