'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MicrophoneIcon,
  StopIcon,
  SparklesIcon,
  XMarkIcon,
  CheckIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';
import { Button } from './ui/Button';
import toast from 'react-hot-toast';
import axios from 'axios';

interface VoiceCodingProps {
  onCodeGenerated: (code: string, language: string) => void;
  currentLanguage?: string;
}

export default function VoiceCoding({ onCodeGenerated, currentLanguage = 'javascript' }: VoiceCodingProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        if (final) {
          setTranscript(prev => prev + final);
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          toast.error('No speech detected. Please try again.');
        } else if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please allow microphone access.');
        } else {
          toast.error(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const startListening = () => {
    if (!isSupported) {
      toast.error('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    setTranscript('');
    setInterimTranscript('');
    setIsListening(true);
    setShowModal(true);
    
    try {
      recognitionRef.current?.start();
      toast.success('🎤 Listening... Speak your code requirements');
    } catch (error) {
      console.error('Error starting recognition:', error);
      toast.error('Failed to start speech recognition');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current?.stop();
    setInterimTranscript('');
  };

  const generateCode = async () => {
    if (!transcript.trim()) {
      toast.error('Please speak your requirements first');
      return;
    }

    setIsProcessing(true);
    stopListening();

    try {
      const response = await axios.post('/api/ai-generate-code', {
        prompt: transcript,
        language: selectedLanguage
      });

      const generatedCode = response.data.code;
      onCodeGenerated(generatedCode, selectedLanguage);
      
      toast.success('✨ Code generated successfully!');
      setShowModal(false);
      setTranscript('');
    } catch (error: any) {
      console.error('Error generating code:', error);
      toast.error(error.response?.data?.error || 'Failed to generate code. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    stopListening();
    setShowModal(false);
    setTranscript('');
    setInterimTranscript('');
  };

  return (
    <>
      {/* Voice Coding Trigger Button */}
      <Button
        onClick={startListening}
        variant="outline"
        size="sm"
        className="group relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-blue-500/20"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5 }}
        />
        <MicrophoneIcon className="w-4 h-4 mr-2" />
        Voice Coding
        <SparklesIcon className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
      </Button>

      {/* Voice Coding Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-background rounded-2xl shadow-2xl border border-border overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-violet-500/10 to-blue-500/10 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                      <MicrophoneIcon className="w-6 h-6 text-violet-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Voice Coding Assistant</h3>
                      <p className="text-sm text-muted-foreground">
                        Speak naturally and AI will generate code for you
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Language Selector */}
                <div className="flex items-center gap-3">
                  <LanguageIcon className="w-5 h-5 text-muted-foreground" />
                  <label className="text-sm font-medium">Target Language:</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="typescript">TypeScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="react">React</option>
                  </select>
                </div>

                {/* Transcript Display */}
                <div className="min-h-[200px] p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">YOUR SPEECH:</p>
                  <div className="space-y-2">
                    {transcript && (
                      <p className="text-foreground">{transcript}</p>
                    )}
                    {interimTranscript && (
                      <p className="text-muted-foreground italic">{interimTranscript}</p>
                    )}
                    {!transcript && !interimTranscript && (
                      <p className="text-muted-foreground text-center py-12">
                        {isListening ? 'Listening... Start speaking' : 'Click "Start Listening" to begin'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Indicator */}
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-violet-500"
                  >
                    <motion.div
                      className="w-3 h-3 rounded-full bg-violet-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-sm font-medium">Listening...</span>
                  </motion.div>
                )}

                {/* Example Prompts */}
                {!transcript && !isListening && (
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm font-semibold text-blue-500 mb-2">💡 Example Prompts:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• "Create a function to calculate fibonacci numbers"</li>
                      <li>• "Build a React component with a counter and two buttons"</li>
                      <li>• "Write a Python script to read a CSV file and sort it"</li>
                      <li>• "Generate an HTML form with email validation"</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {isSupported ? (
                    <span className="flex items-center gap-1">
                      <CheckIcon className="w-4 h-4 text-green-500" />
                      Speech recognition supported
                    </span>
                  ) : (
                    <span className="text-red-500">Speech recognition not supported in this browser</span>
                  )}
                </div>

                <div className="flex gap-2">
                  {!isListening ? (
                    <Button
                      onClick={startListening}
                      variant="outline"
                      disabled={!isSupported}
                    >
                      <MicrophoneIcon className="w-4 h-4 mr-2" />
                      Start Listening
                    </Button>
                  ) : (
                    <Button
                      onClick={stopListening}
                      variant="outline"
                      className="bg-red-500/10 hover:bg-red-500/20 border-red-500/30"
                    >
                      <StopIcon className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  )}

                  <Button
                    onClick={generateCode}
                    disabled={!transcript.trim() || isProcessing}
                    className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600"
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Generating...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        Generate Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
