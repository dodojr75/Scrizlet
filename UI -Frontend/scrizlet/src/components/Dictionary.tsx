import { useState } from 'react';
import { useSignLanguage } from '../contexts/SignLanguageContext';
import { Search } from 'lucide-react';

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchResults, searchSigns } = useSignLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchSigns(searchTerm);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4 text-charcoal">Sign Language Dictionary</h1>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search for a sign (e.g., hello, thank you, love)"
            className="w-full py-3 px-4 pr-12 rounded-lg bg-primary-light text-charcoal border border-primary-border focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-3 text-primary hover:text-primary-dark">
            <Search size={24} />
          </button>
        </form>
      </div>

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {searchResults.map((sign) => (
            <div key={sign.id} className="bg-white p-4 rounded-lg flex flex-col shadow-md border border-primary-border">
              <div className="mb-4 bg-primary-light rounded-lg p-3 h-48 flex items-center justify-center">
                {/* This would typically be an image or video of the sign */}
              </div>
              <h3 className="text-xl font-semibold mb-1 text-charcoal">{sign.term}</h3>
              <p className="text-charcoal mb-2">{sign.definition}</p>
              <div className="mt-auto pt-2 border-t border-primary-border">
                <span className="text-sm text-primary">Click to see video demonstration</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2 text-charcoal">Search for sign language terms</h2>
          <p className="text-gray-600">
            Type a word or phrase to see how it's signed in sign language
          </p>
        </div>
      )}

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-primary-border">
        <h2 className="text-xl font-semibold mb-4 text-charcoal">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {["Numbers", "Greetings", "Family", "Colors", "Food", "Animals", "Weather", "Emotions", "Time", "Places", "Questions"].map(category => (
            <button 
              key={category} 
              className="bg-primary-light hover:bg-primary-border transition p-3 rounded-lg text-center text-primary-dark"
              onClick={() => setSearchTerm(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
