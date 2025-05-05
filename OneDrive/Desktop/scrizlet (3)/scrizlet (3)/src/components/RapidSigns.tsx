

import { useState, useEffect, useRef } from 'react';
// └── React hooks:
//     • useState  → create local state variables that trigger re‑renders when they change
//     • useEffect → run side‑effects after rendering (e.g. start/stop timers)
//     • useRef    → hold a mutable value (here: the timer ID) across renders

import { useSignLanguage, Sign } from '../contexts/SignLanguageContext';
// └── Custom hook from your context:
//     • useSignLanguage() gives you access to the array of all `signs`
//     • `Sign` is the TypeScript type for a single sign entry

import { Link } from 'react-router-dom';
// └── Renders a client‑side navigation link (no full page reload)

import { ArrowLeft, Timer } from 'lucide-react';
// └── Two icon components: a back‑arrow and a clock/timer

// ────────────────────────────────────────────────────────────────────────────────
// Game configuration constants
// ────────────────────────────────────────────────────────────────────────────────
const totalRounds = 10;
// └── How many signs the user will guess in one play‑through

const roundTime = 5000; // 5 seconds per round
// └── Milliseconds allotted for each round

// ────────────────────────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────────────────────────
export default function RapidSigns() {
  // ── 1) CONTEXT DATA ─────────────────────────────────────────────────────────────
  const { signs } = useSignLanguage();
  // └── pulls in the full array of sign objects { id, term, gif, … }

  // ── 2) LOCAL STATE ──────────────────────────────────────────────────────────────
  const [currentSign, setCurrentSign] = useState<Sign | null>(null);
  // └── which sign we’re currently quizzing on

  const [options, setOptions]     = useState<string[]>([]);
  // └── the 4 possible text answers (1 correct + 3 wrong)

  const [score, setScore]         = useState(0);
  // └── total correct so far

  const [round, setRound]         = useState(1);
  // └── current round number (1 through totalRounds)

  const [timeLeft, setTimeLeft]   = useState(roundTime / 1000);
  // └── countdown in seconds, displayed to user

  const timerRef = useRef<number | null>(null);
  // └── holds the browser interval ID, so we can clear it

  const [feedback, setFeedback]   = useState<string | null>(null);
  // └── temporary message “Correct!” or “Wrong”

  // ────────────────────────────────────────────────────────────────────────────────
  // startRound: pick a random sign, generate options, reset timer
  // ────────────────────────────────────────────────────────────────────────────────
  const startRound = () => {
    if (round > totalRounds) return;         // don’t start if game is over

    // 1) Pick a random sign from the list
    const idx  = Math.floor(Math.random() * signs.length);
    const sign = signs[idx];
    setCurrentSign(sign);

    // 2) Build three random wrong answers
    const wrongs = signs
      .filter(s => s.id !== sign.id)         // exclude the correct one
      .sort(() => 0.5 - Math.random())        // shuffle
      .slice(0, 3)                            // take any 3
      .map(s => s.term);

    // 3) Combine correct + wrongs and shuffle
    setOptions([ ...wrongs, sign.term ].sort(() => 0.5 - Math.random()));

    // 4) Reset countdown
    setTimeLeft(roundTime / 1000);
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    // 5) Start ticking down every second
    timerRef.current = window.setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
  };

  // ────────────────────────────────────────────────────────────────────────────────
  // On mount: once we have `signs`, immediately start the first round;
  // on unmount: clear any running timer.
  // ────────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (signs.length > 0) startRound();
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, [signs]);

  // ────────────────────────────────────────────────────────────────────────────────
  // If time runs out (hits 0), treat as a wrong answer
  // ────────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAnswer('');
    }
  }, [timeLeft]);

  // ────────────────────────────────────────────────────────────────────────────────
  // handleAnswer: user clicked an option (or time expired)
  // ────────────────────────────────────────────────────────────────────────────────
  const handleAnswer = (answer: string) => {
    // 1) stop the timer
    if (timerRef.current !== null) window.clearInterval(timerRef.current);

    // 2) check correctness
    const correct = answer === currentSign?.term;
    if (correct) setScore(s => s + 1);

    // 3) show temporary feedback
    setFeedback(correct ? 'Correct!' : 'Wrong');

    // 4) move to next round number
    setRound(r => r + 1);

    // 5) after a brief pause, clear feedback and start next round
    setTimeout(() => {
      setFeedback(null);
      startRound();
    }, 800);
  };


  // GAME OVER SCREEN

  if (round > totalRounds) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl mb-4">Game Over!</h2>
        <p className="mb-4">Your score: {score} / {totalRounds}</p>
        <button
          onClick={() => { setScore(0); setRound(1); startRound(); }}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Play Again
        </button>
      </div>
    );
  }


  // MAIN GAME UI
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* ===== Header with back‑link and title ===== */}
      <div className="flex justify-between items-center">
        <Link to="/games" className="flex items-center text-primary gap-2">
          <ArrowLeft size={16}/> Back to Games
        </Link>
        <h1 className="text-3xl font-bold">Rapid Signs Challenge</h1>
      </div>

      {/* ===== Score / Timer / Round info ===== */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-primary-border">
        <div className="flex justify-between mb-4">
          <span>Score: {score}</span>
          <span className="flex items-center gap-1">
            <Timer size={20}/> {timeLeft}s
          </span>
          <span>Round {round} / {totalRounds}</span>
        </div>

        {/* ===== Display the sign GIF ===== */}
        <div className="flex justify-center mb-6">
          <img
            src={currentSign?.gif}
            alt={currentSign?.term}
            className="h-48 w-48 object-contain"
          />
        </div>

        {/* ===== Question prompt ===== */}
        <h2 className="text-lg font-semibold mb-4">
          What does this sign mean?
        </h2>

        {/* ===== Four answer buttons ===== */}
        <div className="grid grid-cols-2 gap-4">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={!!feedback}  // disable while showing feedback
              className="p-4 bg-white rounded-lg shadow hover:bg-gray-100 disabled:opacity-50"
            >
              {opt}
            </button>
          ))}
        </div>

        {/* ===== Feedback message ===== */}
        {feedback && (
          <div
            className={`mt-4 text-center text-xl font-semibold ${
              feedback === 'Correct!' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}
