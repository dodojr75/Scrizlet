// src/components/SignViewer.tsx

// ─── IMPORTS ────────────────────────────────────────────────────────────────────
import { useRef, useState, useEffect } from 'react';
// └── React hooks:
//     • useRef   → hold mutable values (DOM nodes) without causing re-renders
//     • useState → component state
//     • useEffect→ side‑effects (e.g., event listeners, cleanup)

import { useNavigate, useParams } from 'react-router-dom';
// └── Router hooks:
//     • useParams  → grab URL params (here: the `id` of the sign)
//     • useNavigate→ imperatively navigate to a new route

import { useSignLanguage, Sign } from '../contexts/SignLanguageContext';
// └── Custom context hook:
//     • useSignLanguage → access `signs` array + save/remove functions
//     • Sign            → TS type for a single sign entry

import {
  ArrowLeft,      // back‑arrow icon
  Bookmark,       // empty bookmark icon
  BookmarkCheck,  // filled bookmark icon
  Maximize,       // fullscreen icon
  Minimize,       // exit‑fullscreen icon
  RefreshCw       // replay/refresh icon
} from 'lucide-react';


// ─── COMPONENT ─────────────────────────────────────────────────────────────────
export default function SignViewer() {
  // ─── READ ROUTER PARAM & NAVIGATION ─────────────────────────────────────────
  const { id } = useParams<{ id: string }>();
  // └── grab URL segment so we know which sign to show

  const navigate = useNavigate();
  // └── gives us a function to switch pages in code

  // ─── CONTEXT: SIGNS + BOOKMARK ACTIONS ───────────────────────────────────────
  const { signs, saveItem, removeSavedItem, isItemSaved } = useSignLanguage();
  // ├── signs: array of all sign objects
  // ├── saveItem(id): add to favorites
  // ├── removeSavedItem(id): remove from favorites
  // └── isItemSaved(id): bool if already favorited

  // ─── REFS FOR DOM NODES ───────────────────────────────────────────────────────
  const imgRef = useRef<HTMLImageElement>(null);
  // └── reference to the `<img>` so we can reset its `src` (replay GIF)

  const containerRef = useRef<HTMLDivElement>(null);
  // └── reference to the outer container for fullscreen API

  // ─── LOCAL STATE ──────────────────────────────────────────────────────────────
  const [isFullscreen, setIsFullscreen] = useState(false);
  // └── track whether we're in fullscreen mode

  // ─── FIND CURRENT SIGN ───────────────────────────────────────────────────────
  const sign = signs.find(s => s.id === id);
  // └── locate the sign object whose `id` matches the URL param

  if (!sign) {
    // └── if not found (e.g. bad URL), show error early
    return (
      <div className="p-4 text-center text-red-500">
        Sign not found.
      </div>
    );
  }

  // ─── DETERMINE PREVIOUS & NEXT FOR NAVIGATION ───────────────────────────────
  const idx = signs.findIndex(s => s.id === id);
  // └── index of current sign in the array

  const prevSign = signs[(idx - 1 + signs.length) % signs.length];
  // └── wrap backwards: if idx=0, go to last

  const nextSign = signs[(idx + 1) % signs.length];
  // └── wrap forwards: if at end, go to first

  // ─── HANDLER FUNCTIONS ──────────────────────────────────────────────────────

  const handleBack = () => {
    // go back to the dictionary list
    navigate('/dictionary');
  };

  const handlePrev = () => {
    // navigate to the previous sign’s detail page
    navigate(`/sign/${prevSign.id}`);
  };

  const handleNext = () => {
    // navigate to the next sign’s detail page
    navigate(`/sign/${nextSign.id}`);
  };

  const toggleSave = () => {
    // if already saved, remove; otherwise save
    isItemSaved(sign.id)
      ? removeSavedItem(sign.id)
      : saveItem(sign);
  };

  const handlePlay = () => {
    // replay the GIF by clearing src then reassigning it
    if (!imgRef.current) return;
    const src = sign.gif;
    imgRef.current.src = '';
    // tiny timeout forces reload
    setTimeout(() => {
      imgRef.current!.src = src;
    }, 50);
  };

  // ─── FULLSCREEN TOGGLE ──────────────────────────────────────────────────────
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      // enter fullscreen
      containerRef.current.requestFullscreen
        ?.().then(() => setIsFullscreen(true))
        .catch(console.error);
    } else {
      // exit fullscreen
      document.exitFullscreen
        ?.().then(() => setIsFullscreen(false))
        .catch(console.error);
    }
  };

  // ─── SYNC FULLSCREEN STATE ──────────────────────────────────────────────────
  useEffect(() => {
    const onChange = () => {
      // update state when browser enters/exits fullscreen
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
    };
  }, []);

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    // ┌─────────────────────────────────────────────────────────────────────────┐
    // │ Outer container                                                         │
    // │ • ref={containerRef} → needed for fullscreen API                         │
    // │ • max-w-3xl mx-auto     → center and cap width to ~768px                 │
    // │ • p-6 + space-y-6       → padding + vertical spacing between sections    │
    // │ • bg-white rounded-lg   → white card background with rounded corners     │
    // │ • shadow                → subtle drop‑shadow                             │
    // └─────────────────────────────────────────────────────────────────────────┘
    <div
      ref={containerRef}
      className="max-w-3xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow"
    >
      {/* ─── TOP BAR ───────────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center">
        {/* back arrow */}
        <ArrowLeft
          size={24}
          className="cursor-pointer"
          onClick={handleBack}
        />

        {/* sign title */}
        <h2 className="text-2xl font-semibold">
          {sign.term}
        </h2>

        {/* bookmark + fullscreen buttons */}
        <div className="flex gap-4">
          {/* toggle favorite */}
          <button onClick={toggleSave} className="p-1">
            {isItemSaved(sign.id)
              ? <BookmarkCheck size={24} />
              : <Bookmark      size={24} />}
          </button>

          {/* toggle fullscreen */}
          <button onClick={toggleFullscreen} className="p-1">
            {isFullscreen
              ? <Minimize size={24}/>
              : <Maximize size={24}/>}
          </button>
        </div>
      </div>

      {/* ─── GIF DISPLAY ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center">
        <img
          // allow replay via handlePlay
          ref={imgRef}
          src={sign.gif}             // the animated sign GIF
          alt={sign.term}            // accessibility
          className="h-96 w-96 object-contain"
        />
        {/* replay button */}
        <button
          onClick={handlePlay}
          className="mt-4 inline-flex items-center gap-1 text-primary hover:text-primary-dark"
        >
          <RefreshCw size={16}/> Replay
        </button>
      </div>

      {/* ─── FOOTER NAVIGATION ──────────────────────────────────────────────────── */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
        >
          Previous Sign
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Next Sign
        </button>
      </div>
    </div>
  );
}
