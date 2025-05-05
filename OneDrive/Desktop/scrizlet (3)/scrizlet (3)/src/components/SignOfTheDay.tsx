// src/components/SignOfTheDay.tsx
import { useEffect, useState } from 'react';
import { useSignLanguage } from '../contexts/SignLanguageContext';
import { Bookmark, BookmarkCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSignInitial, getDailySign } from '../services/signLanguageService';

export default function SignOfTheDay() {
  const { signs, saveItem, removeSavedItem, isItemSaved } = useSignLanguage();
  const [dailySign, setDailySign] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    if (signs.length > 0) {
      const { sign, lastUpdated: time } = getDailySign(signs);
      setDailySign(sign);
      setLastUpdated(time);
    }
  }, [signs]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent Link navigation
    if (!dailySign) return;
    isItemSaved(dailySign.id)
      ? removeSavedItem(dailySign.id)
      : saveItem(dailySign);
  };

  if (!dailySign) {
    return <div className="text-center py-6">Loading Sign of the Day…</div>;
  }

  return (
    <Link
      to={`/sign/${dailySign.id}`}
      className="block bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Sign of the Day</h2>
        <span className="text-xs text-gray-500">Updated: {lastUpdated}</span>
      </div>

      {/* Body */}
      <div className="flex items-center gap-6">
        {/* Initial tile */}
        <div className="flex-none bg-red-50 w-20 h-20 rounded-lg flex items-center justify-center">
          <span className="text-4xl font-bold text-red-700">
            {getSignInitial(dailySign)}
          </span>
        </div>

        {/* Term & save button */}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{dailySign.term}</h3>
              <p className="text-sm text-red-600 hover:underline">Explore more signs</p>
            </div>
            <button
              onClick={toggleSave}
              className="p-1 rounded-full text-gray-400 hover:text-red-600 transition"
              title={isItemSaved(dailySign.id) ? 'Remove from saved' : 'Save for later'}
            >
              {isItemSaved(dailySign.id)
                ? <BookmarkCheck size={20} />
                : <Bookmark size={20} />
              }
            </button>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight size={24} className="text-gray-300" />
      </div>
    </Link>
  );
}
