/// this isnt beign used tommato tommato tommmato tommaot  bweweeweweweeeweweweewe

import { useEffect, useState } from "react";
// └── React hooks for stateful values and side‐effects

import { useSignLanguage } from "../contexts/SignLanguageContext";
// └── Custom hook giving us access to the global `signs` array

import { RefreshCw } from "lucide-react";
// └── Refresh icon component for the “Play Again” button

// ───────────────────────────────────────────────────────────────────────────────
// Number of quiz rounds
const totalRounds = 10;
// ───────────────────────────────────────────────────────────────────────────────

export default function WhatsTheSignGame() {
  // ——— State declarations ———
  const { signs } = useSignLanguage();
  // └── Grab the master list of sign terms

  const [round, setRound] = useState(1);
  // └── Current round number (1 through totalRounds)

  const [currentWord, setCurrentWord] = useState<string>("");
  // └── The secret word for this round, in ALL CAPS

  const [displayLetters, setDisplayLetters] = useState<string[]>([]);
  // └── Array of single‐character strings for rendering letter images

  const [options, setOptions] = useState<string[]>([]);
  // └── Four multiple‐choice strings (one correct + three distractors)

  const [feedback, setFeedback] = useState<string | null>(null);
  // └── Shows “Correct!” or “Wrong! It was …” after each guess

  const [score, setScore] = useState(0);
  // └── Running tally of correct answers

  // — Initialize the first round once `signs` is loaded —
  useEffect(() => {
    nextRound();
  }, [signs]);

  // — Pick a new word, build choices, reset feedback —
  function nextRound() {
    if (round > totalRounds) return;
    // └── Don’t do anything if we’ve already finished

    // 1) Build a filtered pool of sign‐words (no spaces, 3–6 letters)
    const words = signs
      .map((s) => s.term.toUpperCase())
      .filter((w) => !w.includes(" ") && w.length >= 3 && w.length <= 6);

    // 2) Choose one at random
    const chosen = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(chosen);

    // 3) Split into letters for the PNG tile display
    setDisplayLetters(chosen.split(""));

    // 4) Reset old feedback
    setFeedback(null);

    // 5) Pick three random “wrong” options
    const wrongs = words
      .filter((w) => w !== chosen)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // 6) Shuffle correct + wrongs into `options`
    setOptions(shuffle([chosen, ...wrongs]));
  }

  // Simple shuffle utility via sort()
  function shuffle(arr: string[]) {
    return [...arr].sort(() => 0.5 - Math.random());
  }

  // — Handle when the user clicks one of the options —
  function handleAnswer(guess: string) {
    if (feedback) return;
    // └── Don’t allow a second click after answering

    if (guess === currentWord) {
      setFeedback("Correct!");
      setScore((s) => s + 1);
    } else {
      setFeedback(`Wrong! It was ${currentWord}`);
    }

    // After 1s, advance the round and start next if any remain
    setTimeout(() => {
      setRound((r) => r + 1);
      if (round < totalRounds) nextRound();
    }, 1000);
  }

  // — Game Over screen once all rounds complete —
  if (round > totalRounds) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl mb-4">Game Over!</h2>
        <p className="mb-4">Your score: {score} / {totalRounds}</p>
        <button
          onClick={() => {
            setRound(1);
            setScore(0);
            nextRound();
          }}
          className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 mx-auto"
        >
          <RefreshCw size={20} /> Play Again
        </button>
      </div>
    );
  }

  // — Main quiz UI for active rounds —
  return (
    <div className="p-4">
      {/* Title & Round Indicator */}
      <h2 className="text-xl font-semibold mb-2">What’s the Sign?</h2>
      <p>Round {round} of {totalRounds}</p>

      {/* Fingerspelled letters as PNG icons */}
      <div className="my-4 flex justify-center">
        <div className="flex gap-2">
          {displayLetters.map((ltr, idx) => (
            <img
              key={idx}
              src={`/assets/alphabets/${ltr}.png`}
              alt={ltr}
              className="h-16 w-16"
            />
          ))}
        </div>
      </div>

      {/* Show feedback if answered, else show choice buttons */}
      {feedback ? (
        <p className="text-center text-lg mb-2">{feedback}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className="p-3 bg-white rounded-lg shadow hover:bg-gray-100"
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Live score display */}
      <p>Score: {score}</p>
    </div>
  );
}
