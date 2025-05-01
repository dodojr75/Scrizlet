// scripts/rename-alphabet-files.js
const fs   = require('fs');
const path = require('path');

// folder that holds the images
const alphaDir = path.join(__dirname, '../public/assets/alphabets');

if (!fs.existsSync(alphaDir)) {
  console.error('❌ Folder not found:', alphaDir);
  process.exit(1);
}

const files = fs.readdirSync(alphaDir);

files.forEach((filename) => {
  const match = /^letters([A-Za-z])\.(png|jpg|jpeg)$/i.exec(filename);
  if (match) {
    const letter = match[1].toUpperCase();            // A, B, C …
    const ext    = match[2].toLowerCase();             // keep same extension
    const newName = `${letter}.${ext}`;
    fs.renameSync(
      path.join(alphaDir, filename),
      path.join(alphaDir, newName)
    );
    console.log(`🔄  ${filename}  →  ${newName}`);
  }
});

console.log('✅ Renaming complete');
