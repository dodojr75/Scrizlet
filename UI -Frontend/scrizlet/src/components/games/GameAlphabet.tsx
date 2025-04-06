import { useState, useEffect } from 'react';
import { useSignLanguage } from '../contexts/SignLanguageContext';
import { ArrowRight, Check, RefreshCw, Shuffle, X } from 'lucide-react';

// Sign language alphabet data
const ALPHABET_SIGNS = [
  { letter: 'A', emoji: '👉' },
  { letter: 'B', emoji: '✋' },
  { letter: 'C', emoji: '👌' },
  { letter: 'D', emoji: '👍' },
  { letter: 'E', emoji: '☝️' },
  { letter: 'F', emoji: '👊' },
  { letter: 'G', emoji: '👇' },
  { letter: 'H', emoji: '✌️' },
  { letter: 'I', emoji: '🤙' },
  { letter: 'J', emoji: '🤟' },
  { letter: 'K', emoji: '👌' },
  { letter: 'L', emoji: '👍' },
  { letter: 'M', emoji: '✋' },
  { letter: 'N', emoji: '👊' },
  { letter: 'O', emoji: '👌' },
  { letter: 'P', emoji: '👉' },
  { letter: 'Q', emoji: '👇' },
  { letter: 'R', emoji: '✌️' },
  { letter: 'S', emoji: '✊' },
  { letter: 'T', emoji: '👍' },
  { letter: 'U', emoji: '🤘' },
  { letter: 'V', emoji: '✌️' },
  { letter: 'W', emoji: '👐' },
  { letter: 'X', emoji: '✊' },
  { letter: 'Y', emoji: '🤙' },
  { letter: 'Z', emoji: '👈' }
];

