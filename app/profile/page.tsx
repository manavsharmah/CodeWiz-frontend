"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Navbar from "../components/Navbar"
import { Loader2 } from "lucide-react"

interface ProgressData {
  total_questions: number;
  solved_questions: number;
  attempted_questions: number;
  success_rate: number;
  recent_submissions: {
    type: string;
    problem: string;
    date: string;
    score: number;
  }[];
  difficulty_stats: {
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
  };
}

const defaultProgress: ProgressData = {
  total_questions: 0,
  solved_questions: 0,
  attempted_questions: 0,
  success_rate: 0,
  recent_submissions: [],
  difficulty_stats: {
    easy: { solved: 0, total: 0 },
    medium: { solved: 0, total: 0 },
    hard: { solved: 0, total: 0 }
  }
};

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [progress, setProgress] = useState<ProgressData>(defaultProgress)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            // If progress endpoint is not found, use default progress
            setProgress(defaultProgress)
            setError(null)
            return
          }
          throw new Error(`Failed to fetch progress: ${response.statusText}`)
        }

        const data = await response.json()
        setProgress(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching progress:', err)
        // Use default progress on error
        setProgress(defaultProgress)
        setError(err instanceof Error ? err.message : 'Failed to fetch progress data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      </div>
    )
  }

  const progressPercentage = progress
    ? Math.round((progress.solved_questions / progress.total_questions) * 100) || 0
    : 0

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* User Info Card */}
          <Card className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-lg border border-purple-900/30 rounded-xl p-6 shadow-[0_0_25px_rgba(139,93,255,0.2)] mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F09319] to-[#ffb766]">
                Welcome, {user?.username || 'User'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg border border-purple-900/30">
                  <h3 className="text-lg font-semibold text-gray-300">Problems Solved</h3>
                  <p className="text-3xl font-bold text-[#8B5DFF]">
                    {progress.solved_questions}
                  </p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg border border-purple-900/30">
                  <h3 className="text-lg font-semibold text-gray-300">Success Rate</h3>
                  <p className="text-3xl font-bold text-[#F09319]">
                    {progressPercentage}%
                  </p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg border border-purple-900/30">
                  <h3 className="text-lg font-semibold text-gray-300">Points Earned</h3>
                  <p className="text-3xl font-bold text-green-400">
                    {progress.recent_submissions.reduce((acc, submission) => acc + (submission.type === 'solved' ? 1 : 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress and Activity Tabs */}
          <Tabs defaultValue="progress" className="space-y-4">
            <TabsList className="bg-gray-900/50 border border-purple-900/30">
              <TabsTrigger value="progress" className="data-[state=active]:bg-purple-900/30">Progress</TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-purple-900/30">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-4">
              <Card className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-lg border border-purple-900/30 rounded-xl p-6 shadow-[0_0_25px_rgba(139,93,255,0.2)]">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F09319] to-[#ffb766]">
                    Progress Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">Overall Progress</span>
                        <span className="text-sm font-medium text-gray-300">{progressPercentage}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2 bg-gray-800" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-purple-900/30">
                        <p className="text-sm text-gray-300">Total Questions</p>
                        <p className="text-2xl font-bold text-[#8B5DFF]">{progress.total_questions}</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-purple-900/30">
                        <p className="text-sm text-gray-300">Solved Questions</p>
                        <p className="text-2xl font-bold text-[#F09319]">{progress.solved_questions}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-lg border border-purple-900/30 rounded-xl p-6 shadow-[0_0_25px_rgba(139,93,255,0.2)]">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F09319] to-[#ffb766]">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {progress.recent_submissions.length > 0 ? (
                        progress.recent_submissions.map((submission, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-purple-900/30">
                            <div>
                              <p className="font-medium text-gray-200">{submission.problem}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(submission.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={submission.type === 'solved' ? 'success' : 'secondary'}>
                              {submission.type}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-400 py-8">
                          No recent activity
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
