import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

export default function GamesHub() {
  // Game information with details
  const games = [
    {
      id: 'fingerspelling',
      name: 'Finger Spelling Challenge',
      description: 'Decode finger-spelled words and phrases to master a fundamental skill in sign language communication.',
      color: 'from-primary to-primary-dark',
      difficulty: 'Hard',
      skills: []
    },
    {
      id: 'alphabet',
      name: 'Learn the Alphabet',
      description: 'Master the sign language alphabet with interactive lessons, practice exercises and quizzes.',
      color: 'from-primary-dark to-primary',
      difficulty: 'Beginner',
      skills: []
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-3 text-charcoal">Sign Language Games</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Reinforce your sign language skills with these interactive games. Each game focuses on different aspects of sign language learning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {games.map((game) => (
          <div key={game.id} className="bg-white rounded-xl overflow-hidden flex flex-col shadow-md border border-primary-border">
            <div className={`bg-gradient-to-r ${game.color} p-6`}>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{game.name}</h2>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-charcoal mb-4">{game.description}</p>
              
              <div className="mt-auto">
                <div className="flex justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Difficulty:</span>
                    <span 
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        game.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                        game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-primary-light text-primary-dark'
                      }`}
                    >
                      {game.difficulty}
                    </span>
                  </div>
                </div>
                
                <Link 
                  to={`/game/${game.id}`}
                  className="w-full bg-primary hover:bg-primary-dark transition py-2 rounded-lg flex items-center justify-center gap-2 text-white"
                >
                  Play Game
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-primary-border">
        <div className="flex gap-4">
          <Link to="/dictionary" className="flex items-center gap-2 bg-white hover:bg-primary-light transition p-3 rounded-lg flex-1 justify-center border border-primary-border text-primary">
            <RotateCcw size={16} />
            Dictionary Practice
          </Link>
          <Link to="/" className="flex items-center gap-2 bg-white hover:bg-primary-light transition p-3 rounded-lg flex-1 justify-center border border-primary-border text-primary">
            <Sparkles size={16} />
            Create Custom Set
          </Link>
        </div>
      </div>
    </div>
  );
}
