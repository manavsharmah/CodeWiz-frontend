"use client"

import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface LanguageSelectorProps {
  language: string
  setLanguage: (value: string) => void
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage }) => {
  return (
    <div className="flex items-center space-x-4">
      <Label htmlFor="language" className="text-gray-300">
        Language:
      </Label>
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger
          id="language"
          className="w-[180px] bg-gray-900 border-gray-700 text-white focus:ring-[#8B5DFF] focus:border-[#8B5DFF]"
        >
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-700 text-white">
          <SelectItem value="javascript">JavaScript</SelectItem>
          <SelectItem value="python">Python</SelectItem>
          <SelectItem value="cpp">C++</SelectItem>
          <SelectItem value="java">Java</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default LanguageSelector
