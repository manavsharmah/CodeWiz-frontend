"use client"
import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GameButton } from "./GameButton"
import { SolveButton } from "./SolveButton"
import { motion } from "framer-motion"

const QuestionTable: React.FC = () => {
  const [data, setData] = useState<Array<{ id: number; title: string; status: string }>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/questions/`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch question data")
        }

        const result = await response.json()
        setData(result)
      } catch (error: any) {
        console.error("Error fetching data:", error.message)
        setError("Failed to load questions. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSolveClick = (id: number) => {
    window.location.href = `/dsa-problems/${id}`
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Problem</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Actions</TableHead>
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
          ) : error ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-red-400">
                {error}
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-gray-400">
                No questions available
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
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "solved"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex space-x-2">
                    <SolveButton onClick={() => handleSolveClick(item.id)} />
                    <GameButton gameId={item.id} onClick={() => handleSolveClick(item.id)} />
                  </div>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default QuestionTable
