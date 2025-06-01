"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, User, Settings, Trophy, LogOut, Crown } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null)
  const userDropdownTimeout = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle mouse enter/leave for dropdown
  const handleMouseEnter = () => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current)
    }
    setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setDropdownOpen(false)
    }, 300)
  }

  // Handle mouse enter/leave for user dropdown
  const handleUserMouseEnter = () => {
    if (userDropdownTimeout.current) {
      clearTimeout(userDropdownTimeout.current)
    }
    setUserDropdownOpen(true)
  }

  const handleUserMouseLeave = () => {
    userDropdownTimeout.current = setTimeout(() => {
      setUserDropdownOpen(false)
    }, 300)
  }

  const handleLogout = () => {
    logout()
    setUserDropdownOpen(false)
    router.push("/")
  }

  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  }

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -5,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  }

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-purple-900/30" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <motion.div variants={itemVariants} className="flex-shrink-0 flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 relative overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#9d6fff] to-[#8B5DFF] rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"></div>
                <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">CW</div>
              </div>
              <div className="flex flex-col">
                <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#b28fff] via-[#8B5DFF] to-[#7a4dff] drop-shadow-[0_0_5px_rgba(139,93,255,0.5)]">
                  CodeWiz
                </p>
                <div className="h-0.5 w-full bg-gradient-to-r from-[#8B5DFF] to-[#F09319] rounded-full"></div>
              </div>
            </Link>
          </motion.div>

          {/* Menu Links */}
          <div className="hidden md:flex space-x-1 items-center">
            {["Home", "Questions", "Sorting Visualizer"].map((item, index) => (
              <motion.div key={item} variants={itemVariants}>
                <Link
                  href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                  className="relative px-4 py-2 group"
                >
                  <span className="relative z-10 text-white group-hover:text-[#F09319] transition-colors duration-300">
                    {item}
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#8B5DFF] to-[#F09319] group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            ))}

            {/* Data Structure Visualizer Dropdown */}
            <motion.div
              variants={itemVariants}
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1 px-4 py-2 text-white hover:text-[#F09319] transition-colors duration-300 focus:outline-none"
              >
                <span>Data Structure Visualizer</span>
                <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={16} />
                </motion.div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    className="absolute left-0 mt-1 w-56 origin-top-left rounded-md overflow-hidden"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="bg-gradient-to-b from-gray-900 to-black border border-purple-900/30 backdrop-blur-lg rounded-md shadow-[0_0_15px_rgba(139,93,255,0.3)] p-1">
                      {["Array", "Linked List", "Hash Table", "Binary Search Tree", "Binary Heap"].map((item) => (
                        <Link
                          key={item}
                          href={`/data-structure-visualizer/${item.toLowerCase().replace(" ", "-")}`}
                          className="block px-4 py-2 text-white hover:bg-[#8B5DFF]/20 hover:text-[#F09319] rounded-md transition-all duration-200"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* User Profile or Login */}
            {isAuthenticated && user ? (
              <motion.div
                variants={itemVariants}
                className="relative ml-4"
                ref={userDropdownRef}
                onMouseEnter={handleUserMouseEnter}
                onMouseLeave={handleUserMouseLeave}
              >
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gradient-to-r from-[#8B5DFF]/20 to-[#F09319]/20 border border-[#8B5DFF]/30 hover:border-[#8B5DFF]/50 transition-all duration-300"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                    <AvatarFallback className="bg-gradient-to-r from-[#8B5DFF] to-[#F09319] text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white font-medium">{user.username}</span>
                  <motion.div animate={{ rotate: userDropdownOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown size={16} className="text-white" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      className="absolute right-0 mt-1 w-64 origin-top-right rounded-md overflow-hidden"
                      onMouseEnter={handleUserMouseEnter}
                      onMouseLeave={handleUserMouseLeave}
                    >
                      <div className="bg-gradient-to-b from-gray-900 to-black border border-purple-900/30 backdrop-blur-lg rounded-md shadow-[0_0_15px_rgba(139,93,255,0.3)] p-1">
                        <div className="px-4 py-3 border-b border-gray-800">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                              <AvatarFallback className="bg-gradient-to-r from-[#8B5DFF] to-[#F09319] text-white">
                                {user.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-white font-medium">{user.username}</div>
                              <div className="text-gray-400 text-sm">{user.email}</div>
                              <div className="flex items-center text-xs text-[#F09319]">
                                <Crown className="h-3 w-3 mr-1" />
                                {user.rank}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-white hover:bg-[#8B5DFF]/20 hover:text-[#F09319] rounded-md transition-all duration-200"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                        <Link
                          href="/profile/settings"
                          className="flex items-center px-4 py-2 text-white hover:bg-[#8B5DFF]/20 hover:text-[#F09319] rounded-md transition-all duration-200"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Link>
                        <Link
                          href="/profile/achievements"
                          className="flex items-center px-4 py-2 text-white hover:bg-[#8B5DFF]/20 hover:text-[#F09319] rounded-md transition-all duration-200"
                        >
                          <Trophy className="h-4 w-4 mr-2" />
                          Achievements
                        </Link>
                        <div className="border-t border-gray-800 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-md transition-all duration-200"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div variants={itemVariants}>
                <Link
                  href="/login"
                  className="ml-4 px-6 py-2 bg-gradient-to-r from-[#8B5DFF] to-[#F09319] text-white rounded-full hover:shadow-[0_0_15px_rgba(139,93,255,0.5)] transition-all duration-300"
                >
                  Login
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.div variants={itemVariants} className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-[#F09319] focus:outline-none"
            >
              <div className="relative w-6 h-6">
                <motion.span
                  animate={{
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 8 : 0,
                  }}
                  className="absolute top-0 left-0 w-6 h-0.5 bg-current transform transition-transform duration-300"
                ></motion.span>
                <motion.span
                  animate={{
                    opacity: isOpen ? 0 : 1,
                  }}
                  className="absolute top-2.5 left-0 w-6 h-0.5 bg-current transition-opacity duration-300"
                ></motion.span>
                <motion.span
                  animate={{
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? -8 : 0,
                  }}
                  className="absolute top-5 left-0 w-6 h-0.5 bg-current transform transition-transform duration-300"
                ></motion.span>
              </div>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/90 backdrop-blur-md border-b border-purple-900/30"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="block text-white hover:text-[#F09319] hover:bg-[#8B5DFF]/20 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/questions"
                className="block text-white hover:text-[#F09319] hover:bg-[#8B5DFF]/20 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Questions
              </Link>
              <Link
                href="/sorting-visualizer"
                className="block text-white hover:text-[#F09319] hover:bg-[#8B5DFF]/20 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Sorting Visualizer
              </Link>

              {/* Mobile Data Structure Visualizer Dropdown */}
              <div>
                <button
                  onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                  className="w-full flex justify-between items-center text-white hover:text-[#F09319] hover:bg-[#8B5DFF]/20 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  <span>Data Structure Visualizer</span>
                  <motion.div animate={{ rotate: mobileDropdownOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown size={16} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {mobileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 space-y-1 overflow-hidden"
                    >
                      {["Array", "Linked List", "Hash Table", "Binary Search Tree", "Binary Heap"].map((item) => (
                        <Link
                          key={item}
                          href={`/data-structure-visualizer/${item.toLowerCase().replace(" ", "-")}`}
                          className="block text-white hover:text-[#F09319] hover:bg-[#8B5DFF]/20 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          {item}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile User Menu */}
              {isAuthenticated && user ? (
                <div className="border-t border-gray-800 pt-4 mt-4">
                  <div className="flex items-center px-3 py-2">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                      <AvatarFallback className="bg-gradient-to-r from-[#8B5DFF] to-[#F09319] text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-white font-medium">{user.username}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="block text-white hover:text-[#F09319] hover:bg-[#8B5DFF]/20 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/profile/settings"
                    className="block text-white hover:text-[#F09319] hover:bg-[#8B5DFF]/20 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block mt-4 mx-3 px-4 py-2 bg-gradient-to-r from-[#8B5DFF] to-[#F09319] text-white text-center rounded-full hover:shadow-[0_0_15px_rgba(139,93,255,0.5)] transition-all duration-300"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
