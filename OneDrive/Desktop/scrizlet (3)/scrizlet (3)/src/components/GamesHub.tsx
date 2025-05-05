import React from "react";  
// Pull in React so we can write JSX (looks like HTML but compiles to JS).

import { Link } from "react-router-dom";  
// Link lets us navigate between “pages” in a single‑page app without reloading the browser.

import { Gamepad } from "lucide-react";  
// An icon component—a little gamepad graphic you can drop into your UI.

const games = [
  {
    id: "alphabet",
    name: "Learn the Alphabet",
    description: "Run down on the ASL alphabet.",
    route: "/game/alphabet",
  },
  {
    id: "fingerspelling",
    name: "Fingerspelling Challenge",
    description: "Guess a random word fingerspelled.",
    route: "/game/fingerspelling",
  },
  {
    id: "rapid",
    name: "Rapid Signs",
    description: "Identify signs under time pressure.",
    route: "/game/rapid",
  },
  // We removed “What’s the Sign?” so it’s not here any more.
];

export default function GamesHub() {
  // This is a React functional component named “GamesHub”.
  // When you use <GamesHub /> in your app, React runs this function and renders its return value.

  return (
    // Outermost container: padding + a responsive grid (1 column on mobile, 2 on md+ screens)
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/*
        We call games.map(...) to loop through our array.
        For each game object, we return one “card” div.
      */}
      {games.map((game) => (
        // key={game.id} helps React track which cards have changed/added/removed
        <div
          key={game.id}
          className="bg-white rounded-lg shadow hover:shadow-md transition p-6 flex flex-col"
        >
          {/* Header row: icon + title */}
          <div className="flex items-center mb-4">
            {/* Gamepad icon, sized 24px, colored via the “text-primary” class */}
            <Gamepad size={24} className="text-primary mr-2" />
            {/* Game name */}
            <h3 className="text-xl font-semibold">{game.name}</h3>
          </div>

          {/* Description paragraph */}
          <p className="flex-1 mb-4">{game.description}</p>

          {/* “Play” button that uses React Router Link to go to game.route */}
          <Link
            to={game.route}
            className="mt-auto bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark text-center"
          >
            Play
          </Link>
        </div>
      ))}
    </div>
  );
}
