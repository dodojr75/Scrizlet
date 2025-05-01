// src/components/PastSigns.tsx
import React, { useState, useEffect } from 'react';
import { Sign } from '../contexts/SignLanguageContext';

export default function PastSigns() {
  const [past, setPast] = useState<Sign[]>([]);

  useEffect(() => {
    setPast(JSON.parse(localStorage.getItem('pastSigns') || '[]'));
  }, []);

  return (
    <div>
      <h2>Past Signs</h2>
      <div className="space-y-4">
        {past.map((sign, i) => (
          <div key={i} className="border p-2 rounded">
            <p className="font-semibold">{sign.word}</p>
            <img src={sign.media} alt={sign.word} />
          </div>
        ))}
      </div>
    </div>
  );
}
