import { useState, useEffect } from 'react';
import { useSignLanguage } from '../contexts/SignLanguageContext';
import { Award, Check, RefreshCw, Timer, X } from 'lucide-react';

// List of words for finger spelling practice
const FINGER_SPELLING_WORDS = [
  "hello", "world", "sign", "language", "learn", 
  "practice", "finger", "spell", "alphabet", "word",
  "deaf", "community", "hand", "gesture", "friend"
];

export default function GameFingerSpelling() {
  const [currentWord, setCurrentWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [gameState, setGameState] = useState<"ready" | "playing" | "completed">("ready");
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [feedback, setFeedback] = useState<"" | "correct" | "incorrect">("");

  // Start the game
  const startGame = () => {
    setGameState("playing");
    setTimeLeft(60);
    setScore(0);
    setTotalAttempts(0);
    pickNewWord();
  };

  // Pick a random word for spelling
  const pickNewWord = () => {
    const randomIndex = Math.floor(Math.random() * FINGER_SPELLING_WORDS.length);
    setCurrentWord(FINGER_SPELLING_WORDS[randomIndex]);
    setUserInput("");
    setCurrentLetterIndex(0);
  };

  // Check user answer
  const checkAnswer = () => {
    setTotalAttempts(totalAttempts + 1);
    
    if (userInput.toLowerCase() === currentWord.toLowerCase()) {
      setScore(score + 1);
      setFeedback("correct");
      setTimeout(() => {
        setFeedback("");
        pickNewWord();
      }, 1000);
    } else {
      setFeedback("incorrect");
      setTimeout(() => {
        setFeedback("");
      }, 1000);
    }
  };

  // Timer effect
  useEffect(() => {
    if (gameState !== "playing") return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState("completed");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState]);

  // Auto advance through letters for visualization
  useEffect(() => {
    if (gameState !== "playing") return;
    
    const letterInterval = setInterval(() => {
      setCurrentLetterIndex(prev => {
        if (prev >= currentWord.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 1500);
    
    return () => clearInterval(letterInterval);
  }, [gameState, currentWord]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Finger Spelling Challenge</h1>
        <p className="text-gray-400">
          Watch the finger-spelled word and type what you see!
        </p>
      </div>
      
      {gameState === "ready" && (
        <div className="bg-white p-8 rounded-lg text-center shadow-md border border-primary-border">
          <h2 className="text-xl font-semibold mb-4 text-charcoal">Ready to Test Your Skills?</h2>
          <p className="mb-6 text-charcoal">See how many finger-spelled words you can recognize in 60 seconds!</p>
          <button 
            onClick={startGame}
            className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg transition"
          >
            Start Challenge
          </button>
        </div>
      )}
      
      {gameState === "completed" && (
        <div className="bg-white p-8 rounded-lg text-center shadow-md border border-primary-border">
          <h2 className="text-xl font-semibold mb-4 text-charcoal">Challenge Complete!</h2>
          <div className="mb-6">
            <div className="text-5xl font-bold mb-2 text-charcoal">{score}</div>
            <p className="text-gray-400">Words correctly identified</p>
          </div>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center p-4 bg-primary-light rounded-full mb-2">
              <Award size={32} className="text-primary" />
            </div>
            <p className="text-gray-400">Accuracy: {totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0}%</p>
          </div>
          <button 
            onClick={startGame}
            className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      )}
      
      {gameState === "playing" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="bg-white py-2 px-4 rounded-lg border border-primary-border">
              <span className="font-semibold text-charcoal">Score: {score}</span>
            </div>
            <div className="bg-white py-2 px-4 rounded-lg flex items-center gap-2 border border-primary-border">
              <Timer size={18} className="text-primary" />
              <span className="font-semibold text-charcoal">{timeLeft}s</span>
            </div>
          </div>
          
          {/* Finger spelling visualization */}
          <div className="bg-white p-6 rounded-lg mb-6 shadow-md border border-primary-border">
            <div className="flex justify-center items-center h-64 bg-primary-light rounded-lg mb-4">
              {/* Here we'd typically show an image/animation of the finger spelled letter */}
              <div className="text-center">
                <div className="text-8xl mb-4">
                  {/* Show appropriate hand sign emoji based on the current letter */}
                  {currentWord[currentLetterIndex] === 'a' ? '👌' : 
                   currentWord[currentLetterIndex] === 'e' ? '☝️' : 
                   currentWord[currentLetterIndex] === 'i' ? '👆' : 
                   currentWord[currentLetterIndex] === 'o' ? '👍' : 
                   currentWord[currentLetterIndex] === 'u' ? '👎' : '👋'}
                </div>
                <div className="text-xl text-charcoal">
                  Finger spelling letter {currentLetterIndex + 1} of {currentWord.length}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 w-full max-w-md">
                <input
                  type="text"
                  placeholder="Type the word you see being spelled..."
                  className="w-full py-3 px-4 rounded-lg bg-primary-light text-charcoal border border-primary-border focus:outline-none focus:ring-2 focus:ring-primary"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                />
              </div>
              <button 
                onClick={checkAnswer}
                className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-lg transition"
              >
                Check Answer
              </button>
            </div>
          </div>
          
          {/* Feedback message */}
          {feedback && (
            <div className={`mt-4 p-4 rounded-lg flex items-center justify-center gap-3 ${
              feedback === "correct" ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {feedback === "correct" ? (
                <>
                  <Check size={20} className="text-green-600" />
                  <span className="text-green-800">Correct! Get ready for the next word...</span>
                </>
              ) : (
                <>
                  <X size={20} className="text-red-600" />
                  <span className="text-red-800">Not quite. The word was "{currentWord}". Try again!</span>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
