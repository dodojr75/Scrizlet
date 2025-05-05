

import { useNavigate } from 'react-router-dom';
// └── useNavigate allows you to programmatically change routes without page reload.

import { useSignLanguage, Sign } from '../contexts/SignLanguageContext';
// └── Pulls in your custom hook `useSignLanguage` and the `Sign` type:
//     • `useSignLanguage()` gives access to `savedItems` and `removeSavedItem`.
//     • `Sign` describes the shape of each sign (id, term, gif, definition, etc.).

import { BookmarkCheck } from 'lucide-react';
// └── Icon component to show a filled bookmark for saved state.

export default function SavedItems() {
  // └── React component to display and manage user’s saved signs.
  const { savedItems, removeSavedItem } = useSignLanguage();
  const navigate = useNavigate();

  // ───────────────────────────────────────────────────────────────────
  // If no signs are saved, show an empty-state with a navigation button
  // ───────────────────────────────────────────────────────────────────
  if (savedItems.length === 0) {
    return (
      <div className="p-4 text-center">
        {/* Inform the user they haven’t saved anything yet */}
        <p className="text-lg">You haven’t saved any signs yet.</p>

        {/* Button to navigate back to the dictionary */}
        <button
          onClick={() => navigate('/dictionary')}
          className="text-primary mt-2 inline-block"
        >
          Browse Dictionary →
        </button>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────
  // Otherwise, render a grid of saved sign cards that are fully clickable
  // ───────────────────────────────────────────────────────────────────
  return (
    <div className="p-4">
      {/* Section heading */}
      <h2 className="text-2xl font-semibold mb-4">Saved Signs</h2>

      {/* Responsive grid: stacks columns based on screen size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {savedItems.map((sign: Sign) => (
          // Entire card is a button to navigate to the SignViewer
          <button
            key={sign.id}
            onClick={() => navigate(`/sign/${sign.id}`)}
            className="bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer hover:shadow-md transition-border border border-transparent hover:border-primary text-left"
          >
            <div className="flex justify-between items-center mb-2">
              {/* Term name displayed as text */}
              <span className="font-medium text-primary">{sign.term}</span>

              {/* Remove from saved button */}
              <button
                onClick={e => {
                  e.stopPropagation();  // Prevent the card-click navigation
                  removeSavedItem(sign.id);
                }}
                title="Remove from saved"
                className="p-1 rounded-full text-primary hover:text-primary-dark"
              >
                <BookmarkCheck size={20} />
              </button>
            </div>

            {/* Optional definition (no GIF to keep list clean) */}
            {sign.definition && (
              <p className="text-sm text-charcoal">{sign.definition}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
