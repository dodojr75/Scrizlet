//THIS DOES NOTHING IT IS NOT ROUTED UP POTATO POTATO BLEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
/*
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSignLanguage } from '../contexts/SignLanguageContext';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, CircleCheck, CircleX, Clock, List, Maximize, Minimize, RotateCcw, Shuffle, Star } from 'lucide-react';

enum LearnMode {
  MULTIPLE_CHOICE = 'multiple_choice',
  WRITTEN = 'written',
  FLASHCARD = 'flashcard'
}

interface TermStatus {
  id: string;
  mastered: boolean;
  attempts: number;
  correct: number;
}

export default function Learn() {
  const { id } = useParams<{ id: string }>();
  //const { getFlashcardSetById } = useSignLanguage();
  const [set, setSet] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<LearnMode>(LearnMode.FLASHCARD);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [flipped, setFlipped] = useState(false);
  const [termStatuses, setTermStatuses] = useState<TermStatus[]>([]);
  const [progress, setProgress] = useState(0);
  const [shuffled, setShuffled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const flashcardSet = getFlashcardSetById(id);
      setSet(flashcardSet);
      
      // Initialize term statuses for tracking progress
      if (flashcardSet) {
        setTermStatuses(
          flashcardSet.terms.map((term: any) => ({
            id: term.id,
            mastered: false,
            attempts: 0,
            correct: 0
          }))
        );
      }
    }
  }, [id, getFlashcardSetById]);

  useEffect(() => {
    if (set && set.terms.length > 0) {
      generateOptions();
    }
  }, [currentIndex, mode, set, shuffled]);

  useEffect(() => {
    // Calculate progress
    if (termStatuses.length > 0) {
      const masteredCount = termStatuses.filter(term => term.mastered).length;
      setProgress(Math.round((masteredCount / termStatuses.length) * 100));
    }
  }, [termStatuses]);

  const generateOptions = () => {
    if (!set || mode !== LearnMode.MULTIPLE_CHOICE) return;

    const correctAnswer = set.terms[currentIndex].definition;
    
    // Get 3 random incorrect options
    const otherOptions = set.terms
      .filter((_: any, index: number) => index !== currentIndex)
      .map((term: any) => term.definition)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // Combine and shuffle
    setOptions([correctAnswer, ...otherOptions].sort(() => 0.5 - Math.random()));
    setSelectedOption(null);
    setFeedback(null);
  };

  const handleNextTerm = () => {
    setFlipped(false);
    setFeedback(null);
    setSelectedOption(null);
    setUserAnswer('');
    
    if (shuffled) {
      // Pick a random term, prioritizing non-mastered terms
      const nonMasteredIndices = termStatuses
        .map((status, idx) => (!status.mastered ? idx : -1))
        .filter(idx => idx !== -1);
      
      if (nonMasteredIndices.length > 0) {
        // Pick from non-mastered terms
        const randomIndex = Math.floor(Math.random() * nonMasteredIndices.length);
        setCurrentIndex(nonMasteredIndices[randomIndex]);
      } else {
        // All terms mastered, just pick random
        setCurrentIndex(Math.floor(Math.random() * set.terms.length));
      }
    } else {
      // Just go to next term in sequence
      setCurrentIndex((currentIndex + 1) % set.terms.length);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (feedback !== null) return; // Already answered
    
    setSelectedOption(option);
    const isCorrect = option === set.terms[currentIndex].definition;
    setFeedback(isCorrect ? "correct" : "incorrect");
    
    // Update term status
    updateTermStatus(isCorrect);
    
    // Move to next term after a delay
    setTimeout(() => {
      handleNextTerm();
    }, 1500);
  };

  const handleWrittenAnswer = () => {
    if (feedback !== null) return; // Already answered
    
    const correctAnswer = set.terms[currentIndex].definition.toLowerCase();
    const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer;
    
    setFeedback(isCorrect ? "correct" : "incorrect");
    
    // Update term status
    updateTermStatus(isCorrect);
    
    // Move to next term after a delay
    setTimeout(() => {
      handleNextTerm();
    }, 2000);
  };

  const updateTermStatus = (isCorrect: boolean) => {
    setTermStatuses(prev => {
      return prev.map((status, idx) => {
        if (idx === currentIndex) {
          const newAttempts = status.attempts + 1;
          const newCorrect = status.correct + (isCorrect ? 1 : 0);
          // Mark as mastered if answered correctly twice
          const newMastered = newCorrect >= 2;
          
          return {
            ...status,
            attempts: newAttempts,
            correct: newCorrect,
            mastered: newMastered
          };
        }
        return status;
      });
    });
  };

  const toggleShuffle = () => {
    setShuffled(!shuffled);
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch(err => {
          console.error('Error attempting to enable fullscreen:', err);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch(err => {
          console.error('Error attempting to exit fullscreen:', err);
        });
      }
    }
  };
  
  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!set) {
    return <div className="flex justify-center items-center h-full">Loading flashcard set...</div>;
  }

  return (
    <div ref={containerRef} className={`${isFullscreen ? 'p-6 bg-white' : 'max-w-4xl mx-auto'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to={`/set/${id}`} className="text-primary hover:text-primary-dark">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-charcoal">Learn: {set.title}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white py-2 px-3 rounded-lg text-sm flex items-center gap-2 shadow-sm border border-primary-border">
            <Star size={16} className="text-accent-gold" />
            <span className="text-charcoal">Progress: {progress}%</span>
          </div>
          
          <button 
            onClick={toggleShuffle}
            className={`bg-white p-2 rounded-lg shadow-sm border border-primary-border ${shuffled ? 'text-primary' : 'text-gray-400'}`}
            title={shuffled ? 'Prioritize difficult terms' : 'Sequential order'}
          >
            <Shuffle size={18} />
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="bg-white p-2 rounded-lg shadow-sm border border-primary-border text-primary-dark"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>
      
      {/* Mode selector */
      /*
      <div className="bg-white p-4 rounded-lg mb-6 shadow-md border border-primary-border">
        <div className="flex gap-2">
          <button 
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
              mode === LearnMode.FLASHCARD ? 'bg-primary text-white' : 'bg-primary-light hover:bg-primary-border text-primary-dark'
            }`}
            onClick={() => setMode(LearnMode.FLASHCARD)}
          >
            <List size={16} />
            <span>Flashcards</span>
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
              mode === LearnMode.MULTIPLE_CHOICE ? 'bg-primary text-white' : 'bg-primary-light hover:bg-primary-border text-primary-dark'
            }`}
            onClick={() => setMode(LearnMode.MULTIPLE_CHOICE)}
          >
            <Check size={16} />
            <span>Multiple Choice</span>
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
              mode === LearnMode.WRITTEN ? 'bg-primary text-white' : 'bg-primary-light hover:bg-primary-border text-primary-dark'
            }`}
            onClick={() => setMode(LearnMode.WRITTEN)}
          >
            <Check size={16} />
            <span>Written</span>
          </button>
        </div>
      </div>
      *
      {/* Flashcard mode */
      /*
      {mode === LearnMode.FLASHCARD && (
        <div className="bg-white p-6 rounded-lg mb-6 shadow-md border border-primary-border">
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Card {currentIndex + 1} of {set.terms.length}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setFlipped(false)}
                className="text-primary hover:text-primary-dark flex items-center gap-1"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>
          
          <div 
            className={`h-72 w-full rounded-xl border border-primary-border flex items-center justify-center cursor-pointer p-6 relative ${
              flipped ? 'bg-primary-light' : 'bg-primary-light'
            }`}
            onClick={() => setFlipped(!flipped)}
          >
            {termStatuses[currentIndex]?.mastered && (
              <div className="absolute top-3 right-3 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Star size={12} />
                Mastered
              </div>
            )}
            
            <div className="text-center">
              {!flipped ? (
                <>
                  <h3 className="text-2xl font-semibold text-charcoal">{set.terms[currentIndex].term}</h3>
                  <p className="text-sm text-gray-600 mt-2">Click to see definition</p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-semibold mb-4 text-charcoal">{set.terms[currentIndex].definition}</h3>
                  <p className="text-sm text-gray-600">Click to see sign</p>
                </>
              )}
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <button 
              onClick={() => setCurrentIndex((currentIndex - 1 + set.terms.length) % set.terms.length)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-primary-border hover:bg-primary-light text-charcoal"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            
            <button 
              onClick={handleNextTerm}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-primary-border hover:bg-primary-light text-charcoal"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
      
      {/* Multiple choice mode */


      /*

      {mode === LearnMode.MULTIPLE_CHOICE && (
        <div className="bg-white p-6 rounded-lg mb-6 shadow-md border border-primary-border">
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Question {currentIndex + 1} of {set.terms.length}
            </div>
            {termStatuses[currentIndex]?.mastered && (
              <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Star size={12} />
                Mastered
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex justify-center items-center h-48 bg-primary-light rounded-lg mb-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-charcoal">{set.terms[currentIndex].term}</h3>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-4 text-center text-charcoal">What does this sign mean?</h3>
            
            <div className="space-y-3">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  className={`w-full p-3 rounded-lg text-left border ${
                    selectedOption === option 
                      ? feedback === "correct"
                        ? "bg-green-100 border-green-300 text-green-800"
                        : "bg-red-100 border-red-300 text-red-800"
                      : "bg-primary-light border-primary-border hover:bg-primary-border text-charcoal"
                  }`}
                  onClick={() => handleOptionSelect(option)}
                  disabled={feedback !== null}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {feedback && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              feedback === "correct" ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {feedback === "correct" ? (
                <>
                  <CircleCheck size={20} className="text-green-600" />
                  <span className="text-green-800">Correct!</span>
                </>
              ) : (
                <>
                  <CircleX size={20} className="text-red-600" />
                  <span className="text-red-800">Incorrect. The correct answer is "{set.terms[currentIndex].definition}"</span>
                </>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Written mode */

      /*
      {mode === LearnMode.WRITTEN && (
        <div className="bg-white p-6 rounded-lg mb-6 shadow-md border border-primary-border">
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Question {currentIndex + 1} of {set.terms.length}
            </div>
            {termStatuses[currentIndex]?.mastered && (
              <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Star size={12} />
                Mastered
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex justify-center items-center h-48 bg-primary-light rounded-lg mb-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-charcoal">{set.terms[currentIndex].term}</h3>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-4 text-center text-charcoal">What does this sign mean?</h3>
            
            <div className="mb-4">
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-primary-light border border-primary-border focus:outline-none focus:ring-2 focus:ring-primary text-charcoal"
                placeholder="Type your answer..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleWrittenAnswer()}
                disabled={feedback !== null}
              />
            </div>
            
            <button
              className="w-full p-3 rounded-lg bg-primary hover:bg-primary-dark transition text-white"
              onClick={handleWrittenAnswer}
              disabled={feedback !== null}
            >
              Check Answer
            </button>
          </div>
          
          {feedback && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              feedback === "correct" ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {feedback === "correct" ? (
                <>
                  <CircleCheck size={20} className="text-green-600" />
                  <span className="text-green-800">Correct!</span>
                </>
              ) : (
                <>
                  <CircleX size={20} className="text-red-600" />
                  <span className="text-red-800">Incorrect. The correct answer is "{set.terms[currentIndex].definition}"</span>
                </>
              )}
            </div>
          )}
        </div>
      )}
      
    
      <div className="bg-white p-4 rounded-lg shadow-md border border-primary-border">
        <h3 className="font-semibold mb-2 flex items-center gap-2 text-charcoal">
          <Clock size={16} />
          Learning Progress
        </h3>
        
        <div className="h-2 bg-gray-100 rounded-full mb-4">
          <div 
            className="h-full bg-primary rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {termStatuses.map((status, idx) => (
            <div 
              key={idx}
              className={`w-full aspect-square flex items-center justify-center rounded-lg text-sm ${
                status.mastered 
                  ? 'bg-green-100 text-green-700'
                  : status.attempts > 0
                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    : 'bg-primary-light text-primary-dark'
              }`}
              onClick={() => {
                setCurrentIndex(idx);
                setFlipped(false);
                setFeedback(null);
                setSelectedOption(null);
                setUserAnswer('');
              }}
            >
              {status.mastered ? (
                <Star size={16} />
              ) : (
                idx + 1
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
*/