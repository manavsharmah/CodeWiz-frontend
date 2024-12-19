'use client'
import { Button } from "@/components/ui/button"

interface SolveButtonProps {
  onClick: () => void;
}

export function SolveButton({ onClick }: SolveButtonProps) {
  return (
    <Button onClick={onClick} className="w-full sm:w-auto bg-[#F09319] hover:bg-[#E08309] text-white text-sm sm:text-base">
      Solve
    </Button>
  )
}
