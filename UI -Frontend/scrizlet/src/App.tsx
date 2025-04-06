import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Dictionary from './components/Dictionary';
import FlashcardSet from './components/FlashcardSet';
import GameFingerSpelling from './components/GameFingerSpelling';
import GameAlphabet from './components/GameAlphabet';
import GamesHub from './components/GamesHub';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Learn from './components/Learn';
import { SignLanguageProvider } from './contexts/SignLanguageContext';
import './index.css';

function App() {
  useEffect(() => {
    // Add Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <SignLanguageProvider>
      <Router>
        <div className="flex h-screen bg-white text-charcoal font-[Inter]">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dictionary" element={<Dictionary />} />
                <Route path="/set/:id" element={<FlashcardSet />} />
                <Route path="/games" element={<GamesHub />} />
                <Route path="/game/fingerspelling" element={<GameFingerSpelling />} />
                <Route path="/game/alphabet" element={<GameAlphabet />} />
                <Route path="/learn/:id" element={<Learn />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </SignLanguageProvider>
  );
}

export default App;
