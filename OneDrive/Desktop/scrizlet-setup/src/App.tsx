import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Dictionary from './components/Dictionary';
import SignOfTheDay from './components/SignOfTheDay';
import SavedItems from './components/SavedItems';
import PastSigns from './components/PastSigns';
import Learn from './components/Learn';
import TrainYourMind from './components/TrainYourMind';
import FingerspellingGame from './components/FingerspellingGame';
import WhatsTheSign from './components/WhatsTheSign';
import RapidSigns from './components/RapidSigns';
import { SignProvider } from './contexts/SignLanguageContext';

function App() {
  return (
    <SignProvider>
      <nav className="p-4 bg-gray-100">
        <NavLink to="/" className="mr-4">Home</NavLink>
        <NavLink to="/dictionary" className="mr-4">Dictionary</NavLink>
        <NavLink to="/learn" className="mr-4">Learn</NavLink>
        <NavLink to="/saved" className="mr-4">Saved</NavLink>
        <NavLink to="/past" className="mr-4">Past</NavLink>
        <NavLink to="/train" className="mr-4">Train</NavLink>
        <NavLink to="/games/fingerspelling" className="mr-4">Fingerspelling</NavLink>
        <NavLink to="/games/whatsthesign" className="mr-4">What's the Sign?</NavLink>
        <NavLink to="/games/rapid" className="mr-4">Rapid Signs</NavLink>
      </nav>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<SignOfTheDay />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/saved" element={<SavedItems />} />
          <Route path="/past" element={<PastSigns />} />
          <Route path="/train" element={<TrainYourMind />} />
          <Route path="/games/fingerspelling" element={<FingerspellingGame />} />
          <Route path="/games/whatsthesign" element={<WhatsTheSign />} />
          <Route path="/games/rapid" element={<RapidSigns />} />
        </Routes>
      </div>
    </SignProvider>
  );
}

export default App;
