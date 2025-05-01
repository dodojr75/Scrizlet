// src/components/SavedItems.tsx

import React, { useState, useEffect } from 'react';
// Import React and two hooks:
//   - useState to hold component state (the list of saved items here)
//   - useEffect to perform side-effects (loading from localStorage on mount)

import { useSignContext, Sign } from '../contexts/SignLanguageContext';
// Import our custom context hook to access shared sign data/functions,
// and the Sign type (which describes the shape of a sign object)

export default function SavedItems() {
  // Define and export the SavedItems component

  const { signs, saveSign } = useSignContext();
  // Destructure from context:
  //   - signs: the full list of all available signs
  //   - saveSign: function to add a sign to saved list (not used here but available)

  const [items, setItems] = useState<Sign[]>([]);
  // State variable "items" holds the array of saved Sign objects.
  // Initialized as an empty array until we load actual saved items.

  useEffect(() => {
    // This effect runs once after the component first renders.

    const saved: Sign[] = JSON.parse(
      localStorage.getItem('savedSigns') || '[]'
    );
    // Attempt to read the 'savedSigns' entry from localStorage.
    // If nothing is stored, fall back to the JSON string '[]'.
    // Parse the JSON string into a JavaScript array of Sign objects.

    setItems(saved);
    // Store the parsed array in state, causing the component to re-render
    // and display the saved items.

  }, []);
  // Empty dependency array means this effect runs only on the first render.

  const remove = (word: string) => {
    // Define a function to remove an item by its word property.

    const updated = items.filter(i => i.word !== word);
    // Filter out any Sign whose .word matches the one to remove.
    // This produces a new array without that sign.

    setItems(updated);
    // Update state so the UI reflects the removal immediately.

    localStorage.setItem(
      'savedSigns',
      JSON.stringify(updated)
    );
    // Also write the updated array back to localStorage so the change persists.
  };

  return (
    <div>
      <h2>Saved Signs</h2>
      {/* Section title */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 
          Use a CSS grid:
            - 2 columns on small screens
            - 4 columns on medium and larger screens
            - gap-4 adds spacing between grid items
        */}

        {items.map(sign => (
          // Map over each saved Sign object in state

          <div key={sign.word}>
            {/* Use sign.word as a unique key for list rendering */}

            <p>{sign.word}</p>
            {/* Display the word of the sign */}

            <img src={sign.media} alt={sign.word} />
            {/* Show the GIF or image for that sign */}

            <button onClick={() => remove(sign.word)}>
              {/* When clicked, call remove() passing the word of this sign */}

              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
