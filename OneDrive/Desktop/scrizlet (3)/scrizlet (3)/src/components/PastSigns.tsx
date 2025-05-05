//THSI DOES NOTHING IT IS NOT ROUTED UP AT ALL  blewwwwwww potato potato potato potato potato 

import { useState, useEffect } from 'react';  
// 

import { useSignLanguage } from '../contexts/SignLanguageContext';  
// └── Custom hook to access saved‑items logic (save, remove, check) from context

import { Bookmark, BookmarkCheck, Clock } from 'lucide-react';  
// └── Icon components: empty bookmark, filled bookmark, and clock

import { Link } from 'react-router-dom';  
// └── Link component for client‑side navigation without full page reload

import { getSignInitial, getRecentSigns } from '../services/signLanguageService';  
// └── Service functions:
//     • getRecentSigns(limit) → returns an array of the last  viewed sign objects  
//     • getSignInitial(sign)    → returns the first letter  of a sign’s term

export default function PastSigns() {
  // └── Defines the PastSigns component, which shows a list or a placeholder.

  // Pull save/remove/check functions from our SignLanguageContext
  const { saveItem, removeSavedItem, isItemSaved } = useSignLanguage();

  // State to hold the array of recently viewed sign objects
  const [recentSigns, setRecentSigns] = useState<any[]>([]);

  // On mount, load up to 5 most recent signs from localStorage/service
  useEffect(() => {
    setRecentSigns(getRecentSigns(5));
  }, []);  
  // └── Empty dependency array → run once after first render

  // Toggles bookmarked state: if already saved, remove it; otherwise save it
  const toggleSave = (sign: any) => {
    if (isItemSaved(sign.id)) {
      removeSavedItem(sign.id);
    } else {
      saveItem(sign);
    }
  };

  // If there are no recent signs, show a friendly empty‑state card
  if (recentSigns.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-primary-border p-6 text-center">
        {/* Clock icon inside a circle to indicate “no history yet” */}
        <div className="mb-4 inline-flex bg-primary-light p-4 rounded-full">
          <Clock size={24} className="text-primary" />
        </div>
        {/* Main message */}
        <h2 className="text-lg font-semibold mb-2 text-charcoal">
          No recently viewed signs
        </h2>
        {/* Subtext */}
        <p className="text-gray-600 mb-4">
          Start exploring the dictionary to see your recently viewed signs here
        </p>
        {/* Button linking to dictionary page */}
        <Link
          to="/dictionary"
          className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg inline-flex items-center gap-2"
        >
          Explore Dictionary
        </Link>
      </div>
    );
  }

  // Otherwise, render the list of recent signs
  return (
    <div className="bg-white rounded-lg shadow-md border border-primary-border p-6">
      {/* Section header */}
      <h2 className="text-xl font-bold mb-4 text-charcoal">
        Recently Viewed Signs
      </h2>

      <div className="space-y-3">
        {recentSigns.map((sign, index) => (
          // Each row for a single sign
          <div
            key={index}
            className="flex items-center gap-4 py-2 border-b border-primary-border last:border-0"
          >
            {/* Circle with the sign’s initial letter */}
            <div className="bg-primary-light w-12 h-12 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold">
                {getSignInitial(sign)}
              </span>
            </div>

            {/* Sign term and save button */}
            <div className="flex-1">
              <div className="flex justify-between">
                {/* The sign’s name/term */}
                <h3 className="font-medium text-charcoal">{sign.term}</h3>

                {/* Bookmark toggle button */}
                <button
                  onClick={() => toggleSave(sign)}  
                  // preventPropagation not needed, rows aren’t clickable
                  className={`
                    p-1 rounded-full
                    ${isItemSaved(sign.id)
                      ? 'text-primary hover:text-primary-dark' 
                      : 'text-gray-400 hover:text-primary'
                    }
                  `}
                  title={
                    isItemSaved(sign.id) ? 'Remove bookmark' : 'Save bookmark'
                  }
                >
                  {isItemSaved(sign.id)
                    ? <BookmarkCheck size={16} />  // filled icon if saved
                    : <Bookmark size={16} />       // outline icon if not
                  }
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer link to browse full dictionary */}
      <div className="mt-4 text-center">
        <Link
          to="/dictionary"
          className="text-primary hover:text-primary-dark text-sm"
        >
          Browse all signs
        </Link>
      </div>
    </div>
  );
}

/*
  SUMMARY OF PASTSIGNS COMPONENT:

  • Imports:
    – React hooks (state, effect)
    – Context hooks (save/remove/check bookmark)
    – UI icons and Link for navigation
    – Service functions for retrieving recently viewed signs and their initials

    – recentSigns[]: holds up to  last-viewed sign 
    – On mount: calls getRecentSigns(5), stores results in recentSigns

  //toggleSave(sign):
    /// Uses isItemSaved to decide whether to call saveItem or removeSavedIte
*/
