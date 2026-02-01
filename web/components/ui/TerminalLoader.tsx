"use client";

import React, { useState, useEffect } from 'react';

interface TerminalLoaderProps {
  isVisible?: boolean;
  text?: string;
  animationType?: 'typing' | 'dots' | 'static';
  texts?: string[];
}

const TerminalLoader: React.FC<TerminalLoaderProps> = ({ 
  isVisible = true, 
  text = "Loading...",
  animationType = 'typing',
  texts = []
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (texts.length > 0 && animationType === 'typing') {
      const interval = setInterval(() => {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [texts, animationType]);

  useEffect(() => {
    if (texts.length > 0) {
      setDisplayText(texts[currentTextIndex]);
    }
  }, [currentTextIndex, texts]);

  if (!isVisible) return null;

  const getAnimationClass = () => {
    switch (animationType) {
      case 'dots':
        return 'terminal-text-dots';
      case 'static':
        return 'terminal-text-static';
      default:
        return 'terminal-text';
    }
  };

  return (
    <div className="terminal-loader">
      <div className="terminal-header">
        <div className="terminal-title">Status</div>
        <div className="terminal-controls">
          <div className="control close"></div>
          <div className="control minimize"></div>
          <div className="control maximize"></div>
        </div>
      </div>
      <div className={getAnimationClass()}>{displayText}</div>

      <style jsx>{`
        @keyframes blinkCursor {
          50% {
            border-right-color: transparent;
          }
        }

        @keyframes typeAndDelete {
          0%, 10% {
            width: 0;
          }
          45%, 55% {
            width: 6.2em;
          }
          90%, 100% {
            width: 0;
          }
        }

        @keyframes dotPulse {
          0%, 20% { opacity: 0; }
          40% { opacity: 1; }
          100% { opacity: 0; }
        }

        .terminal-loader {
          border: 0.1rem solid #333;
          background-color: #1a1a1a;
          color: #0f0;
          font-family: "Courier New", Courier, monospace;
          font-size: 1rem;
          padding: 1.5rem 1rem;
          width: 12rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          margin: 0 auto;
        }

        .terminal-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1.5rem;
          background-color: #333;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          padding: 0 0.4rem;
          box-sizing: border-box;
        }

        .terminal-controls {
          float: right;
          padding-top: 0.45rem;
        }

        .control {
          display: inline-block;
          width: 0.6rem;
          height: 0.6rem;
          margin-left: 0.4rem;
          border-radius: 50%;
          background-color: #777;
        }

        .control.close {
          background-color: #e33;
        }

        .control.minimize {
          background-color: #ee0;
        }

        .control.maximize {
          background-color: #0b0;
        }

        .terminal-title {
          float: left;
          line-height: 1.5rem;
          color: #eee;
          font-size: 0.8rem;
        }

        .terminal-text {
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          border-right: 0.2rem solid #0f0;
          animation: typeAndDelete 4s steps(11) infinite,
                     blinkCursor 0.5s step-end infinite alternate;
          margin-top: 1.5rem;
        }

        .terminal-text-dots::after {
          content: '';
          animation: dotPulse 1.5s infinite;
        }

        .terminal-text-dots {
          margin-top: 1.5rem;
          border-right: 0.2rem solid #0f0;
          animation: blinkCursor 0.5s step-end infinite alternate;
        }

        .terminal-text-static {
          margin-top: 1.5rem;
          border-right: 0.2rem solid #0f0;
          animation: blinkCursor 0.5s step-end infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default TerminalLoader;