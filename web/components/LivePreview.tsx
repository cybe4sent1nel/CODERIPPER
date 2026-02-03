'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ArrowPathIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
  CodeBracketIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { transform } from '@babel/standalone';
import { analyzeReactDependencies, analyzeVueDependencies, generateInstallInstructions } from '@/lib/dependencyChecker';

// Strip ES module syntax and common React imports so inline scripts can run in the iframe
const sanitizeReactLikeCode = (source: string) => {
  let output = source
    .replace(/import\s+React[^;]*;?/gi, '')
    .replace(/import\s+ReactDOM[^;]*;?/gi, '')
    .replace(/import\s+{[^}]*}\s+from\s+['"]react['"];?/gi, '')
    .replace(/import\s+{[^}]*}\s+from\s+['"]react-dom['"];?/gi, '')
    .replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/g, 'function $1')
    .replace(/export\s+default\s+class\s+([A-Za-z0-9_]+)/g, 'class $1')
    .replace(/export\s+default\s+\(/g, 'const App = (')
    .replace(/export\s+default\s*\{/g, 'const App = {')
    .replace(/export\s+default\s+([A-Za-z0-9_]+)/g, (match, name) => {
      // If exporting a name that's already "App", just remove the export
      return name === 'App' ? '' : `const App = ${name}`;
    })
    .replace(/export\s+\{[^}]*\};?/g, '');
  return output;
};

// Replace Vue imports with globals and drop everything else to avoid module errors
const normalizeVueScript = (source: string) => {
  let scriptContent = source
    .replace(/import\s+{\s*([^}]*)\s*}\s+from\s+['"]vue['"];?/gi, 'const {$1} = Vue;')
    .replace(/import\s+[^;]+;?/g, '');
  return scriptContent;
};

interface LivePreviewProps {
  code: string;
  language: string;
  isVisible?: boolean;
  onToggle?: () => void;
}

export default function LivePreview({ code, language, isVisible = true, onToggle }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [showDependencies, setShowDependencies] = useState(false);
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [installInstructions, setInstallInstructions] = useState<string>('');

  useEffect(() => {
    if (!isVisible || !iframeRef.current) return;

    try {
      setError(null);
      let content = '';
      
      // Analyze dependencies for React/Vue
      if (language === 'react') {
        const analysis = analyzeReactDependencies(code);
        if (analysis.dependencies.length > 0) {
          setDependencies(analysis.suggestions);
          setInstallInstructions(generateInstallInstructions(analysis.dependencies));
        } else {
          setDependencies([]);
          setInstallInstructions('');
        }
      } else if (language === 'vue') {
        const analysis = analyzeVueDependencies(code);
        if (analysis.dependencies.length > 0) {
          setDependencies(analysis.suggestions);
          setInstallInstructions(generateInstallInstructions(analysis.dependencies));
        } else {
          setDependencies([]);
          setInstallInstructions('');
        }
      } else {
        setDependencies([]);
        setInstallInstructions('');
      }

      switch (language) {
        case 'html':
          content = code;
          break;

        case 'css':
          content = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>${code}</style>
            </head>
            <body>
              <div class="card">
                <h1>CSS Preview</h1>
                <p>Your styles are applied to this preview!</p>
                <button class="button">Styled Button</button>
              </div>
            </body>
            </html>
          `;
          break;

        case 'react':
          // Transform JSX to JavaScript
          try {
            const cleanedCode = sanitizeReactLikeCode(code);
            const transformed = transform(cleanedCode, {
              presets: ['react'],
              filename: 'component.jsx'
            }).code;

            content = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
                <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                <style>
                  * { box-sizing: border-box; }
                  body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; }
                </style>
              </head>
              <body>
                <div id="root"></div>
                <script>
                  const { useState, useEffect, useCallback, useMemo, useRef, useReducer, useContext, createContext } = React;
                  try {
                    ${transformed}
                    
                    // Handle both default export and named component
                    const AppComponent = typeof App !== 'undefined' ? App : (typeof component !== 'undefined' ? component : (typeof Component !== 'undefined' ? Component : null));
                    
                    if (AppComponent) {
                      const root = ReactDOM.createRoot(document.getElementById('root'));
                      root.render(React.createElement(AppComponent));
                    } else {
                      throw new Error('No component found. Make sure to export a component named "App" or define a function component.');
                    }
                  } catch (error) {
                    document.body.innerHTML = '<div style="padding: 20px; color: #e53e3e; font-family: monospace; background: #fff5f5; border-left: 4px solid #e53e3e; margin: 20px;"><h3 style="margin-top: 0;">⚠️ React Error</h3><pre style="white-space: pre-wrap; word-wrap: break-word;">' + error.message + '</pre></div>';
                    console.error('React Preview Error:', error);
                  }
                </script>
              </body>
              </html>
            `;
          } catch (transformError: any) {
            setError(`JSX Transform Error: ${transformError.message}`);
            return;
          }
          break;

        case 'typescript':
          // Transform TypeScript to JavaScript
          try {
            const sanitizedTs = sanitizeReactLikeCode(code);
            const transformed = transform(sanitizedTs, {
              presets: ['typescript'],
              filename: 'code.ts'
            }).code;

            content = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  * { box-sizing: border-box; }
                  body { margin: 0; padding: 20px; font-family: 'Courier New', monospace; background: #1e1e1e; color: #d4d4d4; }
                  pre { background: #2d2d2d; padding: 15px; border-radius: 8px; overflow-x: auto; }
                  .output { background: #252526; padding: 20px; border-radius: 8px; margin-top: 10px; }
                  .success { color: #4ec9b0; }
                  .error { color: #f48771; }
                </style>
              </head>
              <body>
                <div class="output" id="output"></div>
                <script>
                  const output = document.getElementById('output');
                  const originalLog = console.log;
                  const originalError = console.error;
                  const originalWarn = console.warn;
                  
                  // Intercept console methods
                  console.log = (...args) => {
                    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
                    output.innerHTML += '<div class="success">▸ ' + message + '</div>';
                    originalLog.apply(console, args);
                  };
                  
                  console.error = (...args) => {
                    const message = args.map(arg => String(arg)).join(' ');
                    output.innerHTML += '<div class="error">✖ Error: ' + message + '</div>';
                    originalError.apply(console, args);
                  };
                  
                  console.warn = (...args) => {
                    const message = args.map(arg => String(arg)).join(' ');
                    output.innerHTML += '<div style="color: #dcdcaa;">⚠ ' + message + '</div>';
                    originalWarn.apply(console, args);
                  };
                  
                  try {
                    ${transformed}
                    if (output.innerHTML === '') {
                      output.innerHTML = '<div class="success">✓ Code executed successfully (no console output)</div>';
                    }
                  } catch (error) {
                    output.innerHTML = '<div class="error">✖ Runtime Error: ' + error.message + '</div>';
                    console.error(error);
                  }
                </script>
              </body>
              </html>
            `;
          } catch (transformError: any) {
            setError(`TypeScript Transform Error: ${transformError.message}`);
            return;
          }
          break;

        case 'vue':
          content = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
              <style>
                * { box-sizing: border-box; }
                body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; }
              </style>
            </head>
            <body>
              <div id="app"></div>
              <script>
                try {
                  const { createApp, ref, reactive, computed, watch, onMounted, onUnmounted } = Vue;
                  
                  // Vue component code (escape closing script to avoid breaking the host script)
                  const vueCode = ${JSON.stringify(code).replace(/<\/script>/g, '<\\/script>')};
                  
                  // Parse Vue SFC using string concatenation to avoid HTML conflicts
                  const lt = '<';
                  const gt = '>';
                  const slash = '/';
                  const templateMatch = vueCode.match(new RegExp(lt + 'template' + gt + '([\\\\s\\\\S]*?)' + lt + slash + 'template' + gt));
                  const scriptMatch = vueCode.match(new RegExp(lt + 'script(?![^>]*setup)[^' + gt + ']*' + gt + '([\\\\s\\\\S]*?)' + lt + slash + 'script' + gt));
                  const scriptSetupMatch = vueCode.match(new RegExp(lt + 'script[^' + gt + ']*setup[^' + gt + ']*' + gt + '([\\\\s\\\\S]*?)' + lt + slash + 'script' + gt));
                  const styleMatch = vueCode.match(new RegExp(lt + 'style[^' + gt + ']*' + gt + '([\\\\s\\\\S]*?)' + lt + slash + 'style' + gt));
                  const templateContent = templateMatch ? templateMatch[1].trim() : '';
                  
                  if (styleMatch) {
                    const style = document.createElement('style');
                    style.textContent = styleMatch[1];
                    document.head.appendChild(style);
                  }
                  
                  let component = null;
                  
                  if (scriptSetupMatch) {
                    // Handle <script setup>
                    let setupContent = scriptSetupMatch[1].trim();
                    setupContent = setupContent.replace(/import\\s+{\\s*([^}]*)\\s*}\\s+from\\s+['"]vue['"];?/gi, 'const {$1} = Vue;');
                    setupContent = setupContent.replace(/import\\s+[^;]+;?/g, '');
                    
                    const exposed = [];
                    setupContent.replace(/(?:const|let|var|function)\\s+([A-Za-z_][\\w]*)/g, (m, name) => {
                      if (!['ref','reactive','computed','watch','onMounted','onUnmounted'].includes(name)) {
                        exposed.push(name);
                      }
                      return '';
                    });
                    const uniqueExposed = Array.from(new Set(exposed));
                    const returnBlock = uniqueExposed.length ? \`return { \${uniqueExposed.join(', ')} };\` : 'return {};';
                    const setupWrapper = \`component = { setup() { \${setupContent}\\n\${returnBlock}; } };\`;
                    eval(setupWrapper);

                    if (component && typeof component === 'object') {
                      if (templateContent) component.template = templateContent;
                      createApp(component).mount('#app');
                    } else {
                      throw new Error('Component not properly defined in <script setup>.');
                    }
                  } else if (scriptMatch) {
                    // Support standard <script> with export default
                    let componentCode = scriptMatch[1].trim();
                    componentCode = componentCode.replace(/import\\s+{\\s*([^}]*)\\s*}\\s+from\\s+['"]vue['"];?/gi, 'const {$1} = Vue;');
                    componentCode = componentCode.replace(/import\\s+[^;]+;?/g, '');
                    componentCode = componentCode.replace(/export\\s+default\\s+/g, 'component = ');
                    eval(componentCode);
                    
                    if (component && typeof component === 'object') {
                      if (templateContent) component.template = templateContent;
                      createApp(component).mount('#app');
                    } else {
                      throw new Error('Component not properly defined. Make sure to use "export default { ... }" in the script section.');
                    }
                  } else if (templateMatch) {
                    // Template-only Vue
                    createApp({
                      template: templateContent,
                      data() {
                        return {}
                      }
                    }).mount('#app');
                  } else {
                    throw new Error('Invalid Vue SFC format. Make sure you have at least a <template> section.');
                  }
                } catch (error) {
                  document.body.innerHTML = '<div style="padding: 20px; color: #e53e3e; font-family: monospace; background: #fff5f5; border-left: 4px solid #e53e3e; margin: 20px;"><h3 style="margin-top: 0;">⚠️ Vue Error</h3><pre style="white-space: pre-wrap; word-wrap: break-word;">' + error.message + '</pre><p style="margin-top: 15px; color: #666;">Tip: Make sure your Vue component has proper &lt;template&gt; and &lt;script&gt; sections.</p></div>';
                  console.error('Vue Preview Error:', error);
                }
              </script>
            </body>
            </html>
          `;
          break;

        case 'svg':
          content = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  background: #1a1a2e;
                }
              </style>
            </head>
            <body>
              ${code}
            </body>
            </html>
          `;
          break;

        default:
          return;
      }

      // Write content to iframe
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(content);
        iframeDoc.close();
      }

      setLastUpdate(Date.now());
    } catch (err: any) {
      setError(err.message);
    }
  }, [code, language, isVisible]);

  const handleRefresh = () => {
    setLastUpdate(Date.now());
    // Force re-render
    if (iframeRef.current) {
      const src = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = src;
        }
      }, 10);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className={`${isFullscreen ? '' : 'border-t border-border'} bg-background`}
      >
        {/* Preview Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
          <div className="flex items-center gap-2">
            <EyeIcon className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold">Live Preview</span>
            <span className="text-xs text-muted-foreground">
              {language.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              title="Refresh Preview"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              title="Toggle Fullscreen"
            >
              <ArrowsPointingOutIcon className="w-4 h-4" />
            </button>

            {onToggle && (
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                title="Hide Preview"
              >
                <EyeSlashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dependencies Panel */}
        <AnimatePresence>
          {showDependencies && dependencies.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-border overflow-hidden"
            >
              <div className="px-4 py-3 bg-amber-50 dark:bg-amber-950/20">
                <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                  <InformationCircleIcon className="w-4 h-4" />
                  External Dependencies Detected
                </h4>
                <div className="space-y-1 text-xs text-amber-800 dark:text-amber-200">
                  {dependencies.map((dep, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="mt-0.5">{dep.startsWith('📦') || dep.startsWith('💡') || dep.startsWith('✅') || dep.startsWith('⚠️') ? '' : '•'}</span>
                      <span className="flex-1">{dep}</span>
                    </div>
                  ))}
                </div>
                {installInstructions && (
                  <details className="mt-3">
                    <summary className="text-xs font-medium text-amber-900 dark:text-amber-100 cursor-pointer hover:underline">
                      Show Installation Instructions
                    </summary>
                    <pre className="mt-2 p-2 bg-amber-100 dark:bg-amber-900/30 rounded text-xs overflow-x-auto">
                      {installInstructions}
                    </pre>
                  </details>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-500/10 border-b border-red-500/20">
            <div className="flex items-start gap-2">
              <XMarkIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-500">Preview Error</p>
                <pre className="text-xs text-red-400 mt-1 font-mono">{error}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Preview Content */}
        <div className={isFullscreen ? '' : 'h-[400px]'}>
          <iframe
            ref={iframeRef}
            className="w-full h-full bg-white"
            sandbox="allow-scripts allow-same-origin"
            title="Live Preview"
          />
        </div>
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm"
            onClick={toggleFullscreen}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="absolute inset-4 bg-background rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fullscreen Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                <div className="flex items-center gap-3">
                  <CodeBracketIcon className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Live Preview - Fullscreen</h3>
                    <p className="text-xs text-muted-foreground">{language.toUpperCase()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefresh}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Fullscreen Content */}
              {error && (
                <div className="p-6 bg-red-500/10 border-b border-red-500/20">
                  <div className="flex items-start gap-3">
                    <XMarkIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-base font-semibold text-red-500">Preview Error</p>
                      <pre className="text-sm text-red-400 mt-2 font-mono">{error}</pre>
                    </div>
                  </div>
                </div>
              )}

              <iframe
                ref={iframeRef}
                className="w-full h-[calc(100%-64px)] bg-white"
                sandbox="allow-scripts allow-same-origin"
                title="Live Preview Fullscreen"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
