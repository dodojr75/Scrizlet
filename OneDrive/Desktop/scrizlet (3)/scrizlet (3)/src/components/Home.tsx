import React from "react";
import { Link } from "react-router-dom";
import SignOfTheDay from "./SignOfTheDay";
import logo from "../assets/logo.png";  // Import logo image so we can display it in JSX

// "Home" component: renders the main landing page with banner, featured sign, and getting-started info
export default function Home() {
  // Returning JSX: HTML-like structure that React converts to real DOM elements
  return (
    // Root container: flex to grow, vertical scroll if needed, padding and spacing
    <div className="flex-1 overflow-y-auto p-6 space-y-8">
      {/* Everything on the page lives inside this main wrapper */}

      {/* ===== HERO BANNER ===== */}
      <section
        className="
          bg-red-600             /* red background for emphasis */
          text-white             /* white text for contrast */
          rounded-lg             /* rounded corners */
          flex                   /* use Flexbox layout */
          flex-col md:flex-row   /* stack vertically on small, side-by-side on md+ */
          items-center           /* vertically center children */
          justify-between        /* spread items horizontally */
          p-8                    /* padding around content */
          shadow                 /* subtle box shadow */
        "
      >
        {/* Logo: your app brand mark */}
        <img
          src={logo}                  // Logo image URL imported above
          alt="Scrizlet Logo"         // Alt text for screen readers
          className="h-12 w-auto"     // Fixed height, auto width to preserve aspect ratio
        />

        {/* Tagline: encourages user to start */}
        <p className="mt-4 md:mt-0 text-lg">
          Your journey to sign language mastery begins here
        </p>

        {/* Call-to-action buttons */}
        <div className="flex gap-4 mt-4 md:mt-0">
          {/* Navigate to Dictionary page */}
          <Link
            to="/dictionary"                                    // Client-side route change
            className="
              bg-white                  /* white button background */
              text-red-600              /* red text color */
              font-semibold             /* slightly bold text */
              px-6 py-2                 /* horizontal & vertical padding */
              rounded-lg                /* rounded corners */
              hover:bg-red-50           /* light red on hover */
            "
          >
            Explore Dictionary
          </Link>

          {/* Navigate to Games page */}
          <Link
            to="/games"
            className="
              bg-red-800                /* dark red background */
              text-white                /* white text */
              font-semibold
              px-6 py-2
              rounded-lg
              hover:bg-red-700          /* lighter dark red on hover */
            "
          >
            Play Games
          </Link>
        </div>
      </section>

      {/* ===== SIGN OF THE DAY ===== */}
      <section>
        {/* Custom component showing a featured sign each day */}
        <SignOfTheDay />
      </section>

      {/* ===== GETTING STARTED CARD ===== */}
      <section className="space-y-4">
        {/* Section heading */}
        <h2 className="text-2xl font-semibold">Getting Started</h2>

        {/* Content card */}
        <div className="
            bg-white             /* white card background */
            border               /* default border */
            border-red-200       /* light red border */
            rounded-lg           /* rounded corners */
            p-6                  /* padding */
          ">
          {/* Intro paragraph */}
          <p className="text-gray-700">
            Welcome to Scrizlet, your sign language learning companion…
          </p>

          {/* Helpful links */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            {/* Link to dictionary */}
            <Link
              to="/dictionary"
              className="text-red-600 font-semibold hover:underline"
            >
              Browse the sign language dictionary →
            </Link>

            {/* Link to games */}
            <Link
              to="/games"
              className="text-red-600 font-semibold hover:underline"
            >
              Play learning games →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
