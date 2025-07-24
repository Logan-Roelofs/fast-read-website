import Link from 'next/link';

export default function WhatIsThis() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-50 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-black mb-6 text-center">
            What is Rapid Serial Visual Presentation?
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Definition
            </h2>
            <p className="text-gray-700 mb-6">
              Rapid Serial Visual Presentation (RSVP) is a reading technique where text is presented 
              one word at a time in a fixed location on the screen. This method eliminates many of the 
              visual challenges that make reading difficult for people with dyslexia and other reading 
              differences, allowing for more efficient text processing.
            </p>

            {/* Video demonstration */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                See RSVP in Action
              </h2>
              <div className="bg-gray-100 p-6 rounded-lg">
                <video 
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
                  controls
                  muted
                  poster="/video-poster.jpg" // Optional: add a poster image
                >
                  <source src="/fast-read-website/Recording 2025-07-22 160859.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Getting Started with RSVP
            </h2>
            <div className="bg-gray-100 border-l-4 border-black p-6 rounded-lg mb-6">
              <ul className="space-y-2 text-gray-800">
                <li>• <strong>Start slow:</strong> Begin with 200-250 WPM to get comfortable</li>
                <li>• <strong>Practice regularly:</strong> Short 10-15 minute sessions work best</li>
                <li>• <strong>Adjust as needed:</strong> Find your optimal speed and font size</li>
                <li>• <strong>Take breaks:</strong> Rest your eyes every 15-20 minutes</li>
                <li>• <strong>Be patient:</strong> It takes time to adapt to this new reading style</li>
              </ul>
            </div>

            <div className="text-center mt-8">
              <Link
                href="/"
                className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Start Reading with RSVP
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}