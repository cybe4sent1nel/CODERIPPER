import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  SparklesIcon, 
  ClipboardDocumentIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Badge } from './ui/Badge'
import MarkdownRenderer from './MarkdownRenderer'
import toast from 'react-hot-toast'

interface AIAssistantPanelProps {
  isVisible: boolean
  onClose: () => void
  aiResponse: string
  isLoading: boolean
  onExplainError: () => void
  onOptimizeCode: () => void
  onGenerateComments: () => void
}

export default function AIAssistantPanel({
  isVisible,
  onClose,
  aiResponse,
  isLoading,
  onExplainError,
  onOptimizeCode,
  onGenerateComments
}: AIAssistantPanelProps) {
  const [activeTab, setActiveTab] = useState<'explain' | 'optimize' | 'comment'>('explain')
  const [isActionsExpanded, setIsActionsExpanded] = useState(true)
  const [isResponseExpanded, setIsResponseExpanded] = useState(true)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-96 z-40 bg-card border-l shadow-2xl"
        >
          <Card className="h-full rounded-none border-0 flex flex-col">
            <CardHeader className="flex-row items-center justify-between space-y-0 border-b flex-shrink-0 py-3 px-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <SparklesIcon className="w-5 h-5 text-primary" />
                AI Assistant
                <Badge variant="outline" className="text-xs">
                  GPT-4
                </Badge>
              </CardTitle>
              <button 
                onClick={onClose} 
                className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition-colors"
                title="Close AI Panel"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b">
                {[
                  { id: 'explain', label: 'Explain', icon: ChatBubbleLeftRightIcon },
                  { id: 'optimize', label: 'Optimize', icon: SparklesIcon },
                  { id: 'comment', label: 'Comment', icon: ClipboardDocumentIcon }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                      activeTab === id
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Action Buttons - Collapsible */}
              <div className="border-b flex-shrink-0">
                <button
                  onClick={() => setIsActionsExpanded(!isActionsExpanded)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-primary" />
                    AI Features
                  </span>
                  {isActionsExpanded ? (
                    <ChevronUpIcon className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                
                <AnimatePresence>
                  {isActionsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-2">
                        <Button 
                          onClick={onExplainError}
                          disabled={isLoading}
                          className="w-full justify-start"
                          variant={activeTab === 'explain' ? 'default' : 'outline'}
                        >
                          <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                          {isLoading && activeTab === 'explain' ? 'Analyzing...' : 'Explain Code/Error'}
                        </Button>
                        
                        <Button 
                          onClick={onOptimizeCode}
                          disabled={isLoading}
                          className="w-full justify-start"
                          variant={activeTab === 'optimize' ? 'default' : 'outline'}
                        >
                          <SparklesIcon className="w-4 h-4 mr-2" />
                          {isLoading && activeTab === 'optimize' ? 'Optimizing...' : 'Optimize Code'}
                        </Button>
                        
                        <Button 
                          onClick={onGenerateComments}
                          disabled={isLoading}
                          className="w-full justify-start"
                          variant={activeTab === 'comment' ? 'default' : 'outline'}
                        >
                          <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
                          {isLoading && activeTab === 'comment' ? 'Generating...' : 'Generate Comments'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AI Response - Collapsible */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <button
                  onClick={() => setIsResponseExpanded(!isResponseExpanded)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors flex-shrink-0 border-b"
                >
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-primary" />
                    AI Response
                    {aiResponse && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        New
                      </Badge>
                    )}
                  </span>
                  {isResponseExpanded ? (
                    <ChevronUpIcon className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                
                <AnimatePresence>
                  {isResponseExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 overflow-y-auto"
                    >
                      <div className="p-4">
                        {isLoading ? (
                          <div className="flex flex-col items-center justify-center h-32 gap-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                              <SparklesIcon className="w-8 h-8 text-primary" />
                            </motion.div>
                            <p className="text-sm text-muted-foreground">Analyzing your code...</p>
                          </div>
                        ) : aiResponse ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(aiResponse)}
                                className="h-7 px-2"
                              >
                                <ClipboardDocumentIcon className="w-4 h-4 mr-1" />
                                Copy
                              </Button>
                            </div>
                            
                            {/* Beautifully rendered markdown */}
                            <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                              <MarkdownRenderer content={aiResponse} />
                            </div>

                            <div className="text-xs text-muted-foreground border-t pt-3 flex items-center gap-2">
                              <SparklesIcon className="w-3.5 h-3.5" />
                              AI-generated response. Always review before applying.
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            <SparklesIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-sm">
                              Select an AI feature above to get started with intelligent code assistance.
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}