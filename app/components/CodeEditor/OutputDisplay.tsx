"use client"
import { useState } from "react"
import type React from "react"
import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface TestCase {
  input: string
  expected_output: string
  actual_output: string
  passed: boolean
}

interface TestSummary {
  total_cases: number
  passed_cases: number
}

interface TestResults {
  results: TestCase[]
  summary: TestSummary
}

interface OutputDisplayProps {
  output?: string
  results?: TestResults
  error?: string
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, results, error }) => {
  const [expandedTests, setExpandedTests] = useState<Record<number, boolean>>({})

  const toggleTestCase = (index: number) => {
    setExpandedTests((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // If there's nothing to display
  if (!output && !results && !error) return null

  // If there's an error
  if (error) {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium text-white mb-2">Error:</h3>
        <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 font-mono text-sm overflow-auto max-h-[200px]">
          <div className="flex items-start">
            <AlertCircle className="text-red-400 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
            <pre className="text-red-300 whitespace-pre-wrap">{error}</pre>
          </div>
        </div>
      </div>
    )
  }

  // If there are test results
  if (results && results.results) {
    const { summary, results: testCases } = results

    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Test Results</h3>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              summary.passed_cases === summary.total_cases
                ? "bg-green-900/30 text-green-400 border border-green-700/30"
                : "bg-red-900/30 text-red-400 border border-red-700/30"
            }`}
          >
            {summary.passed_cases} / {summary.total_cases} Tests Passed
          </div>
        </div>

        <div className="space-y-3">
          {testCases.map((test, index) => (
            <div
              key={index}
              className={`bg-gray-900/50 rounded-lg border ${
                test.passed
                  ? "border-green-700/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                  : "border-red-700/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
              }`}
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleTestCase(index)}
              >
                <div className="flex items-center">
                  {test.passed ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="font-medium text-white">Test Case {index + 1}</span>
                </div>
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={expandedTests[index] ? "Collapse test case" : "Expand test case"}
                >
                  {expandedTests[index] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>

              <AnimatePresence>
                {expandedTests[index] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-gray-800 pt-3 space-y-3">
                      <div>
                        <div className="text-sm font-medium text-gray-400 mb-1">Input:</div>
                        <div className="bg-black/50 p-2 rounded font-mono text-sm text-[#F09319] overflow-x-auto">
                          {test.input}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <div className="text-sm font-medium text-gray-400 mb-1">Expected Output:</div>
                          <div className="bg-black/50 p-2 rounded font-mono text-sm text-[#8B5DFF] overflow-x-auto">
                            {test.expected_output}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-400 mb-1">Your Output:</div>
                          <div
                            className={`bg-black/50 p-2 rounded font-mono text-sm overflow-x-auto ${
                              test.passed ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {test.actual_output}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // If there's just plain output
  if (output) {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium text-white mb-2">Output:</h3>
        <div className="bg-black/70 border border-gray-800 rounded-lg p-4 font-mono text-sm overflow-auto max-h-[200px]">
          <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    )
  }

  return null
}

export default OutputDisplay
