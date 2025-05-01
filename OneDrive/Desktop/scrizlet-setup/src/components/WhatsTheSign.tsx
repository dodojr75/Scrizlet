// src/components/WhatsTheSign.tsx
import React, { useState, useEffect } from 'react';
import { useSignContext, Sign } from '../contexts/SignLanguageContext';

export default function WhatsTheSign() {
  const { signs } = useSignContext();
  const [mode, setMode] = useState<'easy' | 'hard'>('easy');
  const [sign, setSign] = useState<Sign | null>(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setSign(signs[Math.floor(Math.random() * signs.length)]);
  }, [signs]);

  if (!sign) return null;

  // build easy mode choices
  const choices = ['easy']
    ? Array.from(
        new Set([
          sign.word,
          ...Array(2)
            .fill(null)
            .map(() => signs[Math.floor(Math.random() * signs.length)].word),
        ])
      ).sort(() => Math.random() - 0.5)
    : [];

  const check = () => {
    if (guess.trim().toLowerCase() === sign.word.toLowerCase())
      setFeedback('Correct!');
    else setFeedback(`Nope—it’s "${sign.word}"`);
  };

  return (
    <div>
      <h2>What’s the Sign?</h2>
      <div className="mb-4">
        <button
          onClick={() => setMode('easy')}
          className={mode === 'easy' ? 'font-bold' : ''}
        >
          Easy
        </button>
        <button
          onClick={() => setMode('hard')}
          className={mode === 'hard' ? 'font-bold ml-4' : 'ml-4'}
        >
          Hard
        </button>
      </div>
      <img src={sign.media} alt={sign.word} className="mb-4 mx-auto" />

      {mode === 'easy' ? (
        choices.map(opt => (
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
            placeholder="Type your guess"
            className="border p-2 mb-2 w-full"
          />
          <button onClick={check} className="px-4 py-2 bg-blue-500 text-white rounded">
            Submit
          </button>
        </>
      )}
      {feedback && <p className="mt-4">{feedback}</p>}
    </div>
  );
}
