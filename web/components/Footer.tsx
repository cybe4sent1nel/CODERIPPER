'use client';

import { motion } from 'framer-motion';
import { Heart, Github, Linkedin, Code2, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="w-full border-t border-border bg-background/50 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg shadow-violet-500/20">
              <Image 
                src="/logo.png" 
                alt="CodeRipper Logo" 
                width={32} 
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
              CodeRipper
            </span>
          </div>

          {/* Developer Attribution */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Crafted with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </motion.div>
            <span>by</span>
            <motion.a
              href="https://github.com/fahadkhan"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-violet-500 transition-colors flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Fahad Khan
            </motion.a>
          </div>

          {/* Links & Copyright */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <motion.a
                href="https://github.com/fahadkhan"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/fahad-cybersecurity-ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-xs text-muted-foreground">
              © {currentYear} CodeRipper. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
