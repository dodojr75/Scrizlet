// src/components/Sidebar.tsx

// ─── IMPORTS ──────────────────────────────────────────────────────────────────────
import { useState } from 'react';
// └── React hook for managing local component state (here: expanded vs. collapsed sidebar)

import { NavLink } from 'react-router-dom';
// └── Special link component that knows if its `to` path is active and can apply styles

import {
  House,        // icon for Home
  BookOpen,     // icon for Dictionary
  Gamepad2,     // icon for Games
  BookmarkCheck,// icon for Saved Signs
  Menu          // "hamburger" icon for collapse/expand
} from 'lucide-react';

import logo from '../assets/logo.png';
// └── Your app’s logo image; Vite (or Webpack) will replace this import with a URL string


// ─── COMPONENT DEFINITION ────────────────────────────────────────────────────────
export default function Sidebar() {
  // collapsed = false → sidebar is wide (show icons + labels)
  // collapsed = true  → sidebar is narrow (icons only)
  const [collapsed, setCollapsed] = useState(false);

  return (
    // ┌─────────────────────────────────────────────────────────────────────────────┐
    // │ Sidebar container                                                         │
    // │  • <aside> semantic tag for side content                                  │
    // │  • bg-primary-dark     → dark background color                             │
    // │  • text-white         → white text by default                             │
    // │  • ${collapsed?'w-16':'w-64'} → width: 4rem collapsed, 16rem expanded      │
    // │  • transition-all duration-300 → animate ALL changes over 300ms           │
    // │  • flex flex-col       → vertical flex layout                              │
    // │  • relative            → positions collapse button in context            │
    // └─────────────────────────────────────────────────────────────────────────────┘
    <aside
      className={`
        bg-primary-dark text-white
        ${collapsed ? 'w-16' : 'w-64'}
        transition-all duration-300
        flex flex-col relative
      `}
    >
      {/* ─── HEADER: Logo + Collapse Button ────────────────────────────────────── */}
      <div className="flex items-center justify-between p-4">
        {/* Only show the logo when expanded */}
        {!collapsed && (
          <img
            src={logo}           // imported URL string
            alt="Scrizlet Logo"  // accessibility text
            className="h-8"      // height: 2rem (32px), width auto to preserve aspect ratio
          />
        )}
        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(c => !c)}
          // └── flips collapsed true↔false
          className="focus:outline-none"
          // └── removes default browser outline on focus (you could add your own if desired)
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          // └── for screen readers: tells the user what this button does
        >
          <Menu size={20} />
          {/* hamburger icon */}
        </button>
      </div>

      {/* ─── NAVIGATION LINKS ───────────────────────────────────────────────────── */}
      <nav className="flex-1">
        {/* flex-1 makes this nav fill remaining vertical space */}
        <ul className="space-y-2">
          {/* vertical list with 0.5rem gap between items */}
          
          {/* ─ Home Link ───────────────────────────────────────────────────────── */}
          <li>
            <NavLink
              to="/"       // target path
              end          // exact match only (so "/" isn’t always active)
              className={({ isActive }) => `
                flex items-center gap-3    /* icon + text side by side */
                p-2 rounded                /* padding + rounded corners */
                hover:bg-primary-light     /* light bg on hover */
                transition-colors          /* smooth hover effect */
                ${isActive
                  ? 'bg-primary-light text-primary-dark font-semibold'
                  : 'text-white'
                }
              `}
            >
              <House size={20} />
              {/* icon */}
              {!collapsed && 'Home'}
              {/* only show label when expanded */}
            </NavLink>
          </li>

          {/* ─ Dictionary Link ──────────────────────────────────────────────────── */}
          <li>
            <NavLink
              to="/dictionary"
              className={({ isActive }) => `
                flex items-center gap-3 p-2 rounded hover:bg-primary-light transition-colors
                ${isActive
                  ? 'bg-primary-light text-primary-dark font-semibold'
                  : 'text-white'
                }
              `}
            >
              <BookOpen size={20} />
              {!collapsed && 'Dictionary'}
            </NavLink>
          </li>

          {/* ─ Games Link ───────────────────────────────────────────────────────── */}
          <li>
            <NavLink
              to="/games"
              className={({ isActive }) => `
                flex items-center gap-3 p-2 rounded hover:bg-primary-light transition-colors
                ${isActive
                  ? 'bg-primary-light text-primary-dark font-semibold'
                  : 'text-white'
                }
              `}
            >
              <Gamepad2 size={20} />
              {!collapsed && 'Games'}
            </NavLink>
          </li>

          {/* ─ Saved Signs Link ─────────────────────────────────────────────────── */}
          <li>
            <NavLink
              to="/saved"
              className={({ isActive }) => `
                flex items-center gap-3 p-2 rounded hover:bg-primary-light transition-colors
                ${isActive
                  ? 'bg-primary-light text-primary-dark font-semibold'
                  : 'text-white'
                }
              `}
            >
              <BookmarkCheck size={20} />
              {!collapsed && 'Saved Signs'}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
