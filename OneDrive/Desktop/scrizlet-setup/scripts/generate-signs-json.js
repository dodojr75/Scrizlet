// scripts/generate-signs-json.js
const fs   = require('fs');
const path = require('path');

/* ----------------------------------------------------------------
   CONFIGURATION
   ---------------------------------------------------------------- */
const gifsDir   = path.join(__dirname, '../public/assets/gifs'); // folder with GIFs
const urlPrefix = '/assets/gifs/';                               // URL used in JSON
const outFile   = path.join(__dirname, '../src/assets/signs.json'); // JSON output

/* ----------------------------------------------------------------
   BUILD SIGNS ARRAY
   ---------------------------------------------------------------- */
if (!fs.existsSync(gifsDir)) {
  console.error(`❌ GIF folder not found: ${gifsDir}`);
  process.exit(1);
}

const gifFiles = fs
  .readdirSync(gifsDir)
  .filter(f => f.toLowerCase().endsWith('.gif'));

if (gifFiles.length === 0) {
  console.warn('⚠️  No .gif files found in', gifsDir);
}

const signs = gifFiles.map(filename => {
  // convert "hello_world.gif" → "hello world"
  const word = path.basename(filename, path.extname(filename)).replace(/_/g, ' ');
  return {
    word,
    media: `${urlPrefix}${filename}`,
    usesNonDominantHand: false            // default; edit later if needed
  };
});

/* ----------------------------------------------------------------
   WRITE JSON
   ---------------------------------------------------------------- */
fs.writeFileSync(outFile, JSON.stringify(signs, null, 2));
console.log(`✅ Wrote ${signs.length} sign entries to ${outFile}`);
