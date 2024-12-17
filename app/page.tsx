import Navbar from './components/Navbar'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, Brain, Trophy, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />  
      <main className="flex-1 flex flex-col justify-center">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-[#8B5DFF] to-[#F09319]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Level Up Your Coding Skills with CodeWiz
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Master Data Structures and Algorithms through engaging games. Start your coding adventure today!
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-white text-[#8B5DFF] hover:bg-gray-100" size="lg">
                  Start Playing
                </Button>
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-[#8B5DFF]" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-[#F09319]">Game-Changing Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center text-[#8B5DFF]">
                    <Gamepad2 className="w-6 h-6 mr-2" />
                    Interactive Gameplay
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Learn DSA concepts through fun, engaging games that make complex topics easy to understand.
                </CardContent>
              </Card>
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center text-[#8B5DFF]">
                    <Brain className="w-6 h-6 mr-2" />
                    Adaptive Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Our AI adjusts the difficulty based on your performance, ensuring you're always challenged but not overwhelmed.
                </CardContent>
              </Card>
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center text-[#8B5DFF]">
                    <Brain className="w-6 h-6 mr-2" />
                    Algorithm Visualizer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Watch algorithms come to life with our interactive visualizer. See how data structures change in real-time as you learn and apply different algorithms.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-[#F09319]">How CodeWiz Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#8B5DFF] text-white flex items-center justify-center text-xl font-bold mb-4">1</div>
                <h3 className="text-xl font-bold mb-2 text-[#F09319]">Choose Your Quest</h3>
                <p className="text-center">Select from a variety of DSA topics and difficulty levels to start your learning adventure.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#8B5DFF] text-white flex items-center justify-center text-xl font-bold mb-4">2</div>
                <h3 className="text-xl font-bold mb-2 text-[#F09319]">Play & Learn</h3>
                <p className="text-center">Engage with interactive games that teach you DSA concepts in a fun and memorable way.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#8B5DFF] text-white flex items-center justify-center text-xl font-bold mb-4">3</div>
                <h3 className="text-xl font-bold mb-2 text-[#F09319]">Level Up</h3>
                <p className="text-center">Earn experience points, unlock achievements, and watch your coding skills grow!</p>
              </div>
            </div>
          </div>
        </section>
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-[#8B5DFF]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Start Your Coding Adventure?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-200 md:text-xl">
                  Join thousands of wizards who are mastering DSA while having fun. Your journey to coding mastery begins here!
                </p>
              </div>
              <Button className="bg-[#F09319] text-white hover:bg-[#d97f0d]" size="lg">
                Create Your Wizard Account
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center sm:justify-between px-4 md:px-6 border-t border-gray-700">
        <p className="text-xs text-gray-400">© 2024 CodeWiz. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

