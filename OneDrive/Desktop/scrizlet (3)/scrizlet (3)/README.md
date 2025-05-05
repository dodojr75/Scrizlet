



scrizlet/
├── public/           Static assets served at root
│   ├── assets/       • `alphabets/*.png` & `gifs/*.gif` (media for signs & letters)
│   ├── data/         • `signData.json`, `alphabetData.json` (preloaded JSON datasets)
│   └── logo/         • App icons and `desktop.ini`
│
├── src/              Main source code
│   ├── assets/       literlay just the logo png 
│   ├── components/   UI pieces and pages:
│   │   ├── **App.tsx**          • Root component, sets up routes & theme
│   │   ├── **Header.tsx**       • Top navbar with navigation links
│   │   ├── **Sidebar.tsx**      • Slide‑in menu for dictionary, games, saved items
│   │   ├── **Dictionary.tsx**   • Browse alphabetical list of signs & letters
│   │   ├── **SignViewer.tsx**   • Detail page: click a term to play its GIF + definition
│   │   ├── **SavedItems.tsx**   • Lists user‑bookmarked signs; click to view or unsave
│   │   ├── **SignOfTheDay.tsx** • Highlights a random “sign of the day” on home
│   │   ├── **WhatsTheSignGame.tsx** /////////////////////////////////////////////also does nothing 
│   │   │   • Show a GIF without label; user guesses the term
│   │   ├── **FingerSpellingGame.tsx**
│   │   │   • Quiz: match letters to images for fingerspelling practice
│   │   ├── **RapidSigns.tsx**    • Timed quiz: how many signs you can recognize
│   │   ├── **PastSigns.tsx**     • Review history of recently viewed signs
│   │   ├── **Learn.tsx**         • blewww isnt ruted (COnnected)
│   │   └── **Toast.tsx**         • Small pop‑up notifications (e.g. “Saved!”) Does nothing 
│   │
│   ├── contexts/
│   │   └── **SignLanguageContext.tsx** the most important tsx baiscally do everything 
│   │       • React Context + Provider houses:
│   │         – `savedItems` array & functions to save/unsave
│   │         – methods to fetch data from service layer
│   │
│   ├── hooks/
│   │   └── Custom hooks (e.g. `useWindowSize`, `useLocalStorage`)
│   │
│   ├── services/
│   │   └── **signLanguageService.ts**
│   │       • Loads JSON from `/public/data/`
│   │       • Exposes helper functions: `getAllSigns()`, `getById(id)`
│   │
│   ├── index.css       Tailwind base imports
│   ├── main.tsx        Entry point: renders `<App />` into `#root`
│   └── vite-env.d.ts   Vite + TypeScript type declarations
│
├── .gitignore         Standard ignores (`node_modules`, `dist`, `.DS_Store`)
├── package.json       Scripts & dependencies
├── postcss.config.js  PostCSS + Tailwind plugin config
├── tailwind.config.js Tailwind utility config (custom colors)
├── tsconfig.json      TypeScript compiler options
└── vite.config.ts     Vite bundler settings






```
npm install u hav to dp this first 
npm run dev # THIS HOW U CAN Run it
```

IMportant custom functions  i would say 

location: src/contexts/SignLanguageContext.tsx
Description: Adds the sign id to the savedItems state array and persists it to localStorage.
unsaveItem(id: string)

Location: src/contexts/SignLanguageContext.tsx
Description: Removes the sign id from the savedItems array and updates localStorage.
fetchSignOfTheDay()
Location: src/contexts/SignLanguageContext.tsx
Description: Randomly selects one sign from the full dataset and exposes it for use in the SignOfTheDay component.



                                        Json data calling 

// An array of “letter” items for your app — each object represents one alphabet character,
// with a unique ID, the character itself, a path to its image, and a type for rendering logic.
//const alphabetData = [
  // Entry for letter A
  {
    id: "letter_A",                     // Unique key for lookups, React keys, etc.
    letter: "A",                        // The character to display (e.g. in text quizzes)
    image: "/assets/alphabets/A.png",   // Relative URL to the image asset for “A”
    type: "letter"                      // Category/type (so you can filter or switch on it)
  },




  // An array of “word” items for your app — each object represents one sign language word,
// with a unique ID, the text term, a path to its GIF animation, and a type for rendering logic.
const wordData = [
  {
    id: "sign_again",              // Unique key for this sign (used for lookups, React keys, etc.)
    term: "again",                 // The word to display in text quizzes or labels
    gif: "/assets/gifs/again.gif", // Relative URL to the GIF illustrating the sign
    type: "word"                   // Category/type (so you can filter or switch on it)
  },
  // …add more word objects here
];


i got comments in there also just in case 