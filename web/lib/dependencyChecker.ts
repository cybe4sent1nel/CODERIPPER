/**
 * Dependency Checker for React and Vue Components
 * Analyzes code to detect required npm packages and checks if they're installed
 */

export interface DependencyInfo {
  package: string
  version: string
  required: boolean
  installed: boolean
  cdnUrl?: string
}

export interface DependencyCheckResult {
  dependencies: DependencyInfo[]
  missingCount: number
  hasErrors: boolean
  suggestions: string[]
}

// Common React dependencies patterns
const REACT_PATTERNS = [
  { pattern: /import\s+.*\s+from\s+['"]react-router(-dom)?['"]/g, package: 'react-router-dom', version: '^6.20.0' },
  { pattern: /import\s+.*\s+from\s+['"]react-hook-form['"]/g, package: 'react-hook-form', version: '^7.49.0' },
  { pattern: /import\s+.*\s+from\s+['"]@tanstack\/react-query['"]/g, package: '@tanstack/react-query', version: '^5.17.0' },
  { pattern: /import\s+.*\s+from\s+['"]axios['"]/g, package: 'axios', version: '^1.6.5' },
  { pattern: /import\s+.*\s+from\s+['"]zustand['"]/g, package: 'zustand', version: '^4.4.7' },
  { pattern: /import\s+.*\s+from\s+['"]jotai['"]/g, package: 'jotai', version: '^2.6.2' },
  { pattern: /import\s+.*\s+from\s+['"]recoil['"]/g, package: 'recoil', version: '^0.7.7' },
  { pattern: /import\s+.*\s+from\s+['"]framer-motion['"]/g, package: 'framer-motion', version: '^10.18.0', cdnUrl: 'https://cdn.jsdelivr.net/npm/framer-motion@10/dist/framer-motion.js' },
  { pattern: /import\s+.*\s+from\s+['"]@headlessui\/react['"]/g, package: '@headlessui/react', version: '^1.7.17' },
  { pattern: /import\s+.*\s+from\s+['"]@radix-ui\/react-/g, package: '@radix-ui/react-*', version: 'latest' },
  { pattern: /import\s+.*\s+from\s+['"]date-fns['"]/g, package: 'date-fns', version: '^3.0.6' },
  { pattern: /import\s+.*\s+from\s+['"]lodash['"]/g, package: 'lodash', version: '^4.17.21', cdnUrl: 'https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js' },
  { pattern: /import\s+.*\s+from\s+['"]clsx['"]/g, package: 'clsx', version: '^2.1.0' },
  { pattern: /import\s+.*\s+from\s+['"]classnames['"]/g, package: 'classnames', version: '^2.5.1' },
  { pattern: /import\s+.*\s+from\s+['"]react-icons/g, package: 'react-icons', version: '^5.0.1', cdnUrl: 'https://cdn.jsdelivr.net/npm/react-icons@5/index.esm.js' },
]

// Common Vue dependencies patterns
const VUE_PATTERNS = [
  { pattern: /import\s+.*\s+from\s+['"]vue-router['"]/g, package: 'vue-router', version: '^4.2.5' },
  { pattern: /import\s+.*\s+from\s+['"]pinia['"]/g, package: 'pinia', version: '^2.1.7' },
  { pattern: /import\s+.*\s+from\s+['"]vuex['"]/g, package: 'vuex', version: '^4.1.0' },
  { pattern: /import\s+.*\s+from\s+['"]@vueuse\/core['"]/g, package: '@vueuse/core', version: '^10.7.1', cdnUrl: 'https://cdn.jsdelivr.net/npm/@vueuse/core/index.mjs' },
  { pattern: /import\s+.*\s+from\s+['"]axios['"]/g, package: 'axios', version: '^1.6.5', cdnUrl: 'https://cdn.jsdelivr.net/npm/axios@1/dist/axios.min.js' },
  { pattern: /import\s+.*\s+from\s+['"]element-plus['"]/g, package: 'element-plus', version: '^2.4.4', cdnUrl: 'https://cdn.jsdelivr.net/npm/element-plus' },
  { pattern: /import\s+.*\s+from\s+['"]vuetify['"]/g, package: 'vuetify', version: '^3.4.10' },
  { pattern: /import\s+.*\s+from\s+['"]@headlessui\/vue['"]/g, package: '@headlessui/vue', version: '^1.7.17' },
]

// CDN URLs for common packages
const CDN_URLS: Record<string, string> = {
  'react': 'https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js',
  'react-dom': 'https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js',
  'vue': 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js',
  'axios': 'https://cdn.jsdelivr.net/npm/axios@1/dist/axios.min.js',
  'lodash': 'https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js',
  'moment': 'https://cdn.jsdelivr.net/npm/moment@2/moment.min.js',
  'chart.js': 'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js',
  'd3': 'https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js',
}

/**
 * Analyze React code for dependencies
 */
export function analyzeReactDependencies(code: string): DependencyCheckResult {
  const dependencies: DependencyInfo[] = []
  const foundPackages = new Set<string>()

  // Check for React patterns
  REACT_PATTERNS.forEach(({ pattern, package: pkg, version, cdnUrl }) => {
    if (pattern.test(code) && !foundPackages.has(pkg)) {
      foundPackages.add(pkg)
      dependencies.push({
        package: pkg,
        version,
        required: true,
        installed: false, // In browser context, we use CDN
        cdnUrl: cdnUrl || CDN_URLS[pkg]
      })
    }
  })

  const suggestions: string[] = []
  
  if (dependencies.length > 0) {
    suggestions.push(`📦 Detected ${dependencies.length} external dependencies`)
    suggestions.push('💡 In CodeRipper, we auto-load popular packages via CDN')
    
    const withCdn = dependencies.filter(d => d.cdnUrl)
    const withoutCdn = dependencies.filter(d => !d.cdnUrl)
    
    if (withCdn.length > 0) {
      suggestions.push(`✅ ${withCdn.length} packages available via CDN (auto-loaded)`)
    }
    
    if (withoutCdn.length > 0) {
      suggestions.push(`⚠️ ${withoutCdn.length} packages may not work without npm install:`)
      withoutCdn.forEach(d => {
        suggestions.push(`   - ${d.package}@${d.version}`)
      })
    }
  }

  return {
    dependencies,
    missingCount: dependencies.filter(d => !d.cdnUrl).length,
    hasErrors: dependencies.some(d => !d.cdnUrl),
    suggestions
  }
}

/**
 * Analyze Vue code for dependencies
 */
export function analyzeVueDependencies(code: string): DependencyCheckResult {
  const dependencies: DependencyInfo[] = []
  const foundPackages = new Set<string>()

  // Check for Vue patterns
  VUE_PATTERNS.forEach(({ pattern, package: pkg, version, cdnUrl }) => {
    if (pattern.test(code) && !foundPackages.has(pkg)) {
      foundPackages.add(pkg)
      dependencies.push({
        package: pkg,
        version,
        required: true,
        installed: false,
        cdnUrl: cdnUrl || CDN_URLS[pkg]
      })
    }
  })

  const suggestions: string[] = []
  
  if (dependencies.length > 0) {
    suggestions.push(`📦 Detected ${dependencies.length} external dependencies`)
    suggestions.push('💡 In CodeRipper, we auto-load popular packages via CDN')
    
    const withCdn = dependencies.filter(d => d.cdnUrl)
    const withoutCdn = dependencies.filter(d => !d.cdnUrl)
    
    if (withCdn.length > 0) {
      suggestions.push(`✅ ${withCdn.length} packages available via CDN (auto-loaded)`)
    }
    
    if (withoutCdn.length > 0) {
      suggestions.push(`⚠️ ${withoutCdn.length} packages may not work without npm install:`)
      withoutCdn.forEach(d => {
        suggestions.push(`   - ${d.package}@${d.version}`)
      })
    }
  }

  return {
    dependencies,
    missingCount: dependencies.filter(d => !d.cdnUrl).length,
    hasErrors: dependencies.some(d => !d.cdnUrl),
    suggestions
  }
}

/**
 * Check package availability using npms.io API (free, no auth required)
 */
export async function checkPackageExists(packageName: string): Promise<{
  exists: boolean
  version?: string
  description?: string
  downloads?: number
}> {
  try {
    const response = await fetch(`https://api.npms.io/v2/package/${encodeURIComponent(packageName)}`)
    
    if (!response.ok) {
      return { exists: false }
    }

    const data = await response.json()
    
    return {
      exists: true,
      version: data.collected?.metadata?.version,
      description: data.collected?.metadata?.description,
      downloads: data.collected?.npm?.downloads?.[0]?.count
    }
  } catch (error) {
    console.error('Error checking package:', error)
    return { exists: false }
  }
}

/**
 * Search for packages using npms.io API
 */
export async function searchPackages(query: string, size = 10): Promise<Array<{
  package: string
  version: string
  description: string
  score: number
}>> {
  try {
    const response = await fetch(
      `https://api.npms.io/v2/search?q=${encodeURIComponent(query)}&size=${size}`
    )
    
    if (!response.ok) {
      return []
    }

    const data = await response.json()
    
    return data.results?.map((result: any) => ({
      package: result.package.name,
      version: result.package.version,
      description: result.package.description,
      score: result.score.final
    })) || []
  } catch (error) {
    console.error('Error searching packages:', error)
    return []
  }
}

/**
 * Get CDN URL for a package (using jsdelivr)
 */
export function getCdnUrl(packageName: string, version: string = 'latest', file?: string): string {
  const baseUrl = `https://cdn.jsdelivr.net/npm/${packageName}@${version}`
  
  if (file) {
    return `${baseUrl}/${file}`
  }
  
  // Common entry points
  const commonFiles = [
    '/dist/index.min.js',
    '/dist/index.js',
    '/index.min.js',
    '/index.js',
    '/umd/index.min.js',
    '/umd/index.js'
  ]
  
  return `${baseUrl}${commonFiles[0]}`
}

/**
 * Generate installation instructions
 */
export function generateInstallInstructions(dependencies: DependencyInfo[]): string {
  if (dependencies.length === 0) {
    return 'No external dependencies detected! ✅'
  }

  const lines: string[] = [
    '📦 Installation Instructions:',
    '',
    '# Using npm:',
    `npm install ${dependencies.map(d => `${d.package}@${d.version}`).join(' ')}`,
    '',
    '# Using yarn:',
    `yarn add ${dependencies.map(d => `${d.package}@${d.version}`).join(' ')}`,
    '',
    '# Using pnpm:',
    `pnpm add ${dependencies.map(d => `${d.package}@${d.version}`).join(' ')}`,
  ]

  const withCdn = dependencies.filter(d => d.cdnUrl)
  if (withCdn.length > 0) {
    lines.push('')
    lines.push('🌐 CDN URLs (for browser):')
    withCdn.forEach(d => {
      lines.push(`<!-- ${d.package} -->`)
      lines.push(`<script src="${d.cdnUrl}"></script>`)
    })
  }

  return lines.join('\n')
}
