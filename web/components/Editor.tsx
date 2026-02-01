import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Editor as MonacoEditor } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'

import { 
  PlayIcon, 
  SparklesIcon,
  ShareIcon,
  DocumentArrowDownIcon,
  ClipboardIcon,
  CogIcon,
  XCircleIcon,
  CheckCircleIcon,
  CodeBracketIcon,
  ArrowPathIcon,
  ChatBubbleBottomCenterTextIcon,
  BugAntIcon,
  DocumentMagnifyingGlassIcon,
  WrenchScrewdriverIcon,
  LightBulbIcon,
  MinusIcon,
  PlusIcon,
  MapIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

import { LANGUAGES, type LanguageKey } from '@/lib/constants'
import InteractiveTerminal from './InteractiveTerminal'
import { downloadCode, generateShareableUrl, copyToClipboard } from '@/lib/utils'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Badge } from './ui/Badge'
import AIAssistantPanel from './AIAssistantPanel'
import LanguageSelector from './LanguageSelector'
import { CodeComparison } from './CodeComparison'
import TerminalLoader from './ui/TerminalLoader'
import ViralFeatures from './ViralFeatures'

interface EditorProps {
  language: LanguageKey
  onLanguageChange: (language: LanguageKey) => void
}

export default function Editor({ language, onLanguageChange }: EditorProps) {
  const editorRef = useRef<any>(null)
  const { theme } = useTheme()
  
  // State management
  const [code, setCode] = useState<string>(LANGUAGES[language].defaultCode)
  const [output, setOutput] = useState('')
  const [stdin, setStdin] = useState('')
  const [stdinInputs, setStdinInputs] = useState<string[]>([])
  const [collectedInputs, setCollectedInputs] = useState<string[]>([])
  const [showStdinInput, setShowStdinInput] = useState(false)
  const [waitingForInput, setWaitingForInput] = useState(false)
  const [expectedInputCount, setExpectedInputCount] = useState(0)
  const [aiResponse, setAiResponse] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [executionTime, setExecutionTime] = useState<number | null>(null)
  const [codeId] = useState(() => uuidv4())
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Comparison feature state
  const [showComparison, setShowComparison] = useState(false)
  const [enhancedCode, setEnhancedCode] = useState('')

  // Editor settings state
  const [fontSize, setFontSize] = useState(14)
  const [showMinimap, setShowMinimap] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [wordWrap, setWordWrap] = useState<'off' | 'on'>('off')
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })

  // Monaco editor theme
  const [editorTheme, setEditorTheme] = useState('vs')
  
  useEffect(() => {
    const isDark = theme === 'dark'
    setEditorTheme(isDark ? 'vs-dark' : 'vs')
  }, [theme])

  // Update code when language changes
  useEffect(() => {
    setCode(LANGUAGES[language].defaultCode)
    setHasUnsavedChanges(false)
  }, [language])

  // Auto-detect if code needs input and count expected inputs
  useEffect(() => {
    const currentCode = code
    const lowerCode = currentCode.toLowerCase()
    
    // Count input function calls
    let inputCount = 0
    
    // Python input() calls
    const pythonInputs = (currentCode.match(/input\s*\(/g) || []).length
    inputCount += pythonInputs
    
    // JavaScript readline() or prompt()
    const jsInputs = (lowerCode.match(/readline\s*\(|prompt\s*\(/g) || []).length
    inputCount += jsInputs
    
    // Java Scanner.nextLine(), nextInt(), etc.
    const javaInputs = (lowerCode.match(/\.next\w*\s*\(/g) || []).length
    inputCount += javaInputs
    
    // C/C++ scanf, cin
    const cInputs = (lowerCode.match(/scanf\s*\(|std::cin|cin\s*>>/g) || []).length
    inputCount += cInputs
    
    // Go fmt.Scan
    const goInputs = (lowerCode.match(/fmt\.scan/g) || []).length
    inputCount += goInputs
    
    const needsInput = inputCount > 0
    setShowStdinInput(needsInput)
    setExpectedInputCount(inputCount)
    
    // Reset collected inputs when code changes
    setCollectedInputs([])
    setStdinInputs([])
  }, [code])

  // Execute code with all collected inputs
  const executeWithInputs = async (inputs: string[], showInputsInOutput: boolean = false) => {
    const currentCode = editorRef.current?.getValue() || code
    const combinedStdin = inputs.join('\n')
    
    const startTime = Date.now()
    
    try {
      const response = await axios.post('/api/execute', {
        code: currentCode,
        language: language,
        stdin: combinedStdin,
        timeLimit: 30,
        memoryLimit: 256
      })
      
      const endTime = Date.now()
      setExecutionTime(response.data.executionTime || (endTime - startTime))
      
      if (response.data.success) {
        const rawOutput = response.data.output || 'Program executed successfully (no output)'
        
        // If we collected inputs interactively, merge them with output
        if (showInputsInOutput && inputs.length > 0) {
          // Parse the output to interleave with inputs properly
          const formattedOutput = formatOutputWithInputs(currentCode, rawOutput, inputs)
          setOutput(formattedOutput)
        } else {
          setOutput(rawOutput)
        }
        toast.success('Code executed successfully!')
      } else {
        let errorOutput = response.data.output || response.data.error || 'Execution failed'
        if (response.data.stderr) {
          errorOutput = response.data.stdout ? `${response.data.stdout}\n--- Error ---\n${response.data.stderr}` : response.data.stderr
        }
        setOutput(errorOutput)
        toast.error('Execution failed')
      }
    } catch (error: any) {
      const endTime = Date.now()
      setExecutionTime(endTime - startTime)
      
      const errorMessage = error.response?.data?.error || error.response?.data?.output || error.message || 'Execution error occurred'
      setOutput(errorMessage)
      toast.error('Execution failed')
    } finally {
      setIsRunning(false)
      setWaitingForInput(false)
      setHasUnsavedChanges(false)
    }
  }

  // Format output to show inputs inline with prompts (like a real terminal)
  const formatOutputWithInputs = (code: string, rawOutput: string, inputs: string[]): string => {
    // For Python, find all input() prompts and interleave with user inputs
    const inputPrompts = code.match(/input\s*\(\s*["']([^"']*?)["']\s*\)/gi) || []
    const prompts = inputPrompts.map(p => {
      const match = p.match(/input\s*\(\s*["']([^"']*?)["']\s*\)/i)
      return match ? match[1] : ''
    })
    
    // Split the raw output by lines that aren't from input prompts
    // The output from the backend includes everything after all inputs are received
    let result = ''
    
    // Build the interactive display
    for (let i = 0; i < Math.max(prompts.length, inputs.length); i++) {
      if (prompts[i]) {
        result += prompts[i]
      }
      if (inputs[i] !== undefined) {
        result += inputs[i] + '\n'
      }
    }
    
    // Add the actual program output (what comes after all inputs)
    // The raw output is everything printed after the input() calls
    result += rawOutput
    
    return result
  }

  const runCode = async () => {
    if (!editorRef.current || isRunning) return
    
    const currentCode = editorRef.current.getValue()
    setIsRunning(true)
    setOutput('')
    setCollectedInputs([])
    
    // Check if code needs input
    if (expectedInputCount > 0) {
      // If stdin is pre-provided, use it directly
      if (stdin.trim()) {
        const inputs = stdin.split('\n').filter(line => line.length > 0)
        // Show formatted output with pre-filled inputs
        await executeWithInputs(inputs, true)
      } else {
        // Start interactive mode - prompt for input
        setWaitingForInput(true)
        // Show initial prompt message based on code content
        const promptMatch = currentCode.match(/input\s*\(\s*["']([^"']+)["']\s*\)/i)
        const promptText = promptMatch ? promptMatch[1] : ''
        setOutput(promptText)
      }
    } else {
      // No input needed, execute directly
      await executeWithInputs([], false)
    }
  }

  // Handle terminal input
  const handleTerminalInput = async (input: string) => {
    const newInputs = [...collectedInputs, input]
    setCollectedInputs(newInputs)
    
    // Echo the input (like a real terminal)
    setOutput(prev => prev + input + '\n')
    
    // If we have all expected inputs, execute the code
    if (newInputs.length >= expectedInputCount) {
      setWaitingForInput(false)
      setOutput(prev => prev + '\n')
      // Execute with all collected inputs - output will be appended
      const currentCode = editorRef.current?.getValue() || code
      const combinedStdin = newInputs.join('\n')
      
      try {
        const startTime = Date.now()
        const response = await axios.post('/api/execute', {
          code: currentCode,
          language: language,
          stdin: combinedStdin,
          timeLimit: 30,
          memoryLimit: 256
        })
        
        const endTime = Date.now()
        setExecutionTime(response.data.executionTime || (endTime - startTime))
        
        if (response.data.success) {
          // Append only the actual output (not the prompts, since we already showed them)
          const rawOutput = response.data.output || ''
          setOutput(prev => prev + rawOutput)
          toast.success('Code executed successfully!')
        } else {
          let errorOutput = response.data.output || response.data.error || 'Execution failed'
          if (response.data.stderr) {
            errorOutput = response.data.stdout ? `${response.data.stdout}\n--- Error ---\n${response.data.stderr}` : response.data.stderr
          }
          setOutput(prev => prev + errorOutput)
          toast.error('Execution failed')
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message || 'Execution error'
        setOutput(prev => prev + '\n' + errorMessage)
        toast.error('Execution failed')
      } finally {
        setIsRunning(false)
        setHasUnsavedChanges(false)
      }
    } else {
      // Still need more inputs - show next prompt
      const currentCode = editorRef.current?.getValue() || code
      const inputMatches = currentCode.match(/input\s*\(\s*["']([^"']*?)["']\s*\)/gi) || []
      const nextPromptIndex = newInputs.length
      
      if (inputMatches[nextPromptIndex]) {
        const match = inputMatches[nextPromptIndex].match(/input\s*\(\s*["']([^"']*?)["']\s*\)/i)
        if (match && match[1]) {
          setOutput(prev => prev + match[1])
        }
      }
    }
  }

  // Clear terminal
  const clearTerminal = () => {
    setOutput('')
    setCollectedInputs([])
    setWaitingForInput(false)
  }

  // Format code
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run()
      toast.success('Code formatted!')
    }
  }

  // Get code statistics
  const getCodeStats = () => {
    const lines = code.split('\n').length
    const chars = code.length
    const words = code.split(/\s+/).filter(w => w.length > 0).length
    return { lines, chars, words }
  }

  const codeStats = getCodeStats()

  const shareCode = async () => {
    try {
      const shareUrl = generateShareableUrl(code, language)
      await copyToClipboard(shareUrl)
      toast.success('Share link copied to clipboard!')
    } catch {
      toast.error('Failed to create share link')
    }
  }

  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor
    
    // Configure Monaco for enhanced intellisense
    configureMonacoIntellisense(monaco)
    
    // Track cursor position
    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column
      })
    })
    
    // Add custom keybindings using monaco instance from @monaco-editor/react
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runCode()
    })
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS, () => {
      shareCode()
    })
  }, [runCode, shareCode])

  // Configure Monaco for full intellisense support
  const configureMonacoIntellisense = (monaco: any) => {
    // TypeScript/JavaScript compiler options for better intellisense
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
      strict: true,
      noImplicitAny: false,
    })

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      allowJs: true,
      checkJs: true,
    })

    // Enable validation
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    })

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    })

    // Add extra libraries for better completions
    const jsLib = `
      declare function console: {
        log(...args: any[]): void;
        error(...args: any[]): void;
        warn(...args: any[]): void;
        info(...args: any[]): void;
        debug(...args: any[]): void;
        table(data: any): void;
        time(label?: string): void;
        timeEnd(label?: string): void;
        clear(): void;
      };
      declare function setTimeout(callback: () => void, ms: number): number;
      declare function setInterval(callback: () => void, ms: number): number;
      declare function clearTimeout(id: number): void;
      declare function clearInterval(id: number): void;
      declare function fetch(url: string, options?: any): Promise<any>;
      declare function alert(message: string): void;
      declare function prompt(message: string): string | null;
      declare const JSON: {
        parse(text: string): any;
        stringify(value: any, replacer?: any, space?: number): string;
      };
      declare const Math: {
        PI: number;
        E: number;
        abs(x: number): number;
        floor(x: number): number;
        ceil(x: number): number;
        round(x: number): number;
        random(): number;
        max(...values: number[]): number;
        min(...values: number[]): number;
        pow(base: number, exponent: number): number;
        sqrt(x: number): number;
        sin(x: number): number;
        cos(x: number): number;
        tan(x: number): number;
      };
      declare class Array<T> {
        length: number;
        push(...items: T[]): number;
        pop(): T | undefined;
        shift(): T | undefined;
        unshift(...items: T[]): number;
        map<U>(callback: (item: T, index: number) => U): U[];
        filter(callback: (item: T, index: number) => boolean): T[];
        reduce<U>(callback: (acc: U, item: T) => U, initial: U): U;
        forEach(callback: (item: T, index: number) => void): void;
        find(callback: (item: T) => boolean): T | undefined;
        findIndex(callback: (item: T) => boolean): number;
        includes(item: T): boolean;
        indexOf(item: T): number;
        join(separator?: string): string;
        slice(start?: number, end?: number): T[];
        splice(start: number, deleteCount?: number, ...items: T[]): T[];
        sort(compare?: (a: T, b: T) => number): T[];
        reverse(): T[];
        concat(...items: T[][]): T[];
        flat(): any[];
        flatMap<U>(callback: (item: T) => U[]): U[];
      }
      declare class String {
        length: number;
        charAt(index: number): string;
        charCodeAt(index: number): number;
        concat(...strings: string[]): string;
        includes(search: string): boolean;
        indexOf(search: string): number;
        lastIndexOf(search: string): number;
        match(regexp: RegExp): string[] | null;
        replace(search: string | RegExp, replacement: string): string;
        slice(start?: number, end?: number): string;
        split(separator: string | RegExp): string[];
        substring(start: number, end?: number): string;
        toLowerCase(): string;
        toUpperCase(): string;
        trim(): string;
        trimStart(): string;
        trimEnd(): string;
        padStart(length: number, pad?: string): string;
        padEnd(length: number, pad?: string): string;
        repeat(count: number): string;
        startsWith(search: string): boolean;
        endsWith(search: string): boolean;
      }
      declare class Object {
        static keys(obj: any): string[];
        static values(obj: any): any[];
        static entries(obj: any): [string, any][];
        static assign(target: any, ...sources: any[]): any;
        static freeze<T>(obj: T): T;
        static seal<T>(obj: T): T;
      }
      declare class Promise<T> {
        constructor(executor: (resolve: (value: T) => void, reject: (reason?: any) => void) => void);
        then<U>(onFulfilled: (value: T) => U): Promise<U>;
        catch(onRejected: (reason: any) => void): Promise<T>;
        finally(onFinally: () => void): Promise<T>;
        static resolve<T>(value: T): Promise<T>;
        static reject(reason?: any): Promise<never>;
        static all<T>(promises: Promise<T>[]): Promise<T[]>;
        static race<T>(promises: Promise<T>[]): Promise<T>;
      }
    `
    monaco.languages.typescript.javascriptDefaults.addExtraLib(jsLib, 'ts:global.d.ts')
    monaco.languages.typescript.typescriptDefaults.addExtraLib(jsLib, 'ts:global.d.ts')

    // Register Python completions
    monaco.languages.registerCompletionItemProvider('python', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        }

        const pythonSuggestions = [
          // Built-in functions
          { label: 'print', kind: monaco.languages.CompletionItemKind.Function, insertText: 'print(${1:value})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Print to console', documentation: 'Print objects to the console' },
          { label: 'input', kind: monaco.languages.CompletionItemKind.Function, insertText: 'input(${1:prompt})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Read input', documentation: 'Read a line from input' },
          { label: 'len', kind: monaco.languages.CompletionItemKind.Function, insertText: 'len(${1:obj})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Get length', documentation: 'Return the length of an object' },
          { label: 'range', kind: monaco.languages.CompletionItemKind.Function, insertText: 'range(${1:start}, ${2:stop}, ${3:step})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Create range', documentation: 'Return a sequence of numbers' },
          { label: 'type', kind: monaco.languages.CompletionItemKind.Function, insertText: 'type(${1:obj})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Get type', documentation: 'Return the type of an object' },
          { label: 'int', kind: monaco.languages.CompletionItemKind.Function, insertText: 'int(${1:value})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Convert to int' },
          { label: 'str', kind: monaco.languages.CompletionItemKind.Function, insertText: 'str(${1:value})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Convert to string' },
          { label: 'float', kind: monaco.languages.CompletionItemKind.Function, insertText: 'float(${1:value})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Convert to float' },
          { label: 'list', kind: monaco.languages.CompletionItemKind.Function, insertText: 'list(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Create list' },
          { label: 'dict', kind: monaco.languages.CompletionItemKind.Function, insertText: 'dict(${1:})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Create dictionary' },
          { label: 'set', kind: monaco.languages.CompletionItemKind.Function, insertText: 'set(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Create set' },
          { label: 'tuple', kind: monaco.languages.CompletionItemKind.Function, insertText: 'tuple(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Create tuple' },
          { label: 'sorted', kind: monaco.languages.CompletionItemKind.Function, insertText: 'sorted(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Sort iterable' },
          { label: 'reversed', kind: monaco.languages.CompletionItemKind.Function, insertText: 'reversed(${1:sequence})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Reverse iterator' },
          { label: 'enumerate', kind: monaco.languages.CompletionItemKind.Function, insertText: 'enumerate(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Enumerate iterable' },
          { label: 'zip', kind: monaco.languages.CompletionItemKind.Function, insertText: 'zip(${1:iter1}, ${2:iter2})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Zip iterables' },
          { label: 'map', kind: monaco.languages.CompletionItemKind.Function, insertText: 'map(${1:function}, ${2:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Map function' },
          { label: 'filter', kind: monaco.languages.CompletionItemKind.Function, insertText: 'filter(${1:function}, ${2:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Filter iterable' },
          { label: 'sum', kind: monaco.languages.CompletionItemKind.Function, insertText: 'sum(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Sum values' },
          { label: 'min', kind: monaco.languages.CompletionItemKind.Function, insertText: 'min(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Get minimum' },
          { label: 'max', kind: monaco.languages.CompletionItemKind.Function, insertText: 'max(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Get maximum' },
          { label: 'abs', kind: monaco.languages.CompletionItemKind.Function, insertText: 'abs(${1:x})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Absolute value' },
          { label: 'round', kind: monaco.languages.CompletionItemKind.Function, insertText: 'round(${1:number}, ${2:digits})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Round number' },
          { label: 'open', kind: monaco.languages.CompletionItemKind.Function, insertText: 'open(${1:filename}, ${2:mode})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Open file' },
          { label: 'isinstance', kind: monaco.languages.CompletionItemKind.Function, insertText: 'isinstance(${1:obj}, ${2:classinfo})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Check instance' },
          { label: 'hasattr', kind: monaco.languages.CompletionItemKind.Function, insertText: 'hasattr(${1:obj}, ${2:name})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Check attribute' },
          { label: 'getattr', kind: monaco.languages.CompletionItemKind.Function, insertText: 'getattr(${1:obj}, ${2:name})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Get attribute' },
          { label: 'setattr', kind: monaco.languages.CompletionItemKind.Function, insertText: 'setattr(${1:obj}, ${2:name}, ${3:value})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Set attribute' },
          // Keywords and statements
          { label: 'def', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'def ${1:function_name}(${2:args}):\n\t${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Define function' },
          { label: 'class', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'class ${1:ClassName}:\n\tdef __init__(self${2:, args}):\n\t\t${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Define class' },
          { label: 'if', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'if ${1:condition}:\n\t${2:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'If statement' },
          { label: 'elif', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'elif ${1:condition}:\n\t${2:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Else if' },
          { label: 'else', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'else:\n\t${1:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Else' },
          { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for ${1:item} in ${2:iterable}:\n\t${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'For loop' },
          { label: 'while', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'while ${1:condition}:\n\t${2:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'While loop' },
          { label: 'try', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'try:\n\t${1:pass}\nexcept ${2:Exception} as e:\n\t${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Try-except' },
          { label: 'with', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'with ${1:expression} as ${2:var}:\n\t${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'With statement' },
          { label: 'lambda', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'lambda ${1:args}: ${2:expression}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Lambda function' },
          { label: 'import', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'import ${1:module}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Import module' },
          { label: 'from', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'from ${1:module} import ${2:name}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'From import' },
          { label: 'return', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'return ${1:value}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Return value' },
          { label: 'raise', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'raise ${1:Exception}(${2:message})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Raise exception' },
          { label: 'assert', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'assert ${1:condition}, ${2:message}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Assert statement' },
          // Common patterns
          { label: 'if __name__', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'if __name__ == "__main__":\n\t${1:main()}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Main guard' },
          { label: 'list comprehension', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '[${1:expr} for ${2:item} in ${3:iterable}]', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'List comprehension' },
          { label: 'dict comprehension', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '{${1:key}: ${2:value} for ${3:item} in ${4:iterable}}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Dict comprehension' },
        ]

        return { suggestions: pythonSuggestions.map(s => ({ ...s, range })) }
      }
    })

    // Register Java completions
    monaco.languages.registerCompletionItemProvider('java', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        }

        const javaSuggestions = [
          { label: 'System.out.println', kind: monaco.languages.CompletionItemKind.Function, insertText: 'System.out.println(${1:value});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Print to console' },
          { label: 'public static void main', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'public static void main(String[] args) {\n\t${1:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Main method' },
          { label: 'public class', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'public class ${1:ClassName} {\n\t${2:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Define class' },
          { label: 'private', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'private ${1:type} ${2:name};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Private field' },
          { label: 'public', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'public ${1:type} ${2:name}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Public member' },
          { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${3:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'For loop' },
          { label: 'foreach', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for (${1:Type} ${2:item} : ${3:collection}) {\n\t${4:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'For-each loop' },
          { label: 'while', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'while (${1:condition}) {\n\t${2:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'While loop' },
          { label: 'if', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'if (${1:condition}) {\n\t${2:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'If statement' },
          { label: 'try-catch', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'try {\n\t${1:// code}\n} catch (${2:Exception} e) {\n\t${3:e.printStackTrace();}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Try-catch block' },
          { label: 'ArrayList', kind: monaco.languages.CompletionItemKind.Class, insertText: 'ArrayList<${1:Type}> ${2:list} = new ArrayList<>();', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'ArrayList' },
          { label: 'HashMap', kind: monaco.languages.CompletionItemKind.Class, insertText: 'HashMap<${1:Key}, ${2:Value}> ${3:map} = new HashMap<>();', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'HashMap' },
          { label: 'Scanner', kind: monaco.languages.CompletionItemKind.Class, insertText: 'Scanner ${1:scanner} = new Scanner(System.in);', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Scanner for input' },
        ]

        return { suggestions: javaSuggestions.map(s => ({ ...s, range })) }
      }
    })

    // Register C/C++ completions
    monaco.languages.registerCompletionItemProvider('c', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        }

        const cSuggestions = [
          { label: 'printf', kind: monaco.languages.CompletionItemKind.Function, insertText: 'printf("${1:%s}\\n", ${2:value});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Print formatted' },
          { label: 'scanf', kind: monaco.languages.CompletionItemKind.Function, insertText: 'scanf("${1:%d}", &${2:var});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Read input' },
          { label: 'main', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'int main() {\n\t${1:// code}\n\treturn 0;\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Main function' },
          { label: '#include', kind: monaco.languages.CompletionItemKind.Keyword, insertText: '#include <${1:stdio.h}>', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Include header' },
          { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${3:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'For loop' },
          { label: 'while', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'while (${1:condition}) {\n\t${2:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'While loop' },
          { label: 'if', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'if (${1:condition}) {\n\t${2:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'If statement' },
          { label: 'struct', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'struct ${1:Name} {\n\t${2:int field;}\n};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Define struct' },
          { label: 'malloc', kind: monaco.languages.CompletionItemKind.Function, insertText: '(${1:int} *)malloc(${2:size} * sizeof(${1:int}))', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Allocate memory' },
          { label: 'free', kind: monaco.languages.CompletionItemKind.Function, insertText: 'free(${1:ptr});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Free memory' },
        ]

        return { suggestions: cSuggestions.map(s => ({ ...s, range })) }
      }
    })

    // Register Go completions
    monaco.languages.registerCompletionItemProvider('go', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        }

        const goSuggestions = [
          { label: 'fmt.Println', kind: monaco.languages.CompletionItemKind.Function, insertText: 'fmt.Println(${1:value})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Print with newline' },
          { label: 'fmt.Printf', kind: monaco.languages.CompletionItemKind.Function, insertText: 'fmt.Printf("${1:%v}\\n", ${2:value})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Print formatted' },
          { label: 'func main', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'func main() {\n\t${1:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Main function' },
          { label: 'func', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'func ${1:name}(${2:params}) ${3:returnType} {\n\t${4:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Define function' },
          { label: 'if err', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'if err != nil {\n\t${1:return err}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Error check' },
          { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for ${1:i} := 0; ${1:i} < ${2:n}; ${1:i}++ {\n\t${3:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'For loop' },
          { label: 'for range', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for ${1:i}, ${2:v} := range ${3:slice} {\n\t${4:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Range loop' },
          { label: 'struct', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'type ${1:Name} struct {\n\t${2:Field string}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Define struct' },
          { label: 'interface', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'type ${1:Name} interface {\n\t${2:Method() error}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Define interface' },
          { label: 'make slice', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'make([]${1:Type}, ${2:length})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Create slice' },
          { label: 'make map', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'make(map[${1:Key}]${2:Value})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Create map' },
          { label: 'defer', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'defer ${1:func()}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Defer execution' },
          { label: 'go', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'go ${1:func()}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Start goroutine' },
        ]

        return { suggestions: goSuggestions.map(s => ({ ...s, range })) }
      }
    })

    // Register Rust completions
    monaco.languages.registerCompletionItemProvider('rust', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        }

        const rustSuggestions = [
          { label: 'println!', kind: monaco.languages.CompletionItemKind.Function, insertText: 'println!("${1:{}}", ${2:value});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Print with newline' },
          { label: 'fn main', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'fn main() {\n\t${1:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Main function' },
          { label: 'fn', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'fn ${1:name}(${2:params}) -> ${3:Type} {\n\t${4:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Define function' },
          { label: 'let', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'let ${1:name} = ${2:value};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Variable binding' },
          { label: 'let mut', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'let mut ${1:name} = ${2:value};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Mutable variable' },
          { label: 'struct', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'struct ${1:Name} {\n\t${2:field}: ${3:Type},\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Define struct' },
          { label: 'impl', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'impl ${1:Name} {\n\t${2:// methods}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Implement block' },
          { label: 'match', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'match ${1:value} {\n\t${2:pattern} => ${3:expr},\n\t_ => ${4:default},\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Match expression' },
          { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for ${1:item} in ${2:iter} {\n\t${3:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'For loop' },
          { label: 'if let', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'if let ${1:Some(value)} = ${2:option} {\n\t${3:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'If let pattern' },
          { label: 'Result', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'Result<${1:T}, ${2:E}>', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Result type' },
          { label: 'Option', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'Option<${1:T}>', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'Option type' },
        ]

        return { suggestions: rustSuggestions.map(s => ({ ...s, range })) }
      }
    })

    // Register Inline Completion Provider for AI-like suggestions
    monaco.languages.registerInlineCompletionsProvider('*', {
      provideInlineCompletions: async (model: any, position: any, context: any, token: any) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        });
        
        const currentLine = model.getLineContent(position.lineNumber);
        const trimmedLine = currentLine.trim();
        
        // Smart inline suggestions based on context
        const suggestions: any[] = [];
        
        // Detect common patterns and provide inline completions
        const languageId = model.getLanguageId();
        
        // Python completions
        if (languageId === 'python') {
          if (trimmedLine.startsWith('def ') && !trimmedLine.includes(':')) {
            const funcName = trimmedLine.replace('def ', '').trim();
            suggestions.push({
              insertText: `${funcName}():\n    pass`,
              range: { startLineNumber: position.lineNumber, startColumn: currentLine.indexOf('def ') + 5, endLineNumber: position.lineNumber, endColumn: position.column }
            });
          }
          if (trimmedLine === 'if __name' || trimmedLine === 'if __name__') {
            suggestions.push({
              insertText: 'if __name__ == "__main__":\n    main()',
              range: { startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column }
            });
          }
          if (trimmedLine.startsWith('for ') && !trimmedLine.includes(':')) {
            suggestions.push({
              insertText: 'for i in range(10):\n    print(i)',
              range: { startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column }
            });
          }
          if (trimmedLine.startsWith('class ') && !trimmedLine.includes(':')) {
            const className = trimmedLine.replace('class ', '').trim();
            suggestions.push({
              insertText: `class ${className || 'MyClass'}:\n    def __init__(self):\n        pass`,
              range: { startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column }
            });
          }
        }
        
        // JavaScript/TypeScript completions
        if (languageId === 'javascript' || languageId === 'typescript') {
          if (trimmedLine.startsWith('function ') && !trimmedLine.includes('{')) {
            suggestions.push({
              insertText: 'function name() {\n  \n}',
              range: { startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column }
            });
          }
          if (trimmedLine.startsWith('const ') && trimmedLine.includes('= () =>')) {
            suggestions.push({
              insertText: ' {\n  \n}',
              range: { startLineNumber: position.lineNumber, startColumn: position.column, endLineNumber: position.lineNumber, endColumn: position.column }
            });
          }
          if (trimmedLine === 'console.l' || trimmedLine === 'console.lo') {
            suggestions.push({
              insertText: 'console.log();',
              range: { startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column }
            });
          }
        }
        
        // Java completions
        if (languageId === 'java') {
          if (trimmedLine === 'public static void m' || trimmedLine.includes('public static void main')) {
            suggestions.push({
              insertText: 'public static void main(String[] args) {\n        \n    }',
              range: { startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column }
            });
          }
          if (trimmedLine.startsWith('System.out.p')) {
            suggestions.push({
              insertText: 'System.out.println();',
              range: { startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column }
            });
          }
        }
        
        // C/C++ completions
        if (languageId === 'c' || languageId === 'cpp') {
          if (trimmedLine === '#include' || trimmedLine === '#incl') {
            suggestions.push({
              insertText: '#include <stdio.h>',
              range: { startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column }
            });
          }
          if (trimmedLine.startsWith('int main') && !trimmedLine.includes('{')) {
            suggestions.push({
              insertText: 'int main() {\n    \n    return 0;\n}',
              range: { startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column }
            });
          }
        }

        return {
          items: suggestions.map(s => ({
            insertText: s.insertText,
            range: new monaco.Range(
              position.lineNumber, 
              1, 
              position.lineNumber, 
              position.column
            )
          }))
        };
      },
      freeInlineCompletions: () => {}
    });
  }

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
      setHasUnsavedChanges(true)
    }
  }, [])

  const downloadCodeFile = () => {
    downloadCode(code, language, `my-code-${codeId}`)
    toast.success('Code downloaded successfully!')
  }

  const explainWithAI = async () => {
    setIsAiLoading(true)
    setShowAiPanel(true)
    
    try {
      const response = await axios.post('/api/ai', {
        action: 'explain',
        code: code,
        language: language,
        output: output || undefined
      })
      
      if (response.data.success) {
        setAiResponse(response.data.response)
        if (response.data.model && response.data.model !== 'mock') {
          const info = response.data.fallbackUsed 
            ? `Explained using ${response.data.model} (fallback)`
            : `Explained using ${response.data.model}`
          toast.success(info)
        }
      } else {
        setAiResponse('AI service error: ' + (response.data.error || 'Unknown error'))
        toast.error('AI service error')
      }
    } catch (error) {
      setAiResponse('AI service temporarily unavailable. Please try again later.')
      toast.error('AI service error')
    } finally {
      setIsAiLoading(false)
    }
  }

  const optimizeCode = async () => {
    setIsAiLoading(true)
    setShowAiPanel(true)
    
    try {
      const response = await axios.post('/api/ai', {
        action: 'optimize',
        code: code,
        language: language
      })
      
      if (response.data.success) {
        setAiResponse(response.data.response)
        if (response.data.model && response.data.model !== 'mock') {
          toast.success(`Optimized using ${response.data.model}`)
        }
      } else {
        setAiResponse('AI service error: ' + (response.data.error || 'Unknown error'))
        toast.error('AI service error')
      }
    } catch (error) {
      setAiResponse('AI service temporarily unavailable. Please try again later.')
      toast.error('AI service error')
    } finally {
      setIsAiLoading(false)
    }
  }

  const enhanceCodeWithComparison = async () => {
    setIsAiLoading(true)
    
    try {
      const response = await axios.post('/api/ai', {
        action: 'optimize',
        code: code,
        language: language
      })
      
      if (response.data.success) {
        // Extract code from AI response (assuming it's wrapped in code blocks)
        const codeMatch = response.data.response.match(/```[\w]*\n([\s\S]*?)```/)
        const optimizedCode = codeMatch ? codeMatch[1].trim() : response.data.response
        
        setEnhancedCode(optimizedCode)
        setShowComparison(true)
        toast.success('Code enhanced! Compare with original.')
      } else {
        toast.error('AI service error: ' + (response.data.error || 'Unknown error'))
      }
    } catch (error) {
      toast.error('AI service temporarily unavailable. Please try again later.')
    } finally {
      setIsAiLoading(false)
    }
  }

  const generateComments = async () => {
    setIsAiLoading(true)
    setShowAiPanel(true)
    
    try {
      const response = await axios.post('/api/ai', {
        action: 'comment',
        code: code,
        language: language
      })
      
      if (response.data.success) {
        setAiResponse(response.data.response)
        // Show which model was used
        if (response.data.model && response.data.model !== 'mock') {
          toast.success(`Generated using ${response.data.model}`)
        }
      } else {
        setAiResponse('AI service error: ' + (response.data.error || 'Unknown error'))
        toast.error('AI service error')
      }
    } catch (error) {
      setAiResponse('AI service temporarily unavailable. Please try again later.')
      toast.error('AI service error')
    } finally {
      setIsAiLoading(false)
    }
  }

  const debugCode = async () => {
    if (!output) {
      toast.error('Run your code first to get output/errors to debug')
      return
    }
    
    setIsAiLoading(true)
    setShowAiPanel(true)
    
    try {
      const response = await axios.post('/api/ai', {
        action: 'debug',
        code: code,
        language: language,
        output: output
      })
      
      if (response.data.success) {
        setAiResponse(response.data.response)
        if (response.data.fallbackUsed) {
          toast.success('Analysis completed (using fallback model)')
        }
      } else {
        setAiResponse('AI service error: ' + (response.data.error || 'Unknown error'))
        toast.error('AI service error')
      }
    } catch (error) {
      setAiResponse('AI service temporarily unavailable. Please try again later.')
      toast.error('AI service error')
    } finally {
      setIsAiLoading(false)
    }
  }

  const reviewCode = async () => {
    setIsAiLoading(true)
    setShowAiPanel(true)
    
    try {
      const response = await axios.post('/api/ai', {
        action: 'review',
        code: code,
        language: language
      })
      
      if (response.data.success) {
        setAiResponse(response.data.response)
      } else {
        setAiResponse('AI service error: ' + (response.data.error || 'Unknown error'))
        toast.error('AI service error')
      }
    } catch (error) {
      setAiResponse('AI service temporarily unavailable. Please try again later.')
      toast.error('AI service error')
    } finally {
      setIsAiLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-[80vh]"
    >
      {/* Editor Panel */}
      <div className="xl:col-span-2 space-y-4">
        {/* Editor Header */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <LanguageSelector
                  selectedLanguage={language}
                  onLanguageChange={onLanguageChange}
                  className="w-auto"
                />
                
                {hasUnsavedChanges && (
                  <Badge variant="outline" className="text-xs">
                    Unsaved changes
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                {/* AI Actions Group */}
                <div className="flex items-center gap-1 border-r pr-2 mr-2 border-gray-200 dark:border-gray-700">
                  <div className="relative group">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={explainWithAI}
                      disabled={isAiLoading}
                      className="hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      <SparklesIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </Button>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      Explain Code
                    </span>
                  </div>
                  
                  <div className="relative group">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={optimizeCode}
                      disabled={isAiLoading}
                      className="hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <WrenchScrewdriverIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </Button>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      Optimize Code
                    </span>
                  </div>
                  
                  <div className="relative group">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={enhanceCodeWithComparison}
                      disabled={isAiLoading}
                      className="hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <CodeBracketIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </Button>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      Enhance & Compare
                    </span>
                  </div>
                  
                  <div className="relative group">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={generateComments}
                      disabled={isAiLoading}
                      className="hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                    >
                      <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </Button>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      Generate Comments
                    </span>
                  </div>
                  
                  <div className="relative group">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={debugCode}
                      disabled={isAiLoading}
                      className="hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <BugAntIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </Button>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      Debug Code
                    </span>
                  </div>
                  
                  <div className="relative group">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={reviewCode}
                      disabled={isAiLoading}
                      className="hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors"
                    >
                      <DocumentMagnifyingGlassIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    </Button>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      Review Code
                    </span>
                  </div>
                </div>
                
                {/* Utility Actions Group */}
                <div className="relative group">
                  <Button variant="ghost" size="icon" onClick={shareCode}>
                    <ShareIcon className="w-4 h-4" />
                  </Button>
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    Share Code
                  </span>
                </div>
                
                <div className="relative group">
                  <Button variant="ghost" size="icon" onClick={downloadCodeFile}>
                    <DocumentArrowDownIcon className="w-4 h-4" />
                  </Button>
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    Download Code
                  </span>
                </div>

                {/* Editor Settings */}
                <div className="relative">
                  <div className="relative group">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowSettings(!showSettings)}
                    >
                      <Cog6ToothIcon className="w-4 h-4" />
                    </Button>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      Editor Settings
                    </span>
                  </div>
                  
                  {/* Settings Dropdown */}
                  <AnimatePresence>
                    {showSettings && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-popover border border-border shadow-xl z-50 overflow-hidden"
                        >
                          <div className="p-3 border-b border-border">
                            <h3 className="font-semibold text-sm">Editor Settings</h3>
                          </div>
                          <div className="p-3 space-y-4">
                            {/* Font Size */}
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                                Font Size: {fontSize}px
                              </label>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                                >
                                  <MinusIcon className="w-3 h-3" />
                                </Button>
                                <input
                                  type="range"
                                  min="10"
                                  max="24"
                                  value={fontSize}
                                  onChange={(e) => setFontSize(Number(e.target.value))}
                                  className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                                />
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                                >
                                  <PlusIcon className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            
                            {/* Toggles */}
                            <div className="space-y-2">
                              <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm">Minimap</span>
                                <button
                                  onClick={() => setShowMinimap(!showMinimap)}
                                  className={`w-10 h-5 rounded-full transition-colors ${showMinimap ? 'bg-violet-500' : 'bg-muted'}`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${showMinimap ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </button>
                              </label>
                              
                              <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm">Word Wrap</span>
                                <button
                                  onClick={() => setWordWrap(wordWrap === 'off' ? 'on' : 'off')}
                                  className={`w-10 h-5 rounded-full transition-colors ${wordWrap === 'on' ? 'bg-violet-500' : 'bg-muted'}`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${wordWrap === 'on' ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </button>
                              </label>
                            </div>
                            
                            {/* Format Button */}
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => { formatCode(); setShowSettings(false); }}
                            >
                              <CodeBracketIcon className="w-4 h-4 mr-2" />
                              Format Code
                            </Button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="relative group">
                  <Button 
                    onClick={runCode}
                    disabled={isRunning}
                    className="shine ml-2"
                  >
                    <PlayIcon className="w-4 h-4 mr-2" />
                    {isRunning ? 'Running...' : 'Run Code'}
                  </Button>
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    Execute Code (Ctrl+Enter)
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Monaco Editor */}
        <Card className="flex-1 relative">
          <div className="h-[500px]">
            <MonacoEditor
              height="500px"
              defaultLanguage={LANGUAGES[language].monacoLanguage}
              language={LANGUAGES[language].monacoLanguage}
              value={code}
              theme={editorTheme}
              onChange={handleCodeChange}
              onMount={handleEditorDidMount}
              options={{
                automaticLayout: true,
                minimap: { enabled: showMinimap, scale: 1, showSlider: 'mouseover' },
                scrollBeyondLastLine: false,
                fontSize: fontSize,
                wordWrap: wordWrap,
                fontFamily: 'JetBrains Mono, Monaco, Cascadia Code, Fira Code, monospace',
                fontLigatures: true,
                lineNumbers: 'on',
                roundedSelection: true,
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible',
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                },
                padding: { top: 16, bottom: 16 },
                // Intellisense & Suggestions
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: 'on',
                tabCompletion: 'on',
                wordBasedSuggestions: 'allDocuments',
                quickSuggestions: {
                  other: true,
                  comments: true,
                  strings: true
                },
                suggestSelection: 'first',
                snippetSuggestions: 'top',
                suggest: {
                  showKeywords: true,
                  showSnippets: true,
                  showClasses: true,
                  showFunctions: true,
                  showVariables: true,
                  showConstants: true,
                  showColors: true,
                  showFiles: true,
                  showReferences: true,
                  showFolders: true,
                  showTypeParameters: true,
                  showIssues: true,
                  showUsers: false,
                  showWords: true,
                  insertMode: 'replace',
                  filterGraceful: true,
                  localityBonus: true,
                  shareSuggestSelections: true,
                  showMethods: true,
                  showModules: true,
                  showProperties: true,
                  showEvents: true,
                  showOperators: true,
                  showUnits: true,
                  showValues: true,
                  showEnumMembers: true,
                  showInterfaces: true,
                  showStructs: true,
                },
                // Code folding
                folding: true,
                foldingStrategy: 'indentation',
                showFoldingControls: 'always',
                unfoldOnClickAfterEndOfLine: false,
                // Bracket matching
                bracketPairColorization: { enabled: true },
                matchBrackets: 'always',
                autoClosingBrackets: 'always',
                autoClosingQuotes: 'always',
                autoClosingOvertype: 'always',
                autoSurround: 'languageDefined',
                // Error markers
                renderValidationDecorations: 'on',
                // Formatting
                formatOnPaste: true,
                formatOnType: true,
                // Parameter hints
                parameterHints: {
                  enabled: true,
                  cycle: true
                },
                // Hover info
                hover: {
                  enabled: true,
                  delay: 300,
                  sticky: true
                },
                // Code lens
                codeLens: true,
                // Inlay hints
                inlayHints: {
                  enabled: 'on'
                },
                // Word highlighting
                occurrencesHighlight: 'singleFile',
                selectionHighlight: true,
                // Cursor
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                cursorStyle: 'line',
                // Linked editing (for tags, etc.)
                linkedEditing: true,
                // Smooth scrolling
                smoothScrolling: true,
                // Rename on type
                renameOnType: true,
              }}
            />
          </div>
          
          {/* Status Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {LANGUAGES[language].name}
              </span>
              <span>
                Ln {cursorPosition.line}, Col {cursorPosition.column}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>{codeStats.lines} lines</span>
              <span>{codeStats.chars} chars</span>
              <span>{fontSize}px</span>
              {executionTime && (
                <span className="text-green-600 dark:text-green-400">
                  ⚡ {executionTime}ms
                </span>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Output Panel */}
      <div className="space-y-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Output</span>
                {executionTime && (
                  <Badge variant="outline" className="text-xs">
                    {executionTime}ms
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative group">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={explainWithAI}
                    disabled={isAiLoading}
                    className="w-8 h-8"
                  >
                    <SparklesIcon className="w-4 h-4" />
                  </Button>
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    AI Explain Output
                  </span>
                </div>
                
                {output && (
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(output)}
                      className="w-8 h-8"
                    >
                      <ClipboardIcon className="w-4 h-4" />
                    </Button>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      Copy Output
                    </span>
                  </div>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 p-0">
            {/* Interactive Terminal - Full height */}
            <div className="h-72">
              <InteractiveTerminal
                isRunning={isRunning && !waitingForInput}
                output={output}
                onSendInput={handleTerminalInput}
                onClear={clearTerminal}
                waitingForInput={waitingForInput}
                stdinValue={stdin}
                onStdinChange={setStdin}
                showStdinInput={showStdinInput && !isRunning && !waitingForInput}
                expectedInputCount={expectedInputCount}
              />
            </div>
            
            {/* Viral Features - Stats, Shortcuts, Challenges */}
            <ViralFeatures
              code={code}
              language={language}
              executionTime={executionTime}
              isRunning={isRunning}
            />
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant Panel */}
      <AIAssistantPanel
        isVisible={showAiPanel}
        onClose={() => setShowAiPanel(false)}
        aiResponse={aiResponse}
        isLoading={isAiLoading}
        onExplainError={explainWithAI}
        onOptimizeCode={optimizeCode}
        onGenerateComments={generateComments}
      />

      {/* AI Processing Overlay */}
      {isAiLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-2xl"
          >
            <div className="text-center mb-4">
              <SparklesIcon className="w-8 h-8 mx-auto mb-2 text-primary animate-pulse" />
              <p className="text-lg font-semibold">AI Processing</p>
              <p className="text-sm text-muted-foreground">Enhancing your code...</p>
            </div>
            <TerminalLoader 
              isVisible={true}
              text="Processing..."
              animationType="typing"
              texts={["Analyzing code...", "Optimizing...", "Generating...", "Almost done..."]}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Code Comparison Modal */}
      <CodeComparison
        isVisible={showComparison}
        onClose={() => setShowComparison(false)}
        originalCode={code}
        enhancedCode={enhancedCode}
        language={language}
        onApply={(newCode) => {
          setCode(newCode);
          setShowComparison(false);
        }}
      />
    </motion.div>
  )
}
