import { NextSeo } from 'next-seo'
import { CompareDemo } from '../components/CompareDemo'
import TerminalLoader from '../components/ui/TerminalLoader'
import { useState } from 'react'

export default function DemoPage() {
  const [showLoader, setShowLoader] = useState(false)

  return (
    <>
      <NextSeo
        title="Code Comparison Demo - CodeRipper"
        description="See how CodeRipper's AI enhances your code with side-by-side comparison"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Code Enhancement Demo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience how CodeRipper's AI transforms your code with optimizations, proper documentation, and performance improvements.
            </p>
          </div>

          {/* Terminal Loader Demo */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Terminal Loader Animations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Code Execution</h3>
                <TerminalLoader 
                  isVisible={true}
                  text="Executing..."
                  animationType="static"
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">AI Processing</h3>
                <TerminalLoader 
                  isVisible={true}
                  text="Processing..."
                  animationType="typing"
                  texts={["Analyzing...", "Optimizing...", "Generating..."]}
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Default Animation</h3>
                <TerminalLoader 
                  isVisible={true}
                  text="Loading..."
                  animationType="typing"
                />
              </div>
            </div>
          </div>

          <CompareDemo />
          
          <div className="mt-16 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto">1</div>
                  <h3 className="font-semibold">Write Your Code</h3>
                  <p className="text-gray-600 dark:text-gray-300">Start with your original code in the editor</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto">2</div>
                  <h3 className="font-semibold">Run or Enhance</h3>
                  <p className="text-gray-600 dark:text-gray-300">Execute code or use AI enhancement with terminal loading</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto">3</div>
                  <h3 className="font-semibold">Review Results</h3>
                  <p className="text-gray-600 dark:text-gray-300">See output or side-by-side code comparison</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}