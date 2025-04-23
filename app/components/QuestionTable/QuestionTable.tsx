"use client"
import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GameButton } from "./GameButton"
import { SolveButton } from "./SolveButton"
import { motion } from "framer-motion"

const QuestionTable: React.FC = () => {
  const [data, setData] = useState<Array<{ id: number; QId: string; questionName: string; status: string }>>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/questions/`, {
          method: "GET",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch question data")
        }

        const result: Array<{ id: number; title: string; status: string }> = await response.json()
        setData(result)
      } catch (error: any) {
        console.error("Error fetching data:", error.message)
        // For demo purposes, let's add some mock data if the API fails
        setData([
          { id: 1, title: "Two Sum", status: "solved" },
          { id: 2, title: "Valid Parentheses", status: "unsolved" },
          { id: 3, title: "Merge Two Sorted Lists", status: "solved" },
          { id: 4, title: "Best Time to Buy and Sell Stock", status: "unsolved" },
          { id: 5, title: "Maximum Subarray", status: "unsolved" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSolveClick = (id) => {
    window.location.href = `/dsa-problems/${id}` // Direct navigation to the DSAProblems page
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-lg border border-purple-900/30 rounded-xl shadow-[0_0_25px_rgba(139,93,255,0.2)]">
      <div className="overflow-x-auto">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="border-b border-purple-900/30">
              <TableHead className="py-4 text-left font-medium text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#8B5DFF] to-[#9d6fff] w-6/12">
                Questions
              </TableHead>
              <TableHead className="py-4 text-left font-medium text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#F09319] to-[#ffb766] w-2/12">
                Difficulty
              </TableHead>
              <TableHead className="py-4 text-left font-medium text-lg text-gray-300 w-4/12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-[#8B5DFF] animate-pulse"></div>
                    <div className="w-4 h-4 rounded-full bg-[#9d6fff] animate-pulse delay-75"></div>
                    <div className="w-4 h-4 rounded-full bg-[#F09319] animate-pulse delay-150"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors duration-200"
                >
                  <TableCell className="py-4 text-white font-medium">
                    <Link
                      href={`/dsa-problems/${item.id}`}
                      className="hover:text-[#8B5DFF] transition-colors duration-200"
                    >
                      {item.title}
                    </Link>
                  </TableCell>
                  <TableCell className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        index % 3 === 0
                          ? "bg-green-900/30 text-green-400 border border-green-700/30"
                          : index % 3 === 1
                            ? "bg-yellow-900/30 text-yellow-400 border border-yellow-700/30"
                            : "bg-red-900/30 text-red-400 border border-red-700/30"
                      }`}
                    >
                      {index % 3 === 0 ? "Easy" : index % 3 === 1 ? "Medium" : "Hard"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex space-x-3">
                      <GameButton gameId={item.id} />
                      <SolveButton onClick={() => handleSolveClick(item.id)} />
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default QuestionTable
