"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null)

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
    }, 300) // 300ms delay before closing
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

            <motion.div variants={itemVariants}>
              <Link
                href="/login"
                className="ml-4 px-6 py-2 bg-gradient-to-r from-[#8B5DFF] to-[#F09319] text-white rounded-full hover:shadow-[0_0_15px_rgba(139,93,255,0.5)] transition-all duration-300"
              >
                Login
              </Link>
            </motion.div>
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
              <Link
                href="/login"
                className="block mt-4 mx-3 px-4 py-2 bg-gradient-to-r from-[#8B5DFF] to-[#F09319] text-white text-center rounded-full hover:shadow-[0_0_15px_rgba(139,93,255,0.5)] transition-all duration-300"
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
