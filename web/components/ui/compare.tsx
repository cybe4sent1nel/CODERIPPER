"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CompareProps {
  firstCode?: string;
  secondCode?: string;
  firstLabel?: string;
  secondLabel?: string;
  className?: string;
  slideMode?: "click" | "hover" | "drag";
  autoplay?: boolean;
  language?: string;
}

export const Compare = ({
  firstCode = "",
  secondCode = "",
  firstLabel = "Original Code",
  secondLabel = "AI Enhanced Code",
  className,
  slideMode = "hover",
  autoplay = false,
  language = "javascript"
}: CompareProps) => {
  const [sliderXPos, setSliderXPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(() => {
        if (sliderXPos >= 95) {
          setDirection(-1);
        } else if (sliderXPos <= 5) {
          setDirection(1);
        }
        setSliderXPos((prev) => prev + direction * 0.5);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [autoplay, sliderXPos, direction]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    if (slideMode === "hover" || isDragging) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSliderXPos(Math.min(Math.max(percentage, 0), 100));
    }
  };

  const handleMouseDown = () => {
    if (slideMode === "drag") {
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const formatCode = (code: string) => {
    if (!code) return null;
    
    return code.split('\n').map((line, index) => (
      <div key={index} className="whitespace-pre font-mono text-sm leading-relaxed">
        <span className="text-gray-500 select-none mr-4 inline-block w-8 text-right">{index + 1}</span>
        <span className="text-gray-800 dark:text-gray-200">{line || ' '}</span>
      </div>
    ));
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden rounded-lg", className)}
      style={{ cursor: slideMode === "drag" ? "grab" : "default" }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* First Code Panel (Original) */}
      <div className="absolute inset-0 w-full h-full">
        <div className="w-full h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{firstLabel}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{language}</span>
            </div>
          </div>
          <div className="p-4 h-full overflow-auto bg-white dark:bg-gray-900">
            {formatCode(firstCode)}
          </div>
        </div>
      </div>

      {/* Second Code Panel (Enhanced) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          clipPath: `polygon(${sliderXPos}% 0%, 100% 0%, 100% 100%, ${sliderXPos}% 100%)`,
        }}
      >
        <div className="w-full h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="bg-green-100 dark:bg-green-900 px-4 py-2 border-b border-green-200 dark:border-green-700 rounded-t-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700 dark:text-green-300">{secondLabel}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-600 dark:text-green-400 bg-green-200 dark:bg-green-800 px-2 py-1 rounded">AI Enhanced</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{language}</span>
              </div>
            </div>
          </div>
          <div className="p-4 h-full overflow-auto bg-white dark:bg-gray-900">
            {formatCode(secondCode)}
          </div>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-30 cursor-col-resize"
        style={{
          left: `${sliderXPos}%`,
          transform: "translateX(-50%)",
        }}
      >
        <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>

      {/* Slide Instructions */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
        {slideMode === "hover" && "Hover to compare"}
        {slideMode === "click" && "Click to compare"}
        {slideMode === "drag" && "Drag to compare"}
      </div>
    </div>
  );
};