"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Navbar from "../../components/Navbar"
import CodeEditorContainer from "@/app/components/CodeEditor/CodeEditorContainer"
import QuestionHolder from "@/app/components/QuestionHolder/QuestionHolder"
import { FadeIn } from "../../components/scroll-animations"
import { Loader2 } from "lucide-react"

const DSAProblemsPage = () => {
  const { id } = useParams()
  const [questionData, setQuestionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchQuestionData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/questions/${id}/`)
        if (!response.ok) {
          throw new Error("Failed to fetch question data")
        }
        const data = await response.json()
        setQuestionData(data)
      } catch (error) {
        console.error("Error fetching question data:", error)
        // For demo purposes, create mock data if API fails
        setQuestionData({
          title: "Two Sum",
          description:
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
          examples: [
            {
              input: "nums = [2,7,11,15], target = 9",
              output: "[0,1]",
              explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
            },
            {
              input: "nums = [3,2,4], target = 6",
              output: "[1,2]",
              explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
            },
          ],
          constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists.",
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionData()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 text-[#8B5DFF] animate-spin" />
            <p className="text-gray-400">Loading problem...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      <FadeIn>
        <div className="flex flex-col lg:flex-row pt-16 h-[calc(100vh-64px)]">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#8B5DFF]/10 rounded-full filter blur-[100px]"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#F09319]/10 rounded-full filter blur-[100px]"></div>
          </div>

          <div className="w-full lg:w-1/2 p-4 lg:p-6 overflow-auto">
            <QuestionHolder
              title={questionData.title}
              description={questionData.description}
              examples={questionData.examples}
              constraints={questionData.constraints}
            />
          </div>
          <div className="w-full lg:w-1/2 p-4 lg:p-6 overflow-auto border-t lg:border-t-0 lg:border-l border-gray-800">
            <CodeEditorContainer />
          </div>
        </div>
      </FadeIn>
    </div>
  )
}

export default DSAProblemsPage
