import "@/app/globals.css"
import { Inter } from "next/font/google"
import Navbar from "../components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Data Structure Visualizer",
  description: "Interactive visualizations for common data structures",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>

          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
      </body>
    </html>
  )
}

