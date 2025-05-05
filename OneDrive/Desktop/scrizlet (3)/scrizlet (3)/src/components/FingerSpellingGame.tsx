// Core React hooks:
import { useEffect, useState } from 'react';
// └─ useState lets you add local state to your component (e.g. guess, score, etc.).
// └─ useEffect lets you run “side effects” (e.g. start/clear your letter‑display interval when gameState changes).

// Icon components from lucide-react:
import { ArrowLeft, Play, CircleCheck, CircleX, Check, X } from 'lucide-react';
// └─ ArrowLeft: a left‑pointing arrow (used in the “Back to Games” link).
// └─ Play: a triangular “play” icon (used in the Start Game button).
// └─ CircleCheck / CircleX: large icons for correct/incorrect feedback.
// └─ Check / X: smaller icons used in the results list.

// React Router component for client‑side navigation:
import { Link } from 'react-router-dom';
// └─ Link renders an <a> that React Router intercepts to navigate without a full page reload.

// Your custom hook that gives access to the shared sign/letter data:
import { useSignLanguage } from '../contexts/SignLanguageContext';
// └─ useSignLanguage() returns all of your signs, letters, and the save/unsave functions
//    so you can display the right GIFs and manage favorites.
// Predefined word lists by difficulty
const WORD_LISTS = {
  easy:   ["CAT","DOG","RUN","SIT","HAT","BAT","SUN","FUN","BIG","MAP","Ate"],
  medium: ["HELLO","WORLD","LEARN","PIZZA","MUSIC","HOUSE","WATER","DANCE","HAPPY","BEACH"],
  hard:   ["LANGUAGE","PRACTICE","ALPHABET","COMPUTER","KEYBOARD","FESTIVAL","QUESTION","EXERCISE","SANDWICH","CALENDAR"]
};

// Type for difficulty keys: 'easy' | 'medium' | 'hard'
type Difficulty = keyof typeof WORD_LISTS;

