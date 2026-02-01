import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'

export default function Topbar({ setTheme, theme }: any) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">CR</div>
          <div className="font-semibold">Coderipper</div>
        </div>
        <div className="flex items-center gap-4">
          <button
            aria-label="toggle-theme"
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}
