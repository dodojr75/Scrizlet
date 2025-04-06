import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSignLanguage } from '../contexts/SignLanguageContext';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Play, RotateCcw } from 'lucide-react';

export default function FlashcardSet() {
  const { id } = useParams<{ id: string }>();
  const { getFlashcardSetById } = useSignLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [set, setSet] = useState<any>(null);
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    if (id) {
      const flashcardSet = getFlashcardSetById(id);
      setSet(flashcardSet);
    }
  }, [id, getFlashcardSetById]);

  if (!set) {
    return <div className="flex justify-center items-center h-full">Loading flashcard set...</div>;
  }

  const handleNext = () => {
    if (currentIndex < set.terms.length - 1) {
      setHistory([...history, currentIndex]);
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setHistory([...history, currentIndex]);
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };

  const handlePreviousSign = () => {
    if (history.length > 0) {
      const prevIndex = history[history.length - 1];
      setCurrentIndex(prevIndex);
      setHistory(history.slice(0, -1));
      setFlipped(false);
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-charcoal">{set.title}</h1>
        <div>
          <Link 
            to={`/learn/${id}`}
            className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg flex items-center gap-2 transition"
          >
            <Play size={16} />
            <span>Learn</span>
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg mb-8 shadow-md border border-primary-border">
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Card {currentIndex + 1} of {set.terms.length}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handlePreviousSign}
              disabled={history.length === 0}
              className={`text-primary flex items-center gap-1 ${
                history.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-primary-dark'
              }`}
            >
              <ArrowLeft size={16} />
              Previous Sign
            </button>
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
          onClick={handleFlip}
        >
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
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentIndex === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white hover:bg-primary-light text-charcoal border border-primary-border'
            }`}
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          
          <button 
            onClick={handleNext}
            disabled={currentIndex === set.terms.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentIndex === set.terms.length - 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white hover:bg-primary-light text-charcoal border border-primary-border'
            }`}
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4 text-charcoal">All Terms ({set.terms.length})</h2>
        <div className="space-y-3">
          {set.terms.map((term: any, index: number) => (
            <div 
              key={index}
              className={`bg-white p-4 rounded-lg flex justify-between items-center shadow-sm border ${
                index === currentIndex ? 'border-primary' : 'border-primary-border'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <div className="flex items-center gap-3">
                <span className="text-charcoal">{term.term}</span>
              </div>
              <span className="text-gray-600">{term.definition}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
