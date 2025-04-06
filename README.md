#i been working since thursday to try to get a working gui sadl yi couldnt do it to even working status so opted in using a web browser noting reallly change but we something called flask u should probaly watch a video on it i kniw this is alot show i got chatgpt to give me a run down i know for a face that the folder layout should be  good and i hope this will help yall. u can delete and do any of what yall need to do to this.

Scrizlet

- A **Python backend** (Flask) that sends sign GIFs and sign info to the frontend
- A **React frontend** (TypeScript) that shows flashcards, games, and the learning interface

This README explains the folder structure, what each part does, and how to run it.

---

## 📁 Folder Structure

```
SCRIZLET/
├── backend/                   # Python backend
│   ├── main.py                # Main Flask server file
│   ├── assets/                # Sign-related files
│   │   ├── gifs/              # Sign GIFs (e.g., hello.gif)
│   │   └── signs.json         # Text data for each sign
│   ├── routes/                # Optional: split route files
│   ├── utils/                 # Optional: helper functions
│   └── requirements.txt       # Python dependencies
│
├── scrizlet/                  # React project (frontend folder)
│   ├── contexts/              # Shared state (SignLanguageContext)
│   │   └── SignLanguageContext.tsx
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.tsx            # Main app layout
│   │   ├── main.tsx           # React entry point
│   │   ├── index.css          # Global styles (Tailwind)
│   │   └── vite-env.d.ts      # TypeScript definitions for Vite
│   ├── .gitignore             # Files to ignore in Git
│   ├── index.html             # Base HTML template
│   ├── package.json           # React dependencies and commands
│   ├── package-lock.json      # Lock file for exact versions
│   ├── postcss.config.js      # PostCSS plugin setup
│   ├── tailwind.config.js     # Tailwind CSS config
│   ├── tsconfig.json          # TypeScript config
│   ├── vite.config.ts         # Vite dev/build config
│   ├── scrizlet.tsx           # Possibly another entry or test file
│   └── README.md              # This file
```

---

## 🧠 What Each Folder/File Does

### backend/ (Python server)

- Runs with Flask
- Sends sign GIFs and info to the frontend
- Only Python here

Files:

- `main.py` — Flask app with routes like `/api/sign/<word>`
- `assets/gifs/` — All sign `.gif` files (e.g., `hello.gif`)
- `assets/signs.json` — Text data: word, meaning, category, etc.
- `requirements.txt` — Flask and other dependencies

Optional:

- `routes/` — Break up Flask routes into smaller files
- `utils/` — Helper scripts (e.g., loading signs)

### scrizlet/ (React frontend)

- The user interface (pages, buttons, games)

Files:

- `contexts/SignLanguageContext.tsx` — Shared state (e.g., progress)
- `src/components/` — React UI components (you can group Learn, Games, Dictionary here)
- `src/App.tsx` — Main app layout that holds routing/pages
- `src/main.tsx` — Entry point that renders the app
- `src/index.css` — Global styling using Tailwind CSS
- `index.html` — The main HTML file used by Vite
- `scrizlet.tsx` — Possibly a test or special render component (keep if needed)

Configs:

- `vite.config.ts` — Dev server and build settings
- `tailwind.config.js` — Tailwind utility config
- `tsconfig.json` — TypeScript options
- `package.json` — Scripts and library dependencies

---

## 🧪 How to Run It

### 1. Backend (Python)

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Runs at: `http://localhost:5000`

### 2. Frontend (React)

```bash
cd scrizlet
npm install
npm run dev
```

Runs at: `http://localhost:5173`

---

## 🧩 How GIFs and Sign Info Work

1. Add a file like `hello.gif` to `backend/assets/gifs/`
2. Add this to `backend/assets/signs.json`:

```json
{
  "word": "hello",
  "category": "greetings",
  "description": "Raise hand and wave outward."
}
```

3. React fetches this via Flask backend:
   - `/api/sign/hello` → sends the GIF
   - `/api/sign/info/hello` → sends the text data

---

## 💡 What Each Person Can Work On

| Role       | What to Work On                                      |
| ---------- | ---------------------------------------------------- |
| Python dev | Add Flask routes, handle data, serve signs           |
| Media dev  | Add new `.gif` files to `gifs/`, update `signs.json` |
| Web dev    | Build React pages (games, UI features)               |
| Everyone   | Test the site, write comments, push updates          |

---

## 🧼 Notes

- Keep Python and React in separate folders
- File names should be lowercase with underscores (e.g., `thank_you.gif`)
- `signs.json` and `gifs/` must match for each sign
- Only edit React code if you're working on the interface

