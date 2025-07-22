"use client"

import { useState, useEffect, createContext, useContext } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Menu, X, History, FileText, Trash2 } from "lucide-react"
import { getReadingHistory, addToReadingHistory, removeFromReadingHistory, type ReadingHistoryItem } from "@/lib/cookies"

interface SidebarProps {
  children: React.ReactNode
}

// Create context for reading history
const ReadingHistoryContext = createContext<{
  addToHistory: (title: string, url?: string, text?: string) => void
} | null>(null)

// Custom hook to use reading history
export const useReadingHistory = () => {
  const context = useContext(ReadingHistoryContext)
  if (!context) {
    throw new Error('useReadingHistory must be used within a ReadingHistoryProvider')
  }
  return context
}

export function Sidebar({ children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>([])
  const pathname = usePathname()

  const toggleSidebar = () => setIsOpen(!isOpen)

  useEffect(() => {
    // Load reading history when component mounts
    const history = getReadingHistory()
    setReadingHistory(history)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // When a user starts reading something
  const handleAddToReadingHistory = (title: string, url?: string, text?: string) => {
    addToReadingHistory({ title, url, text })
    // Reload history from cookies to get the updated list
    setReadingHistory(getReadingHistory())
  }

  // Remove a single history item
  const handleRemoveHistoryItem = (id: string, event: React.MouseEvent) => {
    event.preventDefault() // Prevent navigation when clicking remove button
    removeFromReadingHistory(id)
    setReadingHistory(getReadingHistory())
  }

  return (
    <ReadingHistoryContext.Provider value={{ addToHistory: handleAddToReadingHistory }}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Fast Read</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <Link
                href="/"
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                  ${pathname === '/'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>

              {/* Reading History Section */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <History className="h-4 w-4" />
                    Reading History
                  </div>
                </div>

                {readingHistory.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-400">
                    No history yet
                  </div>
                ) : (
                  <div className="space-y-1">
                    {readingHistory.map((item) => (
                      <div
                        key={item.id}
                        className="group relative"
                      >
                        <Link
                          href={item.url || '/'}
                          onClick={() => {
                            if (item.text) {
                              sessionStorage.setItem('readingText', item.text)
                            }
                          }}
                          className="flex items-start gap-2 px-3 py-2 pr-8 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="truncate font-medium">{item.title}</div>
                            <div className="text-xs text-gray-400">
                              {formatDate(item.timestamp)}
                            </div>
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleRemoveHistoryItem(item.id, e)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Add Test History Button - For Testing */}
              <Button
                onClick={() => {
                  const testText = "This is a sample text for testing the speed reading functionality. It contains multiple words that will be displayed one at a time in the RSVP format."
                  handleAddToReadingHistory("Test Article", "/read", testText)
                }}
                className="w-full mt-2"
                variant="outline"
                size="sm"
              >
                Add Test History
              </Button>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200">
              <Link
                href="/whatisthis"
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-colors 
                  ${pathname === '/whatisthis'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span className="h-4 w-4 text-center">?</span>
                What Is This
              </Link>
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar with Menu Button */}
          <div className="flex items-center p-4 border-b border-gray-200 bg-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="ml-2 text-lg font-semibold">Fast Read</h1>
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ReadingHistoryContext.Provider>
  )
}