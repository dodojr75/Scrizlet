import React, { useState } from 'react';
// └── React core + the useState hook for managing local component state.

import { useSignLanguage, Sign, Letter } from '../contexts/SignLanguageContext';
// └── Custom context hook + TypeScript types:
//      • useSignLanguage(): gives you data (signs, letters) & actions (save/remove).
//      • Sign, Letter: types for your sign and letter objects.

import { Bookmark, BookmarkCheck } from 'lucide-react';
// └── Two icons: outline vs. filled bookmark for “save” / “saved”.

import { useNavigate } from 'react-router-dom';
// └── Hook to programmatically change the URL (navigate to detail pages).

export default function Dictionary() {
  // ——— Context data & actions ———
  const {
    signs,           // Array<Sign>: all the sign entries you’ve defined
    letters,         // Array<Letter>: images for A–Z fingerspelling
    saveItem,        // (sign: Sign) => void: add a sign to “favorites”
    removeSavedItem, // (id: string) => void: remove from “favorites”
    isItemSaved      // (id: string) => boolean: check if already saved
  } = useSignLanguage();

  // ——— Local state ———
  const [searchTerm, setSearchTerm] = useState('');
  // • searchTerm: current text in the search field
  // • setSearchTerm: update it on every keystroke

  const [submittedTerm, setSubmittedTerm] = useState<string | null>(null);
  // • submittedTerm: holds the text when the user presses Enter,
  //   so we only show “no results” after a deliberate search.

  // ——— Navigation hook ———
  const navigate = useNavigate();
  // • navigate(url: string): lets us go to “/sign/{id}” on click

  /**
   * When a user clicks a sign “card,” navigate to its detail page.
   */
  const handleSignClick = (id: string) => {
    navigate(`/sign/${id}`);
  };

  // ——— Filter logic ———
  /**
   * Only keep signs whose term includes the searchTerm
   * (case‑insensitive).
   */
  const filtered = signs.filter(s =>
    s.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ——— Grouping logic ———
  /**
   * Group filtered signs by their first letter:
   * e.g. { A: […], B: […], … }
   */
  const grouped = filtered.reduce((acc: Record<string, Sign[]>, sign) => {
    const letter = sign.term[0].toUpperCase();
    // Use 'letter' variable as the key for grouping
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(sign);
    return acc;
  }, {});

  // ——— “No results” logic ———
  /**
   * Show fingerspelling only when:
   * 1) User hit Enter (submittedTerm === searchTerm)
   * 2) They typed something (trim() > 0)
   * 3) There were 0 matches (filtered.length === 0)
   */
  const noResults =
    submittedTerm === searchTerm &&
    searchTerm.trim().length > 0 &&
    filtered.length === 0;

  // ——— Render ———
  return (
    <div className="p-4">
      {/* Page title */}
      <h2 className="text-2xl font-semibold mb-4">Dictionary</h2>

      {/* ——— Search input ——— */}
      <input
        type="text"
        placeholder="Search signs and press Enter..."
        value={searchTerm} // controlled input
        onChange={e => {
          setSearchTerm(e.target.value); // update on each keystroke
          setSubmittedTerm(null);        // clear submittedTerm until next Enter
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();           // stop default form behavior
            setSubmittedTerm(searchTerm); // mark this term as “submitted”
          }
        }}
        className="border p-2 mb-4 w-full rounded"
      />

      {/* ——— No‑results fingerspelling view ——— */}
      {noResults ? (
        <>
          <p className="text-center text-gray-600 mb-6">
            No entries for “{searchTerm}.” Here’s how it’s fingerspelled:
          </p>

          <div className="flex justify-center items-center gap-2 overflow-x-auto py-3 mb-6">
            {searchTerm.toUpperCase().split('').map((ltr, idx) => {
              // Find the letter image or fallback to text
              const letterObj = letters.find(l => l.letter === ltr);

              return (
                <div
                  key={idx}
                  className="
                    flex-shrink-0
                    w-24 h-24
                    rounded-lg
                    border border-primary-border
                    bg-white
                    flex items-center justify-center
                    shadow-sm
                  "
                >
                  {letterObj ? (
                    <img
                      src={letterObj.image}
                      alt={ltr}
                      className="h-20 w-20 object-contain"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-charcoal">
                      {ltr}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* ——— Standard grouped list view ——— */
        Object.keys(grouped)
          .sort()
          .map(letter => (
            <div key={letter} className="mb-6">
              {/* Letter header */}
              <h3 className="text-xl font-bold border-b pb-1 mb-2">
                {letter}
              </h3>

              {/* Grid of sign cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {grouped[letter].map(sign => (
                  <div
                    key={sign.id}
                    className="
                      bg-white rounded-lg shadow p-4
                      flex flex-col cursor-pointer
                      hover:shadow-md transition duration-200
                      border border-transparent hover:border-primary
                    "
                    onClick={() => handleSignClick(sign.id)}
                  >
                    {/* Top row: term + bookmark */}
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-primary">
                        {sign.term}
                      </span>

                      {/* Save/Unsave button */}
                      <button
                        onClick={e => {
                          e.stopPropagation(); // don’t trigger card click
                          if (isItemSaved(sign.id)) {
                            removeSavedItem(sign.id);
                          } else {
                            saveItem(sign);
                          }
                        }}
                        title={isItemSaved(sign.id) ? 'Remove' : 'Save'}
                        className="p-1 rounded-full"
                      >
                        {isItemSaved(sign.id) ? (
                          <BookmarkCheck size={20} />
                        ) : (
                          <Bookmark size={20} />
                        )}
                      </button>
                    </div>

                    {/* Optional definition */}
                    {sign.definition && (
                      <p className="mt-2 text-sm">{sign.definition}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  );
}

/*
  ——— Comment Summary ———
  Imports:
  • React, useState: React basics + state management.
  • useSignLanguage: Custom hook providing data & actions.
  • Bookmark icons: Visual cues for saving items.
  • useNavigate: For jumping to detail screens.

  State:
  • searchTerm: current text in the search bar.
  • submittedTerm: used to trigger “no results” feedback only after Enter.

  Data Preparation:
  1. filtered: filter all signs by searchTerm (case-insensitive).
  2. grouped: bucket filtered signs by first letter for section headers.
  3. noResults: true when user pressed Enter, term non-empty, but filtered array is empty.

  JSX Structure:
  • Container <div>: padding wrapper.
  • <h2>: page title.
  • <input>: search box (updates searchTerm, sets submittedTerm on Enter).
  • Conditional:
      – If noResults: show a message + fingerspelling visualization.
      – Else: loop through each letter group:
         • <h3>: letter heading.
         • Grid of “cards”:
             – Card click navigates to sign detail.
             – Top row: term + save/remove button (with stopPropagation).
             – Optional definition below.

  Key Functions & Concepts:
  • handleSignClick: navigate to `/sign/{id}`.
  • isItemSaved/removeSavedItem/saveItem: manage bookmark state.
  • e.stopPropagation(): keep button clicks from triggering card clicks.
*/
