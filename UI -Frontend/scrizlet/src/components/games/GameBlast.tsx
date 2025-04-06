import { useState, useEffect } from 'react';
import { useSignLanguage } from '../contexts/SignLanguageContext';
import { CircleCheck, Timer, CircleX } from 'lucide-react';

export default function GameBlast() {
  const { allTerms } = useSignLanguage();
  const [currentSign, setCurrentSign] = useState<any>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);

  // Start the game
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    nextQuestion();
  };

  // Get next question
  const nextQuestion = () => {
    if (allTerms.length < 4) return; // Need at least 4 terms for the game
    
    // Select a random sign
    const randomIndex = Math.floor(Math.random() * allTerms.length);
    const sign = allTerms[randomIndex];
    setCurrentSign(sign);
    
    // Create options (1 correct, 3 wrong)
    const correctAnswer = sign.definition;
    const wrongAnswers = allTerms
      .filter(t => t.id !== sign.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(t => t.definition);
    
    // Combine and shuffle
    const allOptions = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setFeedback(null);
  };

  // Handle answer selection
  const handleAnswer = (answer: string) => {
    if (!isPlaying) return;
    
    const isCorrect = answer === currentSign.definition;
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback({ correct: true, message: "Correct!" });
    } else {
      setFeedback({ correct: false, message: `Incorrect. The answer was "${currentSign.definition}"` });
    }
    
    // Wait a moment to show feedback before next question
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  // Timer effect
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Sign Language Blast</h1>
        <p className="text-gray-400">
          Quickly identify the correct meaning of each sign before time runs out!
        </p>
      </div>
      
      {!isPlaying && timeLeft === 30 && (
        <div className="bg-[#1a174d] p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Ready to Play?</h2>
          <p className="mb-6">Match the sign with its correct meaning as quickly as possible!</p>
          <button 
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition"
          >
            Start Game
          </button>
        </div>
      )}
      
      {!isPlaying && timeLeft === 0 && (
        <div className="bg-[#1a174d] p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Game Over!</h2>
          <p className="text-3xl font-bold mb-6">Your score: {score}</p>
          <button 
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition"
          >
            Play Again
          </button>
        </div>
      )}
      
      {isPlaying && currentSign && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="bg-[#1a174d] py-2 px-4 rounded-lg">
              <span className="font-semibold">Score: {score}</span>
            </div>
            <div className="bg-[#1a174d] py-2 px-4 rounded-lg flex items-center gap-2">
              <Timer size={18} />
              <span className="font-semibold">{timeLeft}s</span>
            </div>
          </div>
          
          <div className="bg-[#1a174d] p-6 rounded-lg mb-6">
            <div className="flex justify-center items-center h-64 bg-[#252153] rounded-lg mb-4">
              <div className="text-8xl">{currentSign.emoji || '👋'}</div>
            </div>
            <h3 className="text-xl font-semibold text-center">What does this sign mean?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="bg-[#252153] hover:bg-[#2c2a55] transition py-4 px-6 rounded-lg text-left"
                disabled={feedback !== null}
              >
                {option}
              </button>
            ))}
          </div>
          
          {feedback && (
            <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
              feedback.correct ? 'bg-green-900/50' : 'bg-red-900/50'
            }`}>
              {feedback.correct ? (
                <CircleCheck size={20} className="text-green-400" />
              ) : (
                <CircleX size={20} className="text-red-400" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
