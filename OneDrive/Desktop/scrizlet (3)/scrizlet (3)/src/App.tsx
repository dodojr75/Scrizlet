// src/App.tsx

// ───────────────────────────────────────────────────────────────────────────────
// Imports
// ───────────────────────────────────────────────────────────────────────────────
import { useEffect } from 'react';                                           // React hook for side‑effects
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';   // Client‑side routing components
import Home from './components/Home';                                        // Your Home page component
import Dictionary from './components/Dictionary';                            // Dictionary page
import SignViewer from './components/SignViewer';                            // Single-sign detail view
import SavedItems from './components/SavedItems';                            // Saved/favorite signs page
import GamesHub from './components/GamesHub';                                // Index of games
import GameAlphabet from './components/GameAlphabet';                        // Alphabet learning game
import FingerSpellingGame from './components/FingerSpellingGame';            // Fingerspelling game
import RapidSigns from './components/RapidSigns';                            // Rapid-signs game
// import WhatsTheSignGame from './components/WhatsTheSignGame'; // removed

import Sidebar from './components/Sidebar';                                  // Site‑wide sidebar nav
import Header from './components/Header';                                    // Top bar (profile/settings)
import { SignLanguageProvider } from './contexts/SignLanguageContext';       // Provides global sign/letter data
import './index.css';                                                        // Tailwind & custom base styles

// ───────────────────────────────────────────────────────────────────────────────
// App Component
// ───────────────────────────────────────────────────────────────────────────────
export default function App() {
  // ─────────────────────────────────────────────────────────────────────────────
  // Side‑effect: Dynamically load Google “Inter” font
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Cleanup on unmount (remove the <link>)
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    // ┌──────────────────────────────────────────────────────────────────────────┐
    // │ Wrap everything in SignLanguageProvider so any child can access signs,  │
    // │ letters, and save/remove functionality via context.                     │
    // └──────────────────────────────────────────────────────────────────────────┘
    <SignLanguageProvider>

      {/* ┌────────────────────────────────────────────────────────────────────────┐ */}
      {/* │ BrowserRouter (aliased to Router) enables URL‑based rendering.       │ */}
      {/* └────────────────────────────────────────────────────────────────────────┘ */}
      <Router>

        {/* ┌──────────────────────────────────────────────────────────────────────┐ */}
        {/* │ Top‑level flex container fills the viewport (h‑screen) and sets up   │ */}
        {/* │ two columns: sidebar + main content.                                 │ */}
        {/* └──────────────────────────────────────────────────────────────────────┘ */}
        <div className="flex h-screen bg-white text-charcoal font-[Inter]">

          {/* ┌─────────────────────────────────────────────────────────────────────┐ */}
          {/* │ Sidebar: your navigation links (Dictionary, Games, Saved, etc.)    │ */}
          {/* └─────────────────────────────────────────────────────────────────────┘ */}
          <Sidebar />

          {/* ┌─────────────────────────────────────────────────────────────────────┐ */}
          {/* │ Main area: header + routable page content                          │ */}
          {/* └─────────────────────────────────────────────────────────────────────┘ */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* ┌─────────────────────────────────────────────────────────────────┐ */}
            {/* │ Header bar: sits at top of main area, can hold profile/settings │ */}
            {/* └─────────────────────────────────────────────────────────────────┘ */}
            <Header />

            {/* ┌─────────────────────────────────────────────────────────────────┐ */}
            {/* │ <main> is scrollable if content overflows vertically            │ */}
            {/* └─────────────────────────────────────────────────────────────────┘ */}
            <main className="flex-1 overflow-y-auto p-4">
              {/* ┌──────────────────────────────────────────────────────────────┐ */}
              {/* │ Define Routes: URL path → which component to render          │ */}
              {/* └──────────────────────────────────────────────────────────────┘ */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dictionary" element={<Dictionary />} />
                <Route path="/sign/:id" element={<SignViewer />} />
                <Route path="/saved" element={<SavedItems />} />
                <Route path="/games" element={<GamesHub />} />
                <Route path="/game/alphabet" element={<GameAlphabet />} />
                <Route
                  path="/game/fingerspelling"
                  element={<FingerSpellingGame />}
                />
                <Route path="/game/rapid" element={<RapidSigns />} />
                {/* What’s the Sign? route removed */}
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </SignLanguageProvider>
  );
}
