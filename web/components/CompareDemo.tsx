"use client";

import React, { useState } from "react";
import { CodeComparison } from "@/components/CodeComparison";
import { Compare } from "@/components/ui/compare";

export function CompareDemo() {
  const [showFullComparison, setShowFullComparison] = useState(false);
  
  const originalCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`;

  const enhancedCode = `/**
 * Calculates the Fibonacci number at position n using memoization
 * Time Complexity: O(n), Space Complexity: O(n)
 * @param {number} n - The position in the Fibonacci sequence
 * @param {Map<number, number>} memo - Memoization cache
 * @returns {number} The Fibonacci number at position n
 */
function fibonacci(n, memo = new Map()) {
  // Base cases
  if (n <= 1) return n;
  
  // Check if already computed
  if (memo.has(n)) {
    return memo.get(n);
  }
  
  // Compute and store in memo
  const result = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  memo.set(n, result);
  
  return result;
}

// Example usage with performance timing
console.time('Fibonacci calculation');
const result = fibonacci(40);
console.timeEnd('Fibonacci calculation');
console.log(\`Fibonacci(40) = \${result}\`);

// Export for use in other modules
export { fibonacci };`;

  return (
    <div className="w-full space-y-8">
      {/* Inline Preview */}
      <div className="w-3/4 h-[60vh] px-1 md:px-8 flex items-center justify-center [perspective:800px] [transform-style:preserve-3d]">
        <div
          style={{
            transform: "rotateX(15deg) translateZ(80px)",
          }}
          className="p-1 md:p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 mx-auto w-3/4 h-1/2 md:h-3/4"
        >
          <Compare
            firstCode={originalCode}
            secondCode={enhancedCode}
            firstLabel="Original Code"
            secondLabel="AI Enhanced Code"
            className="w-full h-full rounded-[22px] md:rounded-lg"
            slideMode="hover"
            autoplay={true}
            language="javascript"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setShowFullComparison(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          View Full Comparison
        </button>
      </div>

      {/* Full Comparison Modal */}
      <CodeComparison
        isVisible={showFullComparison}
        onClose={() => setShowFullComparison(false)}
        originalCode={originalCode}
        enhancedCode={enhancedCode}
        language="javascript"
      />
    </div>
  );
}