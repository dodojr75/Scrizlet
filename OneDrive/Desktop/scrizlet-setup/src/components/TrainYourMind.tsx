import React, { useState } from 'react';  
// Import React and the useState hook so we can create component state below

import { useSignContext, Sign } from '../contexts/SignLanguageContext';  
// Import our custom context hook to get sign data, and the Sign type for TypeScript

export default function TrainYourMind() {  
  // Define and export the TrainYourMind component

  const { signs } = useSignContext();  
  // Pull the full array of sign objects from context (each has word, media URL, etc.)

  const [mode, setMode] = useState<'sign2word' | 'word2sign'>('sign2word');  
  // State: which quiz mode is active.  
  // 'sign2word' means show a sign image and ask for the word.  
  // 'word2sign' means show the word and ask to reveal the sign.  
  // Default to 'sign2word'.

  const [current, setCurrent] = useState<Sign>(signs[0]);  
  // State: the current sign object we’re quizzing on.  
  // Initialize with the first sign to avoid null.

  const [guess, setGuess] = useState('');  
  // State: the user’s typed guess for sign2word mode. Starts empty.

  const [feedback, setFeedback] = useState('');  
  // State: message to tell the user “Correct!”, “Try again”, or reveal the sign. Starts empty.

  // Function to advance to the next random sign and reset everything
  const next = () => {
    const rand = signs[Math.floor(Math.random() * signs.length)];  
    // Pick a random index from 0 to signs.length-1, then select that sign

    setCurrent(rand);  
    // Update current sign state to the new random sign

    setGuess('');  
    // Clear the user’s previous guess

    setFeedback('');  
    // Clear any old feedback message
  };

  // Function to check if the user’s guess matches the current sign’s word
  const check = () => {
    // Compare trimmed, lowercase versions so capitalization and extra spaces don’t break it
    if (guess.trim().toLowerCase() === current.word.toLowerCase()) {
      setFeedback('Correct!');  
      // If they match, show a success message
    } else {
      setFeedback('Try again');  
      // Otherwise, ask them to try again
    }
  };


  
  // The component’s UI
  return (
    <div>
      <h2>Train Your Mind</h2>     
      {/* Title of the game like the namae at first but its a gloryfied ui  */}
      

      {/* Mode selector buttons */}
      <div className="mb-4">
        <button
          onClick={() => setMode('sign2word')}  
          // When clicked, switch to Sign → Word mode
          className={mode === 'sign2word' ? 'font-bold' : ''}  
          // Highlight this button if it’s the active mode
        >
          Sign → Word
        </button>
        <button
          onClick={() => setMode('word2sign')}  
          // When clicked, switch to Word → Sign mode
          className={mode === 'word2sign' ? 'font-bold ml-4' : 'ml-4'}  
          // Highlight if active; always add left margin to separate buttons
        >
          Word → Sign
        </button>
      </div>

      {/* Quiz area: changes based on mode */}
      {mode === 'sign2word' ? (
        // ----- Sign → Word Mode -----
        <>
          <img
            src={current.media}
            alt={current.word}
            className="mx-auto mb-4"
          />
          {/* Show the sign GIF centered */}

          <input
            value={guess}
            onChange={e => setGuess(e.target.value)}  
            // Update guess state as the user types
            placeholder="Type the word"
            className="border p-2 mb-2"
          />
          {/* Text input for the user’s guess */}

          <button
            onClick={check}  
            // When clicked, run check() to compare guess vs. correct word
            className="px-4 py-2 bg-blue-500 text-white"
          >
            Check
          </button>
        </>
      ) : (
        // ----- Word → Sign Mode -----
        <>
          <p className="mb-4 text-xl">{current.word}</p>  
          {/* Show the word in large text */}

          <button
            onClick={() => setFeedback(current.word)}  
            // Reveal the sign by copying the word into feedback
            className="px-4 py-2 bg-green-500 text-white mb-4"
          >
            Reveal Sign
          </button>

          {feedback === current.word && (
            <img
              src={current.media}
              alt={current.word}
              className="mx-auto mt-4"
            />
            // If feedback matches the word, show the sign GIF
          )}
        </>
      )}

      {/* Display any feedback message (Correct!, Try again, or revealed word) */}
      {feedback && <p className="mt-4">{feedback}</p>}

      {/* Next button to load another sign */}
      <button
        onClick={next}  
        // When clicked, call next() to pick a new random sign and reset
        className="mt-6 px-4 py-2 bg-gray-200"
      >
        Next
      </button>
    </div>
  );
}
