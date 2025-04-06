import { useState, useEffect } from 'react';
import { useSignLanguage } from '../contexts/SignLanguageContext';
import { MoveRight, Timer } from 'lucide-react';

export default function GameCategories() {
  const { allTerms } = useSignLanguage();
  const [categories, setCategories] = useState<string[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Start the game
  const startGame = () => {
    // Get categories (assuming we have category info in the terms)
    // For this demo, we'll use predefined categories
    const gameCategories = ["Greetings", "Family", "Actions", "Objects"];
    setCategories(gameCategories);
    
    // Select random items for each category (from allTerms)
    let gameItems: any[] = [];
    gameCategories.forEach(category => {
      // In a real app, filter by actual category
      // Here we'll just pick random items and assign them to categories
      const categoryItems = allTerms
        .slice(0, 12) // Limit for demo
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(item => ({
          ...item,
          correctCategory: category
        }));
      
      gameItems = [...gameItems, ...categoryItems];
    });
    
    setItems(gameItems.sort(() => 0.5 - Math.random()));
    setAssignments({});
    setTimeLeft(60);
    setIsPlaying(true);
    setScore(0);
  };

  // Handle drag and drop
  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };
  
  const handleDragOver = (e: React.DragEvent, category: string) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    // Create a copy of current assignments
    const newAssignments = { ...assignments };
    
    // Remove the item from its previous category if it exists
    Object.keys(newAssignments).forEach(cat => {
      newAssignments[cat] = newAssignments[cat].filter(id => id !== draggedItem);
    });
    
    // Add to new category
    if (!newAssignments[category]) {
      newAssignments[category] = [];
    }
    newAssignments[category] = [...newAssignments[category], draggedItem];
    
    setAssignments(newAssignments);
    setDraggedItem(null);
    
    // Check if all items are assigned
    const totalAssigned = Object.values(newAssignments).reduce(
      (sum, items) => sum + items.length, 0
    );
    
    if (totalAssigned === items.length) {
      // Game complete - calculate score
      let correctAnswers = 0;
      
      Object.entries(newAssignments).forEach(([category, itemIds]) => {
        itemIds.forEach(id => {
          const item = items.find(i => i.id === id);
          if (item && item.correctCategory === category) {
            correctAnswers++;
          }
        });
      });
      
      setScore(correctAnswers);
      setIsPlaying(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Get assigned items for a category
  const getAssignedItems = (category: string) => {
    const itemIds = assignments[category] || [];
    return items.filter(item => itemIds.includes(item.id));
  };
  
  // Get unassigned items
  const getUnassignedItems = () => {
    const assignedIds = Object.values(assignments).flat();
    return items.filter(item => !assignedIds.includes(item.id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Sign Language Categories</h1>
        <p className="text-gray-400">
          Drag signs to their correct categories before time runs out!
        </p>
      </div>
      
      {!isPlaying && timeLeft === 60 && (
        <div className="bg-[#1a174d] p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Ready to Play?</h2>
          <p className="mb-6">Categorize each sign by dragging it to the correct category!</p>
          <button 
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition"
          >
            Start Game
          </button>
        </div>
      )}
      
      {!isPlaying && (timeLeft === 0 || score > 0) && (
        <div className="bg-[#1a174d] p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">
            {timeLeft === 0 ? "Time's Up!" : "Game Complete!"}
          </h2>
          <p className="text-3xl font-bold mb-6">Your score: {score} / {items.length}</p>
          <button 
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition"
          >
            Play Again
          </button>
        </div>
      )}
      
      {isPlaying && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="bg-[#1a174d] py-2 px-4 rounded-lg">
              <span className="font-semibold">Remaining: {getUnassignedItems().length}</span>
            </div>
            <div className="bg-[#1a174d] py-2 px-4 rounded-lg flex items-center gap-2">
              <Timer size={18} />
              <span className="font-semibold">{timeLeft}s</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {categories.map(category => (
              <div 
                key={category}
                className="bg-[#1a174d] p-4 rounded-lg"
                onDragOver={(e) => handleDragOver(e, category)}
                onDrop={(e) => handleDrop(e, category)}
              >
                <h3 className="font-semibold mb-3">{category}</h3>
                <div className="min-h-32 bg-[#252153] rounded-lg p-3 grid grid-cols-2 gap-2">
                  {getAssignedItems(category).map(item => (
                    <div 
                      key={item.id}
                      className="bg-[#2c2a55] p-2 rounded flex items-center gap-2"
                      draggable
                      onDragStart={() => handleDragStart(item.id)}
                    >
                      <span className="text-2xl">{item.emoji || '👋'}</span>
                      <span className="text-sm truncate">{item.term}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-[#1a174d] p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              Drag items to categories <MoveRight size={16} />
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {getUnassignedItems().map(item => (
                <div 
                  key={item.id}
                  className="bg-[#252153] p-3 rounded-lg flex flex-col items-center gap-2 cursor-move"
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                >
                  <span className="text-3xl">{item.emoji || '👋'}</span>
                  <span className="text-sm text-center">{item.term}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
