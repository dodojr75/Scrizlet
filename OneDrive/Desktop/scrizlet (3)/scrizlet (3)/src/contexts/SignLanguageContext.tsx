// Import React and hooks needed for context and state management
import React, { createContext, useContext, useEffect, useState } from "react";

// 1) DATA MODEL

// Define the shape of a Sign object from the json rember
export type Sign = {
  id: string;           // unique identifier for each sign
  term: string;         // word or phrase this sign represents
  definition?: string;  // optional descriptive text for the sign
  gif: string;          // path or URL to the GIF animation
  type: "word";       // literal type 
};

// Define the shape of a Letter object
export type Letter = {
  id: string;           // unique identifier, e.g. "letter_A"
  letter: string;       // single character, e.g. "A"
  image: string;        // path or URL to the letter image
  type: "letter";     // literal type discriminator
};

// --------------------
// 2) CONTEXT VALUE SHAPE
// --------------------

// Describe exactly what data and functions we expose via context
type ContextType = {
  signs: Sign[];                 // array of all Sign entries
  letters: Letter[];             // array of all Letter entries
  savedItems: Sign[];            // array of bookmarked Sign entries
  saveItem: (item: Sign) => void;        // function to bookmark a sign
  removeSavedItem: (id: string) => void; // function to un-bookmark a sign by id
  isItemSaved: (id: string) => boolean;  // check if a sign is bookmarked
};
// Create the context with undefined initial value
const SignLanguageContext = createContext<ContextType | undefined>(undefined);
// this context will hold an  object holding a datatype but until its undefined
// --------------------
// 3) PROVIDER COMPONENT
// --------------------

// This component wraps your app and provides sign/letter data + actions
export const SignLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- State variables ---
  const [signs, setSigns] = useState<Sign[]>([]);       // holds Sign[] once loaded
  const [letters, setLetters] = useState<Letter[]>([]); // holds Letter[] once loaded
  const [savedItems, setSavedItems] = useState<Sign[]>([]); // holds user's saved bookmarks

  // --- useEffect to load data on mount ---
  useEffect(() => {
    // Fetch signData.json from public/data
    fetch("/data/signData.json")
      .then((res) => res.json())        // parse JSON response
      .then((data: Sign[]) => {         // cast to Sign[]
        setSigns(data);                 // store in state
      });
      // takes a string of text in JSON format and converts it into the
      // corresponding JavaScript value array.
  
      // Fetch alphabetData.json from public/data
    fetch("/data/alphabetData.json")
      .then((res) => res.json())      // parse JSON response
      .then((data: Letter[]) => {     // cast to Letter[]
        setLetters(data);             // store in state
      });

    // Load bookmarked signs from localStorage, if any
    const saved = localStorage.getItem("savedSigns");
    if (saved) {
      setSavedItems(JSON.parse(saved)); // restore saved array
    }
  }, []); // empty dependency array ensures this runs only once



  /**
   * saveItem: add a Sign to savedItems and persist to localStorage
   */
  const saveItem = (item: Sign) => {
    // Check for duplicate before adding
    if (!savedItems.find((s) => s.id === item.id)) {
      const updated = [...savedItems, item]; // new array with added sign
      setSavedItems(updated);                // update state
      localStorage.setItem("savedSigns", JSON.stringify(updated)); // persist
    }
  };

  /**
   * removeSavedItem: remove a Sign from savedItems by id
   */
  const removeSavedItem = (id: string) => {
    const updated = savedItems.filter((s) => s.id !== id); // remove matching id
    setSavedItems(updated);                                  // update state
    localStorage.setItem("savedSigns", JSON.stringify(updated)); // persist
  };

  /**
   * isItemSaved: check if a Sign id exists in savedItems
   */
  const isItemSaved = (id: string) => {
    return savedItems.some((s) => s.id === id); // true if any match
  };

  // --------------------
  // 5) PROVIDE CONTEXT VALUE
  // --------------------

  // Pass down both state and functions via Provider
  return (
    <SignLanguageContext.Provider
      value={{
        signs,             // all loaded signs
        letters,           // all loaded letters
        savedItems,        // user's bookmarked signs
        saveItem,          // function to bookmark
        removeSavedItem,   // function to un-bookmark
        isItemSaved,       // function to check bookmark
      }}
    >
      {children}         // render wrapped components
    </SignLanguageContext.Provider>
  );
};

// --------------------
// 6) CUSTOM HOOK FOR CONSUMERS
// --------------------

// A convenience hook so components don’t import useContext manually
export const useSignLanguage = (): ContextType => {
  const ctx = useContext(SignLanguageContext); // get context value
  if (!ctx) {                                   // if undefined,
    throw new Error("useSignLanguage must be used within SignLanguageProvider"); // enforce provider
  }
  return ctx;                                  // return typed context
};




  //this file is the single source of truth for all sign & letter data  

  // FETCH & STORE: loads JSON files into React state once at startup
  // BOOKMARK LOGIC: functions to save/remove/check user favorites  
  // makes data & actions available anywhere via useSignLanguage

