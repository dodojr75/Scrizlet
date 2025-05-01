// src/components/FingerspellingGame.tsx

import React, { useEffect, useState } from 'react';
// Import React and two hooks:
//   - useState   for local state variables
//   - useEffect  for running side-effects when the component mounts or updates

import { useSignContext } from '../contexts/SignLanguageContext';
// Import the custom hook to access shared sign data:
//   - alphabetMap: maps each letter (a–z) to its sign image URL
//   - words:       array of words to use in the game

/** Letter delay in ms by difficulty */
const SPEED: Record<'easy' | 'medium' | 'hard', number> = {
  easy:   1200,
  medium:  800,
  hard:    500
};
// Define how fast letters advance at each difficulty level.

export default function FingerspellingGame() {
  // Define and export the FingerspellingGame component

  const { alphabetMap, words } = useSignContext();
  // Grab alphabetMap and words from context

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  // State: current difficulty level (default 'easy')

  const [word, setWord] = useState('');
  // State: the full word chosen for this round

  const [letters, setLetters] = useState<string[]>([]);
  // State: array of the word's letters, with spaces removed

  const [idx, setIdx] = useState(0);
  // State: index of the letter to display next

  const [guess, setGuess] = useState('');
  // State: what the user types in as their guess

  const [feedback, setFeedback] = useState('');
  // State: message shown after guess ('Correct!' or 'Nope — it was "..."')

  /** Pick a random word and reset state */
  const newRound = () => {
    const w = words[Math.floor(Math.random() * words.length)];
    // Select a random word from the list

    setWord(w);
    // Store that word

    setLetters(w.replace(/\s+/g, '').split(''));
    // Remove spaces and split into letters

    setIdx(0);
    // Start at the first letter

    setGuess('');
    // Clear previous guess

    setFeedback('');
    // Clear previous feedback
  };

  /** Start first round on mount */
  useEffect(newRound, [words]);
  // Run newRound once when the component mounts (or if words array changes)

  /** Auto-advance letters */
  useEffect(() => {
    if (idx < letters.length) {
      // If there are more letters to show:
      const t = setTimeout(() => setIdx(i => i + 1), SPEED[difficulty]);
      // Advance idx after a delay based on difficulty
      return () => clearTimeout(t);
      // Clear the timeout if dependencies change before it fires
    }
    // When idx >= letters.length, do nothing here
  }, [idx, letters, difficulty]);
  // Re-run whenever idx, letters array, or difficulty changes

  /** Check answer */
  const submit = () => {
    if (guess.trim().toLowerCase() === word.toLowerCase()) {
      // If guess matches the word (case-insensitive, trimmed)
      setFeedback('Correct!');
      setTimeout(newRound, 1500);
      // Show feedback, then start a new round after 1.5s
    } else {
      setFeedback(`Nope — it was “${word}”`);
      setTimeout(newRound, 2000);
      // Show correct answer, then new round after 2s
    }
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Fingerspelling Game</h2>
      {/* Title */}

      {/* Difficulty selector */}
      <div className="mb-4 space-x-2">
        {(['easy', 'medium', 'hard'] as const).map(lvl => (
          <button
            key={lvl}
            onClick={() => setDifficulty(lvl)}
            className={`px-3 py-1 rounded ${
              difficulty === lvl ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Letter display or input */}
      {idx < letters.length ? (
        // While still showing letters:
        <img
          src={alphabetMap[letters[idx].toLowerCase()]}
          alt={letters[idx]}
          className="h-40 mx-auto mb-6"
        />
      ) : (
        // After all letters shown, show guess input:
        <div className="mb-6">
          <input
            value={guess}
            onChange={e => setGuess(e.target.value)}
            placeholder="Type the word"
            className="border p-2 mr-2"
          />
          <button
            onClick={submit}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Submit
          </button>
        </div>
      )}

      {feedback && (
        <p className="text-lg font-semibold">{feedback}</p>
      )}
      {/* Display feedback if non-empty */}
    </div>
  );
}
