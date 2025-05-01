import React, { useState, useEffect } from 'react';
// Import React and two hooks:
//   - useState to hold component state
//   - i honetslty dont know why we useEffect to run side-effects (like reading/writing localStorage)

import { useSignContext, Sign } from '../contexts/SignLanguageContext';
// Import our custom hook to access shared sign data,
// and the Sign type (word, media, usesNonDominantHand)

export default function SignOfTheDay() {
  // Define and export the SignOfTheDay component

  const { signs } = useSignContext();
  // Grab the full array of all sign objects from context

  const [today, setToday] = useState<Sign | null>(null);
  // Declare state "today":
  //   - will hold the Sign object picked for today
  //   - starts as null until we load or generate it

  useEffect(() => {
    // This side-effect runs once on mount (and whenever 'signs' changes)

    const stored = JSON.parse(
      localStorage.getItem('signOfTheDay') || 'null'
    );
    // Trys to read a "signOfTheDay" entry from localStorage.
    // If nothing is there, fallback to null.

    const now = new Date().toDateString();
    // Get today's date in a human-readable string, e.g. "Wed Apr 30 2025"

    if (stored?.date === now) {
      // If we already saved a sign for today...
      setToday(stored.sign);
      // ...use that saved sign so it stays consistent all day
    } else {
      // Otherwise, we need to pick a fresh sign
      const sign =
        signs[Math.floor(Math.random() * signs.length)];
      // Math.random() * signs.length gives a random index,
      // Math.floor(...) converts to an integer,
      // signs[...] picks that random sign object

      localStorage.setItem(
        'signOfTheDay',
        JSON.stringify({ date: now, sign })
      );
      // Save an object { date: today, sign: chosenSign } into localStorage,
      // so next time we load we’ll reuse the same sign

      setToday(sign);
      // Update state with the new sign so the UI will render it
    }
  }, [signs]);
  // The dependency array [signs] means this effect re-runs if
  // the signs array itself ever changes (e.g., new data loaded)

  if (!today) return null;
  // While 'today' is still null (before useEffect runs), render nothing
  // This prevents errors trying to access today.word or today.media

  // Once 'today' is set, render the Sign of the Day
  return (
    <div>
      <h2>Sign of the Day</h2>
      {/* Title of this section */}

      <p>{today.word}</p>
      {/* Display the  word for today’s sign */}

      <img src={today.media} alt={today.word} />
      {/* Show the GIF/image for the sign (from the URL in today.media) */}

      <p>Daily Sign to Learn</p>
      {/* A friendly subtitle or prompt */}
    </div>
  );
}
