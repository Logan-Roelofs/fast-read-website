"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { BookmarkPlus, ChevronDown, ChevronUp, SkipForward, SkipBack } from "lucide-react"
import Link from "next/link"
import { useReadingHistory } from "@/components/ui/sidebar"

export default function ReadPage() {
  const [text, setText] = useState<string>("")
  const [words, setWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [wpm, setWpm] = useState([300]) // Words per minute
  const [isSaved, setIsSaved] = useState(false)
  const [showFullText, setShowFullText] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { addToHistory } = useReadingHistory()

  useEffect(() => {
    // Get text from sessionStorage
    const storedText = sessionStorage.getItem('readingText')
    if (storedText) {
      setText(storedText)
      const wordArray = storedText.split(/\s+/).filter(word => word.length > 0)
      setWords(wordArray)
      // Reset reading state when new text is loaded
      setCurrentWordIndex(0)
      setIsPlaying(false)
    }
  }, [])

  // Listen for changes to sessionStorage (when clicking sidebar items)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedText = sessionStorage.getItem('readingText')
      if (storedText && storedText !== text) {
        setText(storedText)
        const wordArray = storedText.split(/\s+/).filter(word => word.length > 0)
        setWords(wordArray)
        // Reset reading state when new text is loaded
        setCurrentWordIndex(0)
        setIsPlaying(false)
      }
    }

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically since storage events don't always fire for sessionStorage
    const interval = setInterval(() => {
      handleStorageChange()
    }, 100)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [text])

  useEffect(() => {
    if (isPlaying && words.length > 0) {
      const interval = 60000 / wpm[0] // Convert WPM to milliseconds
      intervalRef.current = setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= words.length - 1) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, interval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, wpm, words])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentWordIndex(0)
  }

  const saveToHistory = () => {
    if (text) {
      const title = `Reading Session - ${new Date().toLocaleDateString()}`
      addToHistory(title, "/read", text)
      setIsSaved(true)
      // Reset the saved state after 2 seconds
      setTimeout(() => setIsSaved(false), 2000)
    }
  }

  if (!text) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">No text to read.</p>
          <Link href="/">
            <Button>Go Back</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* RSVP Display */}
        <div className="text-center">
          <div className="bg-white border-2 border-gray-300 rounded-lg p-8 min-h-[200px] flex items-center justify-center">
            <span className="text-4xl font-bold text-black">
              {words[currentWordIndex] || ""}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-center block">
            Progress: Word {currentWordIndex + 1} of {words.length}
          </label>
          <div className="flex items-center gap-3">
            <Button onClick={togglePlayPause} size="sm" className="px-4">
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button 
              onClick={() => setCurrentWordIndex(Math.max(0, currentWordIndex - 30))}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <SkipBack className="h-4 w-4" />
              -30
            </Button>
            <Slider
              value={[currentWordIndex]}
              onValueChange={(value) => setCurrentWordIndex(value[0])}
              max={words.length - 1}
              min={0}
              step={1}
              className="flex-1"
            />
            <Button 
              onClick={() => setCurrentWordIndex(Math.min(words.length - 1, currentWordIndex + 30))}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              +30
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button 
              onClick={saveToHistory} 
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 ${isSaved ? 'bg-green-100 text-green-700' : ''}`}
            >
              <BookmarkPlus className="h-4 w-4" />
              {isSaved ? "Saved!" : "Save"}
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">

          {/* Speed Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Speed: {wpm[0]} WPM
            </label>
            <Slider
              value={wpm}
              onValueChange={setWpm}
              max={800}
              min={100}
              step={25}
              className="w-full"
            />
          </div>
        </div>

        {/* Full Text Display */}
        <div className="space-y-2">
          <Button 
            onClick={() => setShowFullText(!showFullText)}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            {showFullText ? "Hide Full Text" : "Show Full Text"}
            {showFullText ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {showFullText && (
            <div className="bg-gray-50 border rounded-lg p-4">
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {words.map((word, index) => (
                  <span
                    key={index}
                    className={`${
                      index === currentWordIndex 
                        ? 'bg-yellow-300 text-black' 
                        : ''
                    }`}
                  >
                    {word}
                    {index < words.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>
    </div> 
  );
}