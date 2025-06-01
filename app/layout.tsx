import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import Chatbot from "./components/Chatbot"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CodeWiz",
  description: "Learn coding with AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Chatbot />
        </AuthProvider>
      </body>
    </html>
  )
}
