// src/components/Learn.tsx
import React, { useState } from 'react';
import { useSignContext } from '../contexts/SignLanguageContext';

export default function Learn() {
  const { commonSigns } = useSignContext();
  const [mode, setMode] = useState<'mc' | 'typing'>('mc');
  const [idx, setIdx] = useState(0);
  const sign = commonSigns[idx];
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');

  const mcOptions = mode === 'mc'
    ? [
        sign.word,
        commonSigns[(idx + 1) % commonSigns.length].word,
        commonSigns[(idx + 2) % commonSigns.length].word,
      ].sort(() => Math.random() - 0.5)
    : [];

  const check = () => {
    if (guess.trim().toLowerCase() === sign.word.toLowerCase())
      setFeedback('Correct!');
    else setFeedback(`Nope—it’s "${sign.word}"`);
  };

  return (
    <div>
      <h2>Learn</h2>
      <div className="mb-4">
        <button
          onClick={() => setMode('mc')}
          className={mode === 'mc' ? 'font-bold' : ''}
        >
          Multiple Choice
        </button>
        <button
          onClick={() => setMode('typing')}
          className={mode === 'typing' ? 'font-bold ml-4' : 'ml-4'}
        >
          Typing
        </button>
      </div>
      <img src={sign.media} alt={sign.word} className="mb-4 mx-auto" />
      {mode === 'mc' ? (
        mcOptions.map(opt => (
          <button
            key={opt}
            onClick={() =>
              setFeedback(opt === sign.word ? 'Correct!' : `Nope—it’s "${sign.word}"`)
            }
            className="block w-full border p-2 rounded mb-2"
          >
            {opt}
          </button>
        ))
      ) : (
        <>
          <input
            value={guess}
            onChange={e => setGuess(e.target.value)}
            placeholder="Type the word"
            className="border p-2 w-full mb-2"
          />
          <button onClick={check} className="px-4 py-2 bg-blue-500 text-white rounded">
            Check
          </button>
        </>
      )}
      {feedback && <p className="mt-4">{feedback}</p>}
      <button
        onClick={() => {
          setIdx((idx + 1) % commonSigns.length);
          setGuess('');
          setFeedback('');
        }}
        className="mt-4 px-4 py-2 bg-gray-200 rounded"
      >
        Next
      </button>
    </div>
  );
}
