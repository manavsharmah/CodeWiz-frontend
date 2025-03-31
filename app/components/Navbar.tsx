'use client'
import React, { useState, useRef } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 300); // Adjust delay time (300ms) if needed
  };

  return (
    <nav className="bg-gray-900 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="Logo" className="h-8 w-auto sm:h-10" />
              <p className="text-2xl font-bold text-purple-700">CodeWiz</p>
            </a>
          </div>

          {/* Menu Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="/" className="text-purple-600 hover:text-orange-500">Home</a>
            <a href="/questions" className="text-purple-600 hover:text-orange-500">Questions</a>
            <a href="/sorting-visualizer" className="text-purple-600 hover:text-orange-500">Sorting Visualizer</a>
            
            {/* Data Structure Visualizer Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="text-purple-600 hover:text-orange-500 focus:outline-none">
                <a href="/data-structure-visualizer">Data Structure Visualizer</a>
              </button>
              {dropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 transition-opacity duration-300"
                  onMouseEnter={handleMouseEnter}  // Keeps it open when interacting
                  onMouseLeave={handleMouseLeave}
                >
                  <a href="/data-structure-visualizer/array" className="block px-4 py-2 text-purple-600 hover:bg-gray-700 hover:text-orange-500">Array</a>
                  <a href="/data-structure-visualizer/linked-list" className="block px-4 py-2 text-purple-600 hover:bg-gray-700 hover:text-orange-500">Linked List</a>
                  <a href="/data-structure-visualizer/hash-table" className="block px-4 py-2 text-purple-600 hover:bg-gray-700 hover:text-orange-500">Hash Table</a>
                  <a href="/data-structure-visualizer/binary-search-tree" className="block px-4 py-2 text-purple-600 hover:bg-gray-700 hover:text-orange-500">Binary Search Tree</a>
                  <a href="/data-structure-visualizer/binary-heap" className="block px-4 py-2 text-purple-600 hover:bg-gray-700 hover:text-orange-500">Binary Heap</a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-purple-600 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="block text-purple-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Home</a>
            <a href="/questions" className="block text-purple-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Questions</a>
            <a href="/sorting-visualizer" className="block text-purple-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Sorting Visualizer</a>

            {/* Mobile Data Structure Visualizer Dropdown */}
            <div>
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="w-full text-left text-purple-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium"
              >
                <a href="/data-structure-visualizer">Data Structure Visualizer</a>
              </button>
              {mobileDropdownOpen && (
                <div className="ml-4 space-y-1">
                  <a href="/array" className="block text-purple-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Array</a>
                  <a href="/linked-list" className="block text-purple-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Linked List</a>
                  <a href="/hash-table" className="block text-purple-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Hash Table</a>
                  <a href="/binary-search-tree" className="block text-purple-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Binary Search Tree</a>
                  <a href="/binary-heap" className="block text-purple-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Binary Heap</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
