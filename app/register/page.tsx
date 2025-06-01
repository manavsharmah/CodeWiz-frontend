"use client"
import { useState } from "react"
import type React from "react"
import { useAuth } from "../../../contexts/AuthContext"

import Link from "next/link"
import { ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import { FadeIn } from "../components/scroll-animations"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await register(formData.username, formData.email, formData.password)
      window.location.href = "/login"
    } catch (err) {
      alert((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 pt-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Decorative elements */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#8B5DFF]/20 rounded-full filter blur-[120px]"></div>
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-[#F09319]/20 rounded-full filter blur-[120px]"></div>

          {/* Animated particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.1, 0.5, 0.1],
                scale: [0.1, 1, 0.1],
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 10 + Math.random() * 20,
                ease: "linear",
              }}
              className="absolute w-1 h-1 rounded-full bg-[#F09319]"
            ></motion.div>
          ))}
        </div>

        <FadeIn>
          <Card className="w-full max-w-md border border-purple-900/30 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-lg shadow-[0_0_25px_rgba(139,93,255,0.3)]">
            <CardHeader className="space-y-1 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#8B5DFF] to-[#F09319] p-0.5">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F09319] to-[#ffb766]">
                  Begin Your Coding Journey
                </span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Create your CodeWiz account and start mastering DSA today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-gray-300">
                    Username
                  </label>
                  <div className="relative">
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="codewizard"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#8B5DFF] focus:ring-[#8B5DFF]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="wizard@codewiz.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#8B5DFF] focus:ring-[#8B5DFF]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#8B5DFF] focus:ring-[#8B5DFF] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox
                    id="terms"
                    className="border-gray-600 data-[state=checked]:bg-[#8B5DFF] data-[state=checked]:border-[#8B5DFF]"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#8B5DFF] hover:text-[#9d6fff] transition-colors duration-200">
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-[#8B5DFF] hover:text-[#9d6fff] transition-colors duration-200"
                    >
                      privacy policy
                    </Link>
                  </label>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#8B5DFF] to-[#F09319] hover:shadow-[0_0_15px_rgba(139,93,255,0.5)] transition-all duration-300 text-white border-0"
                >
                  {isLoading ? "Creating account..." : "Create account"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative px-3 bg-black text-sm text-gray-400">Or register with</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                onClick={() => (window.location.href = "http://localhost:8000/accounts/google/login/")}
                  variant="outline"
                  className="bg-transparent border border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="#EA4335"
                      d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                    />
                    <path
                      fill="#34A853"
                      d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                onClick={() => (window.location.href = "http://localhost:8000/accounts/github/login/")}
                  variant="outline"
                  className="bg-transparent border border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z" />
                  </svg>
                  GitHub
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#8B5DFF] hover:text-[#9d6fff] font-medium transition-colors duration-200"
                >
                  Login
                </Link>
              </div>
            </CardFooter>
          </Card>
        </FadeIn>
      </main>
    </div>
  )
}
