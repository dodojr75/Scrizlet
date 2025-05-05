import { useState, useEffect } from 'react';  
// └─ useState: to hold local reactive variables (currentIndex, learnedLetters)  
// └─ useEffect: to run side‑effects on mount (load saved progress) and on updates (save progress)

import { useSignLanguage, Letter } from '../contexts/SignLanguageContext';  
// └─ useSignLanguage(): our custom hook that provides the loaded `letters` array  
// └─ Letter: TS type defining the shape of each letter object { id, letter, image, type }

import { ArrowRight } from 'lucide-react';  
// └─ ArrowRight: SVG icon component for our “Next” button

export default function GameAlphabet() {
  // Pull the `letters` array out of our shared context
  const { letters } = useSignLanguage();

  // Index of the letter currently on screen (0-based)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array of letters the user has already “seen” or “learned”
  const [learnedLetters, setLearnedLetters] = useState<string[]>([]);

  // ────────────────────────────────────────────────────────────────────────────────
  // LOAD SAVED PROGRESS ONCE:
  // When the component first mounts, read any previous progress from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('alphabet_progress');
    if (stored) {
      try {
        // Parse the JSON string back into an array of strings
        setLearnedLetters(JSON.parse(stored));
      } catch {
        // If parsing fails, just leave learnedLetters as []
      }
    }
  }, []); // empty deps → run only on mount

  // ────────────────────────────────────────────────────────────────────────────────
  // SAVE PROGRESS AUTOMATICALLY:
  // Whenever `learnedLetters` changes, write it back to localStorage
  useEffect(() => {
    localStorage.setItem('alphabet_progress', JSON.stringify(learnedLetters));
  }, [learnedLetters]); // run whenever learnedLetters updates

  // ────────────────────────────────────────────────────────────────────────────────
  // Advance to the next letter (or wrap around):
  const handleNext = () => {
    // Mark the current letter as “learned” if not already
    const letter = letters[currentIndex].letter;
    setLearnedLetters(prev =>
      prev.includes(letter) ? prev : [...prev, letter]
    );
    // Move index forward, wrap to 0 at end
    setCurrentIndex((currentIndex + 1) % letters.length);
  };

  // Go back one letter (but never below 0)
  const handlePrevious = () => {
    setCurrentIndex(i => Math.max(i - 1, 0));
  };

  // Grab the “current” letter object for easier JSX
  const current = letters[currentIndex] as Letter;

  // ────────────────────────────────────────────────────────────────────────────────
  // RENDER
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with title and subtitle */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2 text-charcoal">
          Learn the Sign Language Alphabet
        </h1>
        <p className="text-gray-400">
          Master finger spelling one letter at a time!
        </p>
      </div>

      {/* Main card showing the letter and image */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-primary-border">
        {/* Top bar: “X of Y” and the letter itself */}
        <div className="flex justify-between items-center mb-4">
          {/* Position indicator */}
          <div className="text-lg text-charcoal">
            {currentIndex + 1} of {letters.length}
          </div>
          {/* Large display of the letter */}
          <div className="text-2xl font-bold text-charcoal">
            {current.letter}
          </div>
        </div>

        {/* Image container */}
        <div className="flex justify-center items-center h-64 bg-primary-light rounded-lg mb-6">
          <img
            src={current.image}         // path to the sign GIF for this letter
            alt={current.letter}        // accessibility text
            className="h-48 object-contain"
          />
        </div>

        {/* Instructional text below the image */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2 text-charcoal">
            Letter {current.letter}
          </h3>
          <p className="text-gray-400">
            The sign for letter {current.letter} is shown above.
            Try to mimic this sign with your hand.
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}                 // go back one
            disabled={currentIndex === 0}            // disable at start
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              currentIndex === 0
                ? 'bg-primary-light text-gray-500 cursor-not-allowed'
                : 'bg-primary-light hover:bg-primary-border text-primary-dark'
            }`}
          >
            Previous
          </button>

          {/* Next / Start Over Button */}
          <button
            onClick={handleNext}                     // advance or wrap
            className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg flex items-center gap-2 text-white"
          >
            {/* Label switches to “Start Over” on the last letter */}
            {currentIndex === letters.length - 1 ? 'Start Over' : 'Next'}
            <ArrowRight size={16} />                // arrow icon
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4 pt-3 border-t border-primary-border">
          <p className="text-xs text-gray-500 mb-1">
            Progress: {Math.round((learnedLetters.length / letters.length) * 100)}% complete
          </p>
          <div className="h-1 bg-gray-100 rounded-full">
            <div
              className="h-full bg-primary rounded-full"
              // inline style to fill bar by learnedLetters/total
              style={{ width: `${(learnedLetters.length / letters.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Thumbnail grid of all letters with click-to-jump */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md border border-primary-border">
        <h3 className="font-semibold mb-3 text-charcoal">Your Alphabet Progress</h3>
        <div className="grid grid-cols-13 gap-2">
          {letters.map((l, idx) => (
            <div
              key={l.id}                             // unique key for list rendering
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm cursor-pointer ${
                learnedLetters.includes(l.letter)
                  ? 'bg-primary text-white'         // highlight if learned
                  : 'bg-primary-light text-primary-dark'
              }`}
              onClick={() => setCurrentIndex(idx)}   // jump directly to that letter
            >
              {l.letter}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
