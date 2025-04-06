import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Initial demo data
const initialSignData = {
  flashcardSets: [
    {
      id: "1",
      title: "ASL Basics",
      author: "SignQuiz",
      terms: [
        { id: "1", term: "Hello", definition: "Wave hand with palm facing outward" },
        { id: "2", term: "Thank you", definition: "Touch lips with fingertips, then extend hand outward" },
        { id: "3", term: "Please", definition: "Rub circular motion on chest with flat palm" },
        { id: "4", term: "Sorry", definition: "Make fist and rub circular motion on chest" },
        { id: "5", term: "Love", definition: "Cross arms over chest like hugging yourself" }
      ]
    },
    {
      id: "2",
      title: "ASL Family Terms",
      author: "SignQuiz",
      terms: [
        { id: "6", term: "Mother", definition: "Thumb to chin, fingers spread out" },
        { id: "7", term: "Father", definition: "Thumb to forehead, fingers spread out" },
        { id: "8", term: "Sister", definition: "Female sign + sibling sign on chin" },
        { id: "9", term: "Brother", definition: "Male sign + sibling sign on forehead" },
        { id: "10", term: "Baby", definition: "Cradle arms as if holding an infant" }
      ]
    }
  ]
};

// Define the context type
type SignLanguageContextType = {
  flashcardSets: any[];
  allTerms: any[];
  searchResults: any[];
  searchSigns: (query: string) => void;
  getFlashcardSetById: (id: string) => any;
};

// Create context
const SignLanguageContext = createContext<SignLanguageContextType | undefined>(undefined);

// Provider component
export const SignLanguageProvider = ({ children }: { children: ReactNode }) => {
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // Get all terms across all flashcard sets
  const allTerms = flashcardSets.flatMap(set => set.terms);

  useEffect(() => {
    // Load data from localStorage or use initial data
    const storedData = localStorage.getItem('signLanguageData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFlashcardSets(parsedData.flashcardSets);
    } else {
      setFlashcardSets(initialSignData.flashcardSets);
      // Save initial data to localStorage
      localStorage.setItem('signLanguageData', JSON.stringify(initialSignData));
    }
  }, []);

  // Search for signs
  const searchSigns = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const results = allTerms.filter(term => 
      term.term.toLowerCase().includes(lowerQuery) || 
      term.definition.toLowerCase().includes(lowerQuery)
    );
    
    setSearchResults(results);
  };

  // Get a flashcard set by id
  const getFlashcardSetById = (id: string) => {
    return flashcardSets.find(set => set.id === id);
  };

  const value = {
    flashcardSets,
    allTerms,
    searchResults,
    searchSigns,
    getFlashcardSetById
  };

  return (
    <SignLanguageContext.Provider value={value}>
      {children}
    </SignLanguageContext.Provider>
  );
};

// Custom hook to use the context
export const useSignLanguage = () => {
  const context = useContext(SignLanguageContext);
  if (context === undefined) {
    throw new Error('useSignLanguage must be used within a SignLanguageProvider');
  }
  return context;
};