export default function FingerSpellingGame() {
  // Grab letter image data from our shared context
  const { letters } = useSignLanguage();

  // State: which difficulty the user picked
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  // State: current phase of the game
  const [gameState, setGameState] = useState<'setup'|'spelling'|'input'|'feedback'|'results'>('setup');
  // State: the word we're currently spelling
  const [currentWord, setCurrentWord] = useState('');
  // State: index of the letter currently displayed (or -1 while preparing)
  const [displayedIdx, setDisplayedIdx] = useState(-1);
  // State: what the user has typed as their guess
  const [guess, setGuess] = useState('');
  // State: feedback after a guess { correct: boolean } or null while none
  const [feedback, setFeedback] = useState<{ correct: boolean } | null>(null);
  // State: how many they’ve gotten right so far
  const [score, setScore] = useState(0);
  // State: which round (0-based) they’re on
  const [round, setRound] = useState(0);
  // State: array of result objects for the results screen
  const [results, setResults] = useState<{ word: string; guess: string; correct: boolean }[]>([]);

  // Total number of rounds per game
  const totalRounds = 5;

  // Effect: when gameState switches to 'spelling', pick a word and show its letters one by one
  useEffect(() => {
    if (gameState === 'spelling') {
      // 1. Pick a random word from the chosen difficulty list
      const list = WORD_LISTS[difficulty];
      const word = list[Math.floor(Math.random() * list.length)];
      setCurrentWord(word);
      // Reset display index
      setDisplayedIdx(-1);

      let idx = 0;
      // Show each letter at an interval depending on difficulty speed
      const interval = setInterval(() => {
        if (idx < word.length) {
          setDisplayedIdx(idx); // show letter at position
          idx++;
        } else {
          clearInterval(interval);
          // After all letters shown, move to input phase
          setGameState('input');
        }
      }, difficulty === 'easy'   ? 1200
         : difficulty === 'medium' ? 800
         : /* hard */              500
      );

      // Cleanup interval if component unmounts or gameState changes
      return () => clearInterval(interval);
    }
  }, [gameState, difficulty]);

  // Function: reset everything and start round 1
  const startGame = () => {
    setScore(0);
    setRound(0);
    setResults([]);
    setGuess('');
    setFeedback(null);
    setGameState('spelling');
  };

  // Function: handle when user submits their guess
  const submitGuess = () => {
    // Compare uppercase guess to the actual word
    const isCorrect = guess.toUpperCase() === currentWord;
    setFeedback({ correct: isCorrect });

    // Update score if correct
    if (isCorrect) setScore(s => s + 1);

    // Record this round's result
    setResults(r => [...r, { word: currentWord, guess, correct: isCorrect }]);

    // After a brief delay, either start next round or show final results
    setTimeout(() => {
      if (round + 1 < totalRounds) {
        setRound(r => r + 1);
        setGuess('');
        setFeedback(null);
        setGameState('spelling');
      } else {
        setGameState('results');
      }
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* ───── HEADER ───── */}
      <div className="flex justify-between items-center">
        <Link to="/games" className="flex items-center text-primary gap-2">
          <ArrowLeft size={16} /> Back to Games
        </Link>
        <h1 className="text-3xl font-bold">Fingerspelling Challenge</h1>
      </div>

      {/* ───── SETUP SCREEN ───── */}
      {gameState === 'setup' && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary-border">
          <h2 className="text-xl font-semibold mb-4 text-center text-charcoal">
            Choose Difficulty
          </h2>
          <div className="space-y-3 mb-6">
            {(['easy','medium','hard'] as Difficulty[]).map(diff => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)} // change difficulty on click
                className={`w-full p-4 rounded-lg text-left ${
                  difficulty === diff
                    ? 'bg-primary text-white'
                    : 'bg-primary-light hover:bg-primary-border text-primary-dark'
                }`}
              >
                <div className="flex justify-between items-center">
                  {/* Display difficulty name */}
                  <span className="font-medium">
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </span>
                  {/* Show speed hint */}
                  <span className="text-sm opacity-90">
                    {diff === 'easy'   ? '1.2s per letter'
                     : diff === 'medium' ? '0.8s per letter'
                     :                     '0.5s per letter'}
                  </span>
                </div>
              </button>
            ))}
          </div>
          {/* Start button begins the spelling effect */}
          <button
            onClick={startGame}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Play size={16} /> Start Game
          </button>
        </div>
      )}

      {/* ───── SPELLING SCREEN ───── */}
      {gameState === 'spelling' && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary-border">
          {/* Progress & score header */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Word {round + 1} of {totalRounds}
            </div>
            <div className="bg-primary-light py-1 px-3 rounded-lg text-primary-dark">
              Score: {score}/{round}
            </div>
          </div>
          {/* Instruction & progress text */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold mb-2 text-charcoal">
              Watch Carefully!
            </h2>
            <p className="text-gray-600">
              {displayedIdx >= 0
                ? `Showing letter ${displayedIdx + 1} of ${currentWord.length}`
                : 'Preparing to spell the word...'}
            </p>
          </div>
          {/* Letter display area */}
          <div className="flex justify-center items-center h-64 bg-black rounded-lg mb-6">
            {displayedIdx >= 0 ? (
              // Show the GIF for the current letter
              <img
                src={
                  letters.find(l => l.letter === currentWord[displayedIdx])
                    ?.image
                }
                alt="Sign"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-white text-lg">Get ready...</div>
            )}
          </div>
        </div>
      )}

      {/* ───── INPUT SCREEN ───── */}
      {gameState === 'input' && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary-border">
          {/* Progress & score header */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Word {round + 1} of {totalRounds}
            </div>
            <div className="bg-primary-light py-1 px-3 rounded-lg text-primary-dark">
              Score: {score}/{round}
            </div>
          </div>
          {/* Prompt */}
          <h2 className="text-xl font-semibold mb-4 text-center text-charcoal">
            What word was spelled?
          </h2>
          {/* Text input for guess */}
          <input
            type="text"
            value={guess}
            onChange={e => setGuess(e.target.value)} // update guess state
            onKeyPress={e => e.key === 'Enter' && guess.trim() && submitGuess()}
            className="w-full p-3 rounded-lg bg-primary-light border border-primary-border focus:outline-none focus:ring-2 focus:ring-primary text-charcoal mb-4"
            placeholder="Type your answer..."
            autoFocus
          />
          {/* Submit button */}
          <button
            onClick={submitGuess}
            disabled={!guess.trim()} // disable if input empty
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg"
          >
            Submit Answer
          </button>
        </div>
      )}

      {/* ───── FEEDBACK SCREEN ───── */}
      {gameState === 'feedback' && feedback && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary-border">
          {/* Progress & updated score */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Word {round + 1} of {totalRounds}
            </div>
            <div className="bg-primary-light py-1 px-3 rounded-lg text-primary-dark">
              Score: {score}/{round + 1}
            </div>
          </div>
          {/* Correct or incorrect feedback */}
          <div className="text-center mb-6">
            {feedback.correct ? (
              <div className="flex flex-col items-center gap-2">
                <CircleCheck size={48} className="text-green-600" />
                <h2 className="text-xl font-semibold text-green-700">
                  Correct!
                </h2>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <CircleX size={48} className="text-red-600" />
                <h2 className="text-xl font-semibold text-red-700">
                  Incorrect
                </h2>
                <p className="text-charcoal">
                  The word was <span className="font-bold">{currentWord}</span>
                </p>
              </div>
            )}
          </div>
          <p className="text-center text-gray-600">
            Next word coming up...
          </p>
        </div>
      )}

      {/* ───── RESULTS SCREEN ───── */}
      {gameState === 'results' && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary-border">
          <h2 className="text-xl font-semibold mb-4 text-center text-charcoal">
            Game Complete!
          </h2>
          <div className="text-center mb-6">
            {/* Final score display */}
            <div className="text-3xl font-bold mb-2 text-charcoal">
              {score}/{totalRounds}
            </div>
            <p className="text-gray-600">Final Score</p>
          </div>
          <h3 className="font-semibold mb-2 text-charcoal">Results</h3>
          {/* List each round’s word, user guess, and a check/X */}
          <div className="space-y-2 mb-6">
            {results.map((res, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg flex justify-between ${
                  res.correct ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <span>
                  {res.word} (You: {res.guess})
                </span>
                {res.correct ? (
                  <Check size={20} className="text-green-600" />
                ) : (
                  <X size={20} className="text-red-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/*
  CUSTOM FUNCTIONS:

  • useEffect(() => { … }, [gameState, difficulty]):
      - When gameState is 'spelling', picks a random word from WORD_LISTS[difficulty]
      - Shows one letter at a time by updating displayedIdx
      - After all letters shown, switches to 'input' phase

  • startGame():
      - Resets score, round, results, guess, feedback
      - Sets gameState to 'spelling' to begin the first round

  • submitGuess():
      - Compares user's guess to the currentWord
      - Updates feedback, score, and results list
  

  SUMMARY:

  The `FingerSpellingGame` component provides an interactive quiz where users watch a sequence of sign-language letter GIFs and then type what word was spelled. It manages five phases: setup (choose difficulty), spelling (show GIF sequence), input (type guess), feedback (correct/incorrect display), and results (final score and history). It uses React state and effects to orchestrate timing and progression, and pulls letter-image data from 
  the shared SignLanguageContext so it can display the appropriate GIF for each letter.


  */