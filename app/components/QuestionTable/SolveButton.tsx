"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Code } from "lucide-react"

interface SolveButtonProps {
  onClick: () => void
}

export const SolveButton: React.FC<SolveButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="bg-[#F09319] hover:bg-[#ffb766] hover:shadow-[0_0_15px_rgba(240,147,25,0.4)] text-white transition-all duration-300"
      size="sm"
    >
      <Code className="w-4 h-4 mr-2" />
      Solve
    </Button>
  )
}
