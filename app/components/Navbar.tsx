'use client'
import React, { useState } from 'react'

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black shadow-md fixed top-0 left-0">
      <div className="w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <img
                src="/logo.svg"  // Replace with your logo image path
                alt="Logo"
                className="h-8 w-auto sm:h-10"
              />
              <p className="text-2xl font-bold text-purple-700">CodeWiz</p>
            </a>
          </div>
          {/* Menu Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="/" className="text-purple-600 hover:text-orange-500">Home</a>
            <a href="/questions" className="text-purple-600 hover:text-orange-500">Questions</a>
            <a href="/sorting-visualizer" className="text-purple-600 hover:text-orange-500">Sorting Visualizer</a>
            <a href="/dsagames" className="text-purple-600 hover:text-orange-500">Games</a>
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-purple-600 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="block text-purple-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Home</a>
            <a href="/questions" className="block text-purple-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Questions</a>
            <a href="/sorting-visualizer" className="block text-purple-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Sorting Visualizer</a>
            <a href="/dsagames" className="block text-purple-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Games</a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar
