"use client"
import Navbar from "../components/Navbar"
import QuestionTable from "../components/QuestionTable/QuestionTable"
import { FadeIn } from "../components/scroll-animations"

const QuestionsPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />

      <main className="flex-1 pt-16">
        <div className="relative min-h-screen w-full">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#8B5DFF]/10 rounded-full filter blur-[100px]"></div>
            <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-[#F09319]/10 rounded-full filter blur-[100px]"></div>
          </div>

          <FadeIn>
            <div className="container mx-auto px-4 py-12">
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#8B5DFF] to-[#F09319]">
                  Coding Challenges
                </h1>
                <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
                  Practice your algorithmic thinking with our collection of data structure and algorithm problems
                </p>
              </div>

              <div className="flex justify-center">
                <QuestionTable />
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  )
}

export default QuestionsPage
