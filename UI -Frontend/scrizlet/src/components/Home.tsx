import { Link } from 'react-router-dom';
import { useSignLanguage } from '../contexts/SignLanguageContext';
import { ArrowRight, Plus, SquareUser } from 'lucide-react';

export default function Home() {
  const { flashcardSets } = useSignLanguage();
  
  return (
    <div className="space-y-8">
      {/* Project Title Banner */}
      <section className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-8 text-center mb-8 shadow-md">
        <div className="flex justify-center mb-2">
          <img src="https://mocha-cdn.com/0196080d-c44d-71ed-b0f6-2d14d6ec2a0c/scrizlet.png" alt="Scrizlet" className="h-12" />
        </div>
        <p className="text-lg text-white opacity-90">Your journey to sign language mastery begins here</p>
        <div className="flex justify-center mt-6 gap-4">
          <Link 
            to="/dictionary" 
            className="bg-white text-primary hover:bg-primary-light font-medium py-2 px-6 rounded-lg transition"
          >
            Explore Dictionary
          </Link>
          <Link 
            to="/games" 
            className="bg-primary-dark bg-opacity-50 hover:bg-opacity-70 text-white py-2 px-6 rounded-lg border border-white border-opacity-30 transition"
          >
            Play Games
          </Link>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-charcoal">Recents</h2>
        {flashcardSets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashcardSets.slice(0, 2).map(set => (
              <Link 
                key={set.id} 
                to={`/set/${set.id}`}
                className="bg-white p-4 rounded-lg hover:bg-primary-light transition flex gap-3 shadow-sm border border-primary-border"
              >
                <div className="bg-primary-light h-12 w-12 rounded flex items-center justify-center">
                  <SquareUser size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-charcoal">{set.title}</h3>
                  <p className="text-sm text-gray-600">{set.terms.length} terms • by {set.author}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg text-center shadow-md border border-primary-border">
            <p className="mb-4 text-charcoal">You haven't created any flashcard sets yet</p>
            <button className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg flex items-center gap-2 mx-auto transition">
              <Plus size={16} />
              <span>New Set</span>
            </button>
          </div>
        )}
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-charcoal">Popular Games</h2>
          <Link to="/games" className="text-primary hover:text-primary-dark flex items-center gap-1">
            View all games <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-primary-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary h-12 w-12 rounded-full flex items-center justify-center text-white">
                
              </div>
              <div>
                <h3 className="font-medium text-charcoal">Finger Spelling</h3>
                <p className="text-sm text-gray-600">Decode spelled words</p>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <Link to="/game/fingerspelling" className="text-primary hover:text-primary-dark transition flex items-center gap-1">
                Start <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-primary-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary h-12 w-12 rounded-full flex items-center justify-center text-white">
                
              </div>
              <div>
                <h3 className="font-medium text-charcoal">Learn Alphabet</h3>
                <p className="text-sm text-gray-600">Master ASL alphabet</p>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <Link to="/game/alphabet" className="text-primary hover:text-primary-dark transition flex items-center gap-1">
                Start <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-charcoal">Popular Sign Language Topics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["Numbers", "Greetings", "Family", "Colors", "Animals"].map(topic => (
            <div key={topic} className="bg-white p-4 rounded-lg hover:bg-primary-light transition cursor-pointer shadow-sm border border-primary-border">
              <h3 className="font-medium text-charcoal">{topic}</h3>
              <p className="text-sm text-gray-600">Learn essential {topic.toLowerCase()} signs</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
