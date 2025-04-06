import { AlignJustify, Book, Gamepad2, Hand, House, Menu, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [gamesExpanded, setGamesExpanded] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className={`bg-primary-dark ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center justify-between border-b border-primary">
        <Link to="/" className="flex items-center gap-2">
          {!collapsed ? (
            <img src="https://mocha-cdn.com/0196080d-c44d-71ed-b0f6-2d14d6ec2a0c/scrizlet.png" alt="Scrizlet" className="h-6" />
          ) : (
            <img src="https://mocha-cdn.com/0196080d-c44d-71ed-b0f6-2d14d6ec2a0c/scrizlet_logo.png" alt="Scrizlet" className="h-6" />
          )}
        </Link>
        <button onClick={() => setCollapsed(!collapsed)} className="text-white hover:text-primary-light">
          <Menu size={20} />
        </button>
      </div>
      
      <nav className="flex-1 p-2">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/"
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-primary transition ${
                isActive('/') ? 'bg-primary' : ''
              }`}
            >
              <House size={20} className="text-white" />
              {!collapsed && <span className="text-white">Home</span>}
            </Link>
          </li>
          <li>
            <Link 
              to="/dictionary"
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-primary transition ${
                isActive('/dictionary') ? 'bg-primary' : ''
              }`}
            >
              <Book size={20} className="text-white" />
              {!collapsed && <span className="text-white">Dictionary</span>}
            </Link>
          </li>
          <li>
            <Link 
              to="/games"
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-primary transition ${
                isActive('/games') || location.pathname.includes('/game') ? 'bg-primary' : ''
              }`}
            >
              <Gamepad2 size={20} className="text-white" />
              {!collapsed && <span className="text-white">Games</span>}
            </Link>
          </li>
          
          {!collapsed && location.pathname.includes('/game') && (
            <ul className="ml-6 mt-2 space-y-2">
              <li>
                <Link 
                  to="/game/fingerspelling"
                  className={`flex items-center gap-3 p-2 rounded-lg hover:bg-primary transition ${
                    isActive('/game/fingerspelling') ? 'bg-primary' : ''
                  }`}
                >
                  <span className="w-4 h-4 flex items-center justify-center text-xs text-white">✍️</span>
                  <span className="text-white">Finger Spelling</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/game/alphabet"
                  className={`flex items-center gap-3 p-2 rounded-lg hover:bg-primary transition ${
                    isActive('/game/alphabet') ? 'bg-primary' : ''
                  }`}
                >
                  <span className="w-4 h-4 flex items-center justify-center text-xs text-white">🔤</span>
                  <span className="text-white">Learn Alphabet</span>
                </Link>
              </li>
            </ul>
          )}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-primary">
        {/* Create Set button removed from sidebar as well for consistency */}
      </div>
    </aside>
  );
}
