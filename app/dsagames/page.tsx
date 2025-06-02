"use client"
import { useState } from "react"
import Navbar from "../components/Navbar"
import { FadeIn, ScaleIn } from "../components/scroll-animations"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Gamepad2, Play } from "lucide-react"
import { motion } from "framer-motion"

const DsaGamesPage = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  const games = [
    { id: "1", name: "Two Sum Adventure", description: "Find pairs of numbers that add up to the target value" },
    { id: "2", name: "2D Matrix Explorer", description: "Navigate through a matrix to find the target" },
    { id: "3", name: "Peak Element Finder", description: "Find peak elements in a mountain array" },
    { id: "4", name: "Remove Duplicates", description: "Clean up arrays by removing duplicate elements" },
    { id: "15", name: "Reverse Linked List", description: "Master the art of reversing linked lists" },
    { id: "16", name: "Kth Largest Element", description: "Find the kth largest element in an array" },
    { id: "17", name: "Next Greater Element", description: "Find the next greater element for each element in an array" }
  ]

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId)
  }

  const handleCloseGame = () => {
    setSelectedGame(null)
  }

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

          <div className="container mx-auto px-4 py-8">
            <FadeIn>
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#8B5DFF] to-[#F09319]">
                  DSA Games
                </h1>
                <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
                  Learn data structures and algorithms through interactive games. Select a game below to start playing.
                </p>
              </div>
            </FadeIn>

            {selectedGame ? (
              <ScaleIn>
                <div className="relative bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-lg border border-purple-900/30 rounded-xl shadow-[0_0_25px_rgba(139,93,255,0.2)] overflow-hidden">
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      onClick={handleCloseGame}
                      variant="outline"
                      size="icon"
                      className="bg-black/50 border border-gray-700 hover:bg-gray-800 hover:border-gray-600 rounded-full w-10 h-10"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <iframe
                    src={`/games/${selectedGame}/index.html`}
                    width="100%"
                    height="800px"
                    style={{
                      display: "block",
                      border: "none",
                    }}
                    frameBorder="0"
                    title={`Game - ${selectedGame}`}
                    allowFullScreen
                  ></iframe>
                </div>
              </ScaleIn>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {games.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-900/20 hover:border-[#8B5DFF]/30 transition-all duration-300 group overflow-hidden h-full">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8B5DFF] to-[#F09319] flex items-center justify-center mb-4 shadow-lg shadow-[#8B5DFF]/20 group-hover:shadow-[#8B5DFF]/40 transition-all duration-300">
                          <Gamepad2 className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-[#8B5DFF] transition-colors duration-300 mb-2">
                          {game.name}
                        </h3>
                        <p className="text-gray-400 mb-4 flex-grow">{game.description}</p>
                        <Button
                          onClick={() => handleGameSelect(game.id)}
                          className="bg-gradient-to-r from-[#8B5DFF] to-[#F09319] hover:shadow-[0_0_15px_rgba(139,93,255,0.5)] transition-all duration-300 text-white border-0 w-full"
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Play Game
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default DsaGamesPage
