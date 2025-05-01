import React, { createContext, useContext, useState } from 'react';
import signsJson from '../assets/signs.json';
import commonSignsJson from '../assets/commonSigns.json';
import alphabetMapJson from '../assets/alphabetMap.json';
import wordsJson from '../assets/words.json';

export type Sign = { word: string; media: string; usesNonDominantHand: boolean; };

type ContextType = {
  signs: Sign[];
  commonSigns: { word: string; media: string }[];
  alphabetMap: Record<string, string>;
  words: string[];
  viewSign: (sign: Sign) => void;
  saveSign: (sign: Sign) => void;
};

const SignContext = createContext<ContextType | undefined>(undefined);

export const SignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signs] = useState<Sign[]>(signsJson);
  const [commonSigns] = useState<{ word: string; media: string }[]>(commonSignsJson);
  const [alphabetMap] = useState<Record<string, string>>(alphabetMapJson);
  const [words] = useState<string[]>(wordsJson);

  const viewSign = (sign: Sign) => {
    const past = JSON.parse(localStorage.getItem('pastSigns') || '[]');
    localStorage.setItem('pastSigns', JSON.stringify([sign, ...past]));
    const views = JSON.parse(localStorage.getItem('signViews') || '{}');
    views[sign.word] = (views[sign.word] || 0) + 1;
    localStorage.setItem('signViews', JSON.stringify(views));
  };

  const saveSign = (sign: Sign) => {
    const saved = JSON.parse(localStorage.getItem('savedSigns') || '[]');
    if (!saved.find((s: Sign) => s.word === sign.word)) {
      localStorage.setItem('savedSigns', JSON.stringify([...saved, sign]));
    }
  };

  return (
    <SignContext.Provider value={{ signs, commonSigns, alphabetMap, words, viewSign, saveSign }}>
      {children}
    </SignContext.Provider>
  );
};

export const useSignContext = () => {
  const context = useContext(SignContext);
  if (!context) throw new Error('useSignContext must be used within SignProvider');
  return context;
};
