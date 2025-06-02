"use client"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, Brain, Trophy, Users, Code, ArrowRight, Sparkles, Zap } from "lucide-react"
import Navbar from "./components/Navbar"
import Hero3D from "./components/3d-hero"
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "./components/scroll-animations"
import Link from "next/link"
import AnimatedParticles from "./components/animated-particles"

export default function Home() {
  // Initialize smooth scroll behavior
  useEffect(() => {
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e: Event) => {
        e.preventDefault()
        const href = (anchor as HTMLAnchorElement).getAttribute("href")
        if (!href) return

        document.querySelector(href)?.scrollIntoView({
          behavior: "smooth",
        })
      })
    })
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center pt-8">
        {/* Hero Section with 3D Background */}
        <section className="relative w-full min-h-screen flex items-center justify-center py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
          {/* 3D Background */}
          <Hero3D />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black pointer-events-none"></div>

          {/* Content */}
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <FadeIn>
                <div className="inline-block mb-4">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#8B5DFF]/20 to-[#F09319]/20 border border-[#8B5DFF]/30 text-sm font-medium text-white backdrop-blur-sm">
                    The Future of Coding Education
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none max-w-3xl">
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#b28fff] via-[#8B5DFF] to-[#7a4dff] drop-shadow-[0_0_10px_rgba(139,93,255,0.5)]">
                    Level Up Your Coding Skills
                  </span>
                  <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-[#F09319] to-[#ffb766] drop-shadow-[0_0_10px_rgba(240,147,25,0.5)]">
                    with CodeWiz
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Master Data Structures and Algorithms through engaging games and interactive visualizations. Start
                  your coding adventure today!
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button
                    className="bg-gradient-to-r from-[#8B5DFF] to-[#F09319] hover:shadow-[0_0_20px_rgba(139,93,255,0.5)] transition-all duration-300 text-white border-0"
                    size="lg"
                  >
                    Start Playing
                    <Zap className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent border border-[#8B5DFF]/50 text-white hover:bg-[#8B5DFF]/10 hover:border-[#8B5DFF] transition-all duration-300"
                    size="lg"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="flex items-center space-x-4 mt-8 text-sm text-gray-400">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B5DFF] to-[#F09319] p-0.5">
                        <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-xs font-bold text-white">
                          {String.fromCharCode(65 + i)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <span>Join 1+ developers mastering DSA</span>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#8B5DFF]/20 rounded-full filter blur-[100px]"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#F09319]/20 rounded-full filter blur-[100px]"></div>
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <FadeIn>
              <div className="flex flex-col items-center text-center mb-16">
                <div className="inline-block mb-4">
                  <div className="px-3 py-1 rounded-full bg-[#8B5DFF]/20 border border-[#8B5DFF]/30 text-sm font-medium text-white backdrop-blur-sm">
                    Game-Changing Features
                  </div>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-[#F09319] to-[#ffb766] mb-4">
                  Learn DSA Like Never Before
                </h2>
                <p className="max-w-[700px] text-gray-400">
                  Our platform combines gamification with powerful visualization tools to make learning data structures
                  and algorithms engaging and effective.
                </p>
              </div>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Cards */}
              <StaggerItem>
                <Card className="bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-900/20 hover:border-[#8B5DFF]/30 transition-all duration-300 group overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8B5DFF] to-[#9d6fff] flex items-center justify-center mb-2 shadow-lg shadow-[#8B5DFF]/20 group-hover:shadow-[#8B5DFF]/40 transition-all duration-300">
                      <Gamepad2 className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white group-hover:text-[#8B5DFF] transition-colors duration-300">
                      Interactive Gameplay
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">
                      Learn DSA concepts through fun, engaging games that make complex topics easy to understand and
                      remember.
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-900/20 hover:border-[#8B5DFF]/30 transition-all duration-300 group overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#F09319] to-[#ffb766] flex items-center justify-center mb-2 shadow-lg shadow-[#F09319]/20 group-hover:shadow-[#F09319]/40 transition-all duration-300">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white group-hover:text-[#F09319] transition-colors duration-300">
                      Adaptive Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">
                      Our AI adjusts the difficulty based on your performance, ensuring you're always challenged but not
                      overwhelmed.
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-900/20 hover:border-[#8B5DFF]/30 transition-all duration-300 group overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8B5DFF] to-[#F09319] flex items-center justify-center mb-2 shadow-lg shadow-[#8B5DFF]/20 group-hover:shadow-[#8B5DFF]/40 transition-all duration-300">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white group-hover:text-gradient-purple-orange transition-colors duration-300">
                      Algorithm Visualizer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">
                      Watch algorithms come to life with our interactive visualizer. See how data structures change in
                      real-time.
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-900/20 hover:border-[#8B5DFF]/30 transition-all duration-300 group overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8B5DFF] to-[#9d6fff] flex items-center justify-center mb-2 shadow-lg shadow-[#8B5DFF]/20 group-hover:shadow-[#8B5DFF]/40 transition-all duration-300">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white group-hover:text-[#8B5DFF] transition-colors duration-300">
                      Code Playground
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">
                      Test your solutions in our integrated code editor with syntax highlighting and real-time feedback.
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-900/20 hover:border-[#8B5DFF]/30 transition-all duration-300 group overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#F09319] to-[#ffb766] flex items-center justify-center mb-2 shadow-lg shadow-[#F09319]/20 group-hover:shadow-[#F09319]/40 transition-all duration-300">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white group-hover:text-[#F09319] transition-colors duration-300">
                      Community Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">
                      Compete with other learners in weekly challenges and climb the leaderboard as you improve your
                      skills.
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-900/20 hover:border-[#8B5DFF]/30 transition-all duration-300 group overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8B5DFF] to-[#F09319] flex items-center justify-center mb-2 shadow-lg shadow-[#8B5DFF]/20 group-hover:shadow-[#8B5DFF]/40 transition-all duration-300">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white group-hover:text-gradient-purple-orange transition-colors duration-300">
                      Progress Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">
                      Monitor your learning journey with detailed analytics and personalized recommendations for
                      improvement.
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-20 md:py-32 bg-gray-950 relative">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-[#8B5DFF]/10 rounded-full filter blur-[100px]"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#F09319]/10 rounded-full filter blur-[100px]"></div>
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <FadeIn>
              <div className="flex flex-col items-center text-center mb-16">
                <div className="inline-block mb-4">
                  <div className="px-3 py-1 rounded-full bg-[#F09319]/20 border border-[#F09319]/30 text-sm font-medium text-white backdrop-blur-sm">
                    Simple Process
                  </div>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-[#8B5DFF] to-[#9d6fff] mb-4">
                  How CodeWiz Works
                </h2>
                <p className="max-w-[700px] text-gray-400">
                  Our platform makes learning data structures and algorithms intuitive and enjoyable through a simple
                  three-step process.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Steps */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5DFF] to-[#9d6fff] flex items-center justify-center mb-6 shadow-lg shadow-[#8B5DFF]/20 relative z-10 transform transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(139,93,255,0.4)]">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>

                {/* Connecting line */}
                <div className="hidden md:block absolute top-[13.5rem] left-1/2 w-[calc(100%-200px)] h-0.5 bg-gradient-to-r from-[#8B5DFF]/50 via-[#F09319]/50 to-[#8B5DFF]/50 transform -translate-x-1/2"></div>

                <h3 className="text-xl font-bold mb-3 text-white">Choose Your Quest</h3>
                <p className="text-gray-400">
                  Select from a variety of DSA topics and difficulty levels to start your learning adventure.
                </p>

                <div className="mt-6 p-4 bg-gray-900/50 border border-purple-900/20 rounded-xl w-full transform transition-transform duration-300 hover:scale-105 hover:border-[#8B5DFF]/50 hover:shadow-[0_0_15px_rgba(139,93,255,0.2)]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-[#8B5DFF]/20 flex items-center justify-center">
                      <Code className="w-5 h-5 text-[#8B5DFF]" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">Arrays & Strings</div>
                      <div className="text-xs text-gray-400">Beginner Friendly</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F09319] to-[#ffb766] flex items-center justify-center mb-6 shadow-lg shadow-[#F09319]/20 relative z-10 transform transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(240,147,25,0.4)]">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>

                <h3 className="text-xl font-bold mb-3 text-white">Play & Learn</h3>
                <p className="text-gray-400">
                  Engage with interactive games that teach you DSA concepts in a fun and memorable way.
                </p>

                <div className="mt-6 p-4 bg-gray-900/50 border border-purple-900/20 rounded-xl w-full transform transition-transform duration-300 hover:scale-105 hover:border-[#F09319]/50 hover:shadow-[0_0_15px_rgba(240,147,25,0.2)]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F09319]/20 flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5 text-[#F09319]" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">Interactive Challenges</div>
                      <div className="text-xs text-gray-400">Learn by doing</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5DFF] to-[#F09319] flex items-center justify-center mb-6 shadow-lg shadow-[#8B5DFF]/20 relative z-10 transform transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(139,93,255,0.4)]">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>

                <h3 className="text-xl font-bold mb-3 text-white">Level Up</h3>
                <p className="text-gray-400">
                  Earn experience points, unlock achievements, and watch your coding skills grow!
                </p>

                <div className="mt-6 p-4 bg-gray-900/50 border border-purple-900/20 rounded-xl w-full transform transition-transform duration-300 hover:scale-105 hover:border-gradient-purple-orange hover:shadow-[0_0_15px_rgba(139,93,255,0.2)]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5DFF]/20 to-[#F09319]/20 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">Track Progress</div>
                      <div className="text-xs text-gray-400">Earn badges & rewards</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="w-full py-20 md:py-32 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B5DFF]/20 to-[#F09319]/20"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#8B5DFF]/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-[#F09319]/10 to-transparent"></div>

          {/* Animated particles */}
          <AnimatedParticles />

          <div className="container px-4 md:px-6 relative z-10">
            <ScaleIn>
              <div className="max-w-3xl mx-auto bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-lg border border-purple-900/30 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(139,93,255,0.3)]">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#8B5DFF] to-[#F09319] p-0.5">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white via-[#8B5DFF] to-[#F09319]">
                    Ready to Start Your Coding Adventure?
                  </h2>

                  <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl">
                    Join thousands of wizards who are mastering DSA while having fun. Your journey to coding mastery
                    begins here!
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Button
                      className="bg-gradient-to-r from-[#8B5DFF] to-[#F09319] hover:shadow-[0_0_20px_rgba(139,93,255,0.5)] transition-all duration-300 text-white border-0"
                      size="lg"
                    >
                      Create Your Wizard Account
                      <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-transparent border border-[#8B5DFF]/50 text-white hover:bg-[#8B5DFF]/10 hover:border-[#8B5DFF] transition-all duration-300"
                      size="lg"
                    >
                      Explore Features
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="pt-6 w-full border-t border-gray-800 mt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center">
                        <div className="flex -space-x-2 mr-3">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B5DFF] to-[#F09319] p-0.5"
                            >
                              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-xs font-bold text-white">
                                {String.fromCharCode(65 + i)}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-sm text-gray-400">
                          <span className="text-white font-medium">4</span> challenges available
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 flex items-center">
                        <span className="text-white font-medium">24/7</span> support available
                        <div className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScaleIn>
          </div>
        </section>
      </main>

      <footer className="w-full py-8 bg-gray-950 border-t border-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center sm:justify-between">
            <p className="text-xs text-gray-400">© 2024 CodeWiz. All rights reserved.</p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <Link className="text-xs hover:underline underline-offset-4 text-gray-400" href="#">
                Terms of Service
              </Link>
              <Link className="text-xs hover:underline underline-offset-4 text-gray-400" href="#">
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
