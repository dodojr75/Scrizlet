// src/components/Dictionary.tsx
import React, { useState, useEffect } from 'react';
import { useSignContext, Sign } from '../contexts/SignLanguageContext';

export default function Dictionary() {
  const { signs, viewSign, saveSign } = useSignContext();
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Sign[]>(signs);
  const [active, setActive]   = useState<string | null>(null); // word currently “playing”

  /* ----------------------------------------------------------------
     Filter by search
  ---------------------------------------------------------------- */
  useEffect(() => {
    setFiltered(
      signs.filter(s =>
        s.word.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, signs]);

  /* ----------------------------------------------------------------
     Render
  ---------------------------------------------------------------- */
  return (
    <div>
      <h2 className="text-2xl mb-4">Dictionary</h2>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search signs..."
        className="border p-2 mb-6 w-full"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map(sign => {
          const isActive = active === sign.word;
          return (
            <div
              key={sign.word}
              className="border p-3 rounded cursor-pointer"
              onClick={() => {
                // show GIF only when clicked
                setActive(isActive ? null : sign.word);
                viewSign(sign); // log view
              }}
            >
              <p className="font-semibold mb-2">{sign.word}</p>

              {/* Thumbnail vs. GIF */}
              {isActive ? (
                <img
                  src={sign.media}
                  alt={sign.word}
                  className="w-full h-auto mb-2"
                />
              ) : (
                <div className="w-full aspect-video bg-gray-200 flex items-center justify-center mb-2">
                  <span className="text-sm text-gray-600">click to play</span>
                </div>
              )}

              <button
                onClick={e => {
                  e.stopPropagation();
                  saveSign(sign);
                }}
                className="px-2 py-1 bg-green-500 text-white rounded"
              >
                Save
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
