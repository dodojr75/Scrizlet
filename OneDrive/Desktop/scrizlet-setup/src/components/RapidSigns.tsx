// src/components/RapidSigns.tsx

import React, { useState, useEffect } from 'react';
// Import React and two hooks:
//   - useState to hold component state (current sign, user guess, feedback, timer)
//   - useEffect to perform side-effects (initializing the game and managing the countdown)

import { useSignContext, Sign } from '../contexts/SignLanguageContext';
// Import our custom hook to access the shared sign data,
// and the Sign type which describes the shape of a sign object

export default function RapidSigns() {
  // Define and export the RapidSigns component

  const { signs } = useSignContext();
  // Destructure the 'signs' array from context, containing all sign objects

  const [sign, setSign] = useState<Sign | null>(null);
  // State: the current sign object. Starts as null until we pick one.

  const [guess, setGuess] = useState('');
  // State: the text the user types as their guess. Starts empty.

  const [feedback, setFeedback] = useState('');
  // State: message shown after submitting or timing out ("Wrong—it was ...", "Timeout!", etc.)

  const [time, setTime] = useState(5);
  // State: countdown timer in seconds. Starts at 5 seconds for each round.

  useEffect(() => {
    // This effect runs once on component mount
    nextSign();
    // Initialize the game by picking the first random sign
  }, []);
  // Empty dependency array ensures this runs only once

  useEffect(() => {
    // This effect runs whenever 'time' changes
    if (time > 0) {
      // If there is still time remaining...
      const t = setTimeout(() => setTime(t => t - 1), 1000);
      // Schedule a timeout to decrement 'time' by 1 after 1000ms
      return () => clearTimeout(t);
      // Cleanup: if 'time' changes before timeout fires, clear the previous timeout
    } else {
      // If time has reached zero...
      setFeedback('Timeout!');
      // Display a timeout message; the user can still submit or move on
    }
  }, [time]);
  // Effect depends on 'time', so it re-runs each second

  const nextSign = () => {
    // Function to start a new round with a fresh random sign
    setSign(signs[Math.floor(Math.random() * signs.length)]);
    // Pick a random index and set 'sign' to that object

    setGuess('');
    // Clear any previous text the user entered

    setFeedback('');
    // Clear previous feedback message

    setTime(5);
    // Reset the countdown timer to 5 seconds
  };

  const check = () => {
    // Function to check the user's guess when they click Submit
    if (guess.trim().toLowerCase() === sign?.word.toLowerCase()) {
      // Compare trimmed, lowercase guess to the sign's word
      nextSign();
      // If correct, immediately start a new round
    } else {
      // If incorrect...
      setFeedback(`Wrong—it was "${sign?.word}"`);
      // Show the correct answer in the feedback
    }
  };

  if (!sign) return null;
  // If 'sign' is still null (before nextSign runs), render nothing

  return (
    <div>
      <h2>Rapid Signs</h2>
      {/* Section title */}

      <p>Time left: {time}s</p>
      {/* Display the remaining seconds */}

      <img
        src={sign.media}
        alt={sign.word}
        className="mb-4 mx-auto"
      />
      {/* Show the current sign's GIF, centered with bottom margin */}

      <input
        value={guess}
        onChange={e => setGuess(e.target.value)}
        placeholder="Type the word"
        className="border p-2 mb-2 w-full"
      />
      {/* Text input bound to 'guess', with placeholder and styling */}

      <button
        onClick={check}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Submit
      </button>
      {/* Button that invokes check() when clicked */}

      {feedback && <p className="mt-4">{feedback}</p>}
      {/* If feedback is non-empty, display it with top margin */}
    </div>
  );
}
