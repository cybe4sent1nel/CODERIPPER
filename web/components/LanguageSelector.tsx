import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, CommandLineIcon } from '@heroicons/react/24/outline'
import { LANGUAGES, type LanguageKey } from '@/lib/constants'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

interface LanguageSelectorProps {
  selectedLanguage: LanguageKey
  onLanguageChange: (language: LanguageKey) => void
  className?: string
}

export default function LanguageSelector({ 
  selectedLanguage, 
  onLanguageChange, 
  className = '' 
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedLang = LANGUAGES[selectedLanguage]

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between min-w-[180px] group"
      >
        <div className="flex items-center gap-2">
          <span 
            className="w-5 h-5 flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: selectedLang.icon }}
          />
          <span className="font-medium">{selectedLang.name}</span>
          <Badge variant="secondary" className="text-xs">
            .{selectedLang.extension}
          </Badge>
        </div>
        <ChevronDownIcon 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)} 
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 z-20 bg-card border rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-2">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                  <CommandLineIcon className="w-4 h-4" />
                  Select Language
                </div>
                
                <div className="space-y-1">
                  {Object.entries(LANGUAGES).map(([key, lang]) => (
                    <motion.button
                      key={key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15, delay: 0.02 * Object.keys(LANGUAGES).indexOf(key) }}
                      onClick={() => {
                        onLanguageChange(key as LanguageKey)
                        setIsOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors hover:bg-accent ${
                        selectedLanguage === key ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      <span 
                        className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                        dangerouslySetInnerHTML={{ __html: lang.icon }}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{lang.name}</div>
                        <div className="text-xs text-muted-foreground">
                          .{lang.extension} files
                        </div>
                      </div>
                      {selectedLanguage === key && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="border-t mt-2 pt-2">
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    💡 More languages coming soon with Pro subscription
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}