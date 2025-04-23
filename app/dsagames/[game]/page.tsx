"use client"
import { useParams, useRouter } from "next/navigation"
import Navbar from "../../components/Navbar"
import { Button } from "@/components/ui/button"
import { X, Home } from "lucide-react"
import { FadeIn } from "../../components/scroll-animations"

const DsaGamePage = () => {
  const { game } = useParams()
  const router = useRouter()
  const gamePath = `/games/${game}/index.html`

  const handleClose = () => {
    router.push("/dsagames")
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />

      <main className="flex-1 pt-16">
        <div className="relative min-h-screen w-full">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#8B5DFF]/10 rounded-full filter blur-[100px]"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#F09319]/10 rounded-full filter blur-[100px]"></div>
          </div>

          <FadeIn>
            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#8B5DFF] to-[#F09319]">
                  {decodeURIComponent(game as string).replace(/-/g, " ")}
                </h1>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => router.push("/dsagames")}
                    variant="outline"
                    className="bg-transparent border border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    All Games
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="bg-transparent border border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Close Game
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-lg border border-purple-900/30 rounded-xl shadow-[0_0_25px_rgba(139,93,255,0.2)] overflow-hidden">
                <iframe
                  src={gamePath}
                  width="100%"
                  height="800px"
                  style={{
                    display: "block",
                    border: "none",
                  }}
                  frameBorder="0"
                  title={`Game - ${game}`}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  )
}

export default DsaGamePage
