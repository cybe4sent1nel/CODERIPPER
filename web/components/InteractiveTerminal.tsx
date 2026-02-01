import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface InteractiveTerminalProps {
  isRunning: boolean
  output: string
  onSendInput: (input: string) => void
  onClear: () => void
  waitingForInput: boolean
  className?: string
  stdinValue?: string
  onStdinChange?: (value: string) => void
  showStdinInput?: boolean
  expectedInputCount?: number
}

export default function InteractiveTerminal({
  isRunning,
  output,
  onSendInput,
  onClear,
  waitingForInput,
  className = '',
  stdinValue = '',
  onStdinChange,
  showStdinInput = false,
  expectedInputCount = 0
}: InteractiveTerminalProps) {
  const [currentInput, setCurrentInput] = useState('')
  const [inputHistory, setInputHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showPreFill, setShowPreFill] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output, waitingForInput])

  // Focus input when waiting for input
  useEffect(() => {
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus()
    }
  }, [waitingForInput])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const inputValue = currentInput
      
      // Add to history
      if (inputValue.trim()) {
        setInputHistory(prev => [...prev, inputValue])
      }
      setHistoryIndex(-1)
      
      // Send input (even empty for programs that need Enter)
      onSendInput(inputValue)
      
      // Clear input
      setCurrentInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (inputHistory.length > 0) {
        const newIndex = historyIndex < inputHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setCurrentInput(inputHistory[inputHistory.length - 1 - newIndex] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentInput(inputHistory[inputHistory.length - 1 - newIndex] || '')
      } else {
        setHistoryIndex(-1)
        setCurrentInput('')
      }
    }
  }

  // Determine text color based on content
  const getTextClass = (text: string, index: number, allLines: string[]) => {
    // Error messages in red
    if (text.includes('Error') || text.includes('error') || text.includes('Traceback') || text.includes('Exception') || text.includes('failed')) {
      return 'text-red-400'
    }
    // User input (lines that follow a prompt ending with : or ?)
    const prevLine = index > 0 ? allLines[index - 1] : ''
    if (prevLine && (prevLine.endsWith(':') || prevLine.endsWith('?') || prevLine.includes('Enter') || prevLine.includes('input'))) {
      // This might be user input
      if (!text.includes(':') && !text.includes('?') && text.trim().length > 0 && text.trim().length < 50) {
        return 'text-cyan-400'
      }
    }
    // Prompts (lines ending with : or containing "Enter")
    if (text.endsWith(':') || text.endsWith('?') || text.includes('Enter your') || text.includes('Input')) {
      return 'text-yellow-300'
    }
    // Success messages
    if (text.includes('success') || text.includes('Success') || text.includes('Hello') || text.includes('Welcome')) {
      return 'text-green-400'
    }
    return 'text-gray-200'
  }

  return (
    <div className={`flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-gray-400 ml-2 font-mono">terminal</span>
          {showStdinInput && expectedInputCount > 0 && (
            <button
              onClick={() => setShowPreFill(!showPreFill)}
              className="flex items-center gap-1 ml-2 px-2 py-0.5 text-xs text-gray-400 hover:text-gray-200 bg-gray-700 rounded transition-colors"
            >
              {expectedInputCount} input{expectedInputCount > 1 ? 's' : ''}
              {showPreFill ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 text-xs text-green-400"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Running
            </motion.div>
          )}
          {waitingForInput && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 text-xs text-yellow-400"
            >
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              Awaiting Input
            </motion.div>
          )}
          <button
            onClick={onClear}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Clear terminal"
          >
            <TrashIcon className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Pre-fill Input Dropdown */}
      {showPreFill && showStdinInput && onStdinChange && (
        <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700">
          <textarea
            value={stdinValue}
            onChange={(e) => onStdinChange(e.target.value)}
            placeholder="Pre-fill inputs (one per line)..."
            className="w-full h-12 p-2 text-xs font-mono bg-gray-900 text-gray-300 border border-gray-700 rounded resize-none focus:outline-none focus:border-gray-600"
          />
        </div>
      )}

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {!output && !isRunning && !waitingForInput ? (
          <div className="text-gray-500">
            <span className="text-green-400">$</span> Click "Run Code" or press Ctrl+Enter to execute...
          </div>
        ) : (
          <div className="whitespace-pre-wrap">
            {(() => {
              const lines = output.split('\n')
              return lines.map((line, index) => (
                <div key={index} className={getTextClass(line, index, lines)}>
                  {line || '\u00A0'}
                </div>
              ))
            })()}
          </div>
        )}

        {/* Input line when waiting */}
        {waitingForInput && (
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-cyan-400 font-mono caret-cyan-400"
              placeholder=""
              autoFocus
            />
            <span className="text-cyan-400 animate-pulse">▊</span>
          </div>
        )}

        {/* Running indicator */}
        {isRunning && !waitingForInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-400 mt-2"
          >
            <div className="flex gap-1">
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ●
              </motion.span>
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              >
                ●
              </motion.span>
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              >
                ●
              </motion.span>
            </div>
            <span className="text-xs">Executing</span>
          </motion.div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-1 bg-gray-800 border-t border-gray-700 text-xs text-gray-500 flex justify-between">
        <span>
          {isRunning && !waitingForInput ? 'Running...' : waitingForInput ? 'Type and press Enter' : output ? 'Completed' : 'Ready'}
        </span>
        <span className="text-gray-600">CodeRipper Terminal</span>
      </div>
    </div>
  )
}