export default function GameAlphabet() {
  const [mode, setMode] = useState<"learn" | "practice" | "quiz">("learn");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [learnedLetters, setLearnedLetters] = useState<string[]>([]);

  // Navigate to next letter in learn mode
  const handleNext = () => {
    if (currentIndex < ALPHABET_SIGNS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed the alphabet
      setLearnedLetters(prev => {
        const newLearned = [...prev];
        if (!newLearned.includes(ALPHABET_SIGNS[currentIndex].letter)) {
          newLearned.push(ALPHABET_SIGNS[currentIndex].letter);
        }
        return newLearned;
      });
      setCurrentIndex(0);
    }
    
    // Mark current letter as learned
    setLearnedLetters(prev => {
      const newLearned = [...prev];
      if (!newLearned.includes(ALPHABET_SIGNS[currentIndex].letter)) {
        newLearned.push(ALPHABET_SIGNS[currentIndex].letter);
      }
      return newLearned;
    });
  };

  // Handle previous letter in learn mode
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Start practice mode
  const startPractice = () => {
    setMode("practice");
    setCurrentIndex(0);
  };

  // Start quiz mode
  const startQuiz = () => {
    setMode("quiz");
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    generateQuizOptions();
  };

  // Generate multiple choice options for quiz mode
  const generateQuizOptions = () => {
    const correctLetter = ALPHABET_SIGNS[currentIndex].letter;
    
    // Get 3 random incorrect options
    let incorrectOptions = ALPHABET_SIGNS
      .filter(sign => sign.letter !== correctLetter)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(sign => sign.letter);
    
    // Combine and shuffle
    const allOptions = [correctLetter, ...incorrectOptions].sort(() => 0.5 - Math.random());
    setQuizOptions(allOptions);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  // Handle answer selection in quiz mode
  const handleAnswerSelection = (letter: string) => {
    if (feedback !== null) return; // Already answered
    
    setSelectedAnswer(letter);
    const isCorrect = letter === ALPHABET_SIGNS[currentIndex].letter;
    setFeedback(isCorrect ? "correct" : "incorrect");
    
    // Update score
    setScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentIndex < ALPHABET_SIGNS.length - 1) {
        setCurrentIndex(currentIndex + 1);
        generateQuizOptions();
      } else {
        // Quiz completed - return to learn mode
        setMode("learn");
        setCurrentIndex(0);
      }
    }, 1500);
  };

  // Generate new options whenever currentIndex changes in quiz mode
  useEffect(() => {
    if (mode === "quiz") {
      generateQuizOptions();
    }
  }, [currentIndex, mode]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2 text-charcoal">Learn the Sign Language Alphabet</h1>
        <p className="text-gray-400">
          Master finger spelling one letter at a time!
        </p>
      </div>
      
      {/* Mode selector */}
      <div className="bg-white p-4 rounded-lg mb-6 shadow-md border border-primary-border">
        <div className="flex gap-2">
          <button 
            className={`flex-1 py-2 px-4 rounded-lg ${mode === "learn" ? 'bg-primary text-white' : 'bg-primary-light hover:bg-primary-border text-primary-dark'}`}
            onClick={() => setMode("learn")}
          >
            Learn
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-lg ${mode === "practice" ? 'bg-primary text-white' : 'bg-primary-light hover:bg-primary-border text-primary-dark'}`}
            onClick={startPractice}
          >
            Practice
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-lg ${mode === "quiz" ? 'bg-primary text-white' : 'bg-primary-light hover:bg-primary-border text-primary-dark'}`}
            onClick={startQuiz}
          >
            Quiz
          </button>
        </div>
      </div>
      
      {/* Learn mode */}
      {mode === "learn" && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary-border">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg text-charcoal">{currentIndex + 1} of {ALPHABET_SIGNS.length}</div>
            <div className="text-2xl font-bold text-charcoal">{ALPHABET_SIGNS[currentIndex].letter}</div>
          </div>
          
          <div className="flex justify-center items-center h-64 bg-primary-light rounded-lg mb-6">
            <div className="text-9xl">{ALPHABET_SIGNS[currentIndex].emoji}</div>
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2 text-charcoal">Letter {ALPHABET_SIGNS[currentIndex].letter}</h3>
            <p className="text-gray-400">
              The sign for letter {ALPHABET_SIGNS[currentIndex].letter} is shown above.
              Try to mimic this sign with your hand.
            </p>
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                currentIndex === 0 
                  ? 'bg-primary-light text-gray-500 cursor-not-allowed' 
                  : 'bg-primary-light hover:bg-primary-border text-primary-dark'
              }`}
            >
              Previous
            </button>
            <button 
              onClick={handleNext}
              className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg flex items-center gap-2 text-white"
            >
              {currentIndex === ALPHABET_SIGNS.length - 1 ? 'Start Over' : 'Next'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* Practice mode */}
      {mode === "practice" && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary-border">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-charcoal">Practice Mode</h3>
            <button 
              onClick={() => setCurrentIndex(Math.floor(Math.random() * ALPHABET_SIGNS.length))}
              className="flex items-center gap-2 bg-primary-light hover:bg-primary-border px-3 py-2 rounded-lg text-primary-dark"
            >
              <Shuffle size={16} />
              Random Letter
            </button>
          </div>
          
          <div className="flex justify-center items-center h-64 bg-primary-light rounded-lg mb-6">
            <div className="text-9xl">{ALPHABET_SIGNS[currentIndex].emoji}</div>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-lg mb-2 text-charcoal">What letter is this?</p>
            <div className="flex justify-center">
              <button 
                onClick={() => setSelectedAnswer(ALPHABET_SIGNS[currentIndex].letter)}
                className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg text-white"
              >
                Reveal Answer
              </button>
            </div>
          </div>
          
          {selectedAnswer && (
            <div className="bg-primary-light p-4 rounded-lg text-center mb-6">
              <h3 className="text-xl font-bold mb-2 text-primary-dark">Answer: {ALPHABET_SIGNS[currentIndex].letter}</h3>
              <button 
                onClick={() => {
                  setSelectedAnswer(null);
                  setCurrentIndex((currentIndex + 1) % ALPHABET_SIGNS.length);
                }}
                className="flex items-center gap-2 mx-auto bg-primary-light hover:bg-primary-border px-3 py-2 rounded-lg text-primary-dark"
              >
                <RefreshCw size={16} />
                Next Letter
              </button>
            </div>
          )}
          
          <div className="flex justify-center">
            <button 
              onClick={() => setMode("learn")}
              className="text-primary hover:text-primary-dark"
            >
              Back to Learning
            </button>
          </div>
        </div>
      )}
      
      {/* Quiz mode */}
      {mode === "quiz" && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary-border">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg text-charcoal">Question {currentIndex + 1} of {ALPHABET_SIGNS.length}</div>
            <div className="bg-primary-light py-1 px-3 rounded-lg text-primary-dark">
              Score: {score.correct}/{score.total}
            </div>
          </div>
          
          <div className="flex justify-center items-center h-64 bg-primary-light rounded-lg mb-6">
            <div className="text-9xl">{ALPHABET_SIGNS[currentIndex].emoji}</div>
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-4 text-charcoal">What letter does this sign represent?</h3>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {quizOptions.map((letter, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelection(letter)}
                  className={`text-xl font-bold py-4 rounded-lg ${
                    selectedAnswer === letter 
                      ? feedback === "correct"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                      : "bg-primary-light hover:bg-primary-border text-primary-dark"
                  }`}
                  disabled={feedback !== null}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
          
          {feedback && (
            <div className={`p-4 rounded-lg flex items-center justify-center gap-3 ${
              feedback === "correct" ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {feedback === "correct" ? (
                <>
                  <Check size={20} className="text-green-600" />
                  <span className="text-green-800">Correct!</span>
                </>
              ) : (
                <>
                  <X size={20} className="text-red-600" />
                  <span className="text-red-800">Incorrect. The correct answer is {ALPHABET_SIGNS[currentIndex].letter}</span>
                </>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Progress tracker */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md border border-primary-border">
        <h3 className="font-semibold mb-3 text-charcoal">Your Alphabet Progress</h3>
        <div className="grid grid-cols-13 gap-2">
          {ALPHABET_SIGNS.map((sign, index) => (
            <div 
              key={index}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${
                learnedLetters.includes(sign.letter) ? 'bg-primary text-white' : 'bg-primary-light text-primary-dark'
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setMode("learn");
              }}
            >
              {sign.letter}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
