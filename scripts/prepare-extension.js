import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create extension directory
const extensionDir = path.join(__dirname, '../extension');
if (!fs.existsSync(extensionDir)) {
  fs.mkdirSync(extensionDir);
}

// Copy manifest
fs.copyFileSync(
  path.join(__dirname, '../public/manifest.json'),
  path.join(extensionDir, 'manifest.json')
);

// Copy built files
const distDir = path.join(__dirname, '../dist');

// Find the actual built files
const findBuiltFiles = () => {
  const files = [];
  
  // HTML files
  if (fs.existsSync(path.join(distDir, 'src/popup/index.html'))) {
    files.push({ src: 'src/popup/index.html', dest: 'popup.html' });
  }
  if (fs.existsSync(path.join(distDir, 'src/options/index.html'))) {
    files.push({ src: 'src/options/index.html', dest: 'options.html' });
  }
  
  // Find JS and CSS files by pattern
  const assetsDir = path.join(distDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    const assetFiles = fs.readdirSync(assetsDir);
    
    // Background script
    const backgroundFile = assetFiles.find(f => f.startsWith('background-') && f.endsWith('.js'));
    if (backgroundFile) {
      files.push({ src: `assets/${backgroundFile}`, dest: 'background.js' });
    }
    
    // Content script
    const contentFile = assetFiles.find(f => f.startsWith('content-') && f.endsWith('.js'));
    if (contentFile) {
      files.push({ src: `assets/${contentFile}`, dest: 'content.js' });
    }
    
    // Popup script
    const popupFile = assetFiles.find(f => f.startsWith('popup-') && f.endsWith('.js'));
    if (popupFile) {
      files.push({ src: `assets/${popupFile}`, dest: 'popup.js' });
    }
    
    // Options script
    const optionsFile = assetFiles.find(f => f.startsWith('options-') && f.endsWith('.js'));
    if (optionsFile) {
      files.push({ src: `assets/${optionsFile}`, dest: 'options.js' });
    }
    
    // Main index script
    const indexFile = assetFiles.find(f => f.startsWith('index-') && f.endsWith('.js'));
    if (indexFile) {
      files.push({ src: `assets/${indexFile}`, dest: 'index.js' });
    }
    
    // CSS file
    const cssFile = assetFiles.find(f => f.startsWith('index-') && f.endsWith('.css'));
    if (cssFile) {
      files.push({ src: `assets/${cssFile}`, dest: 'index.css' });
    }
  }
  
  return files;
};

const files = findBuiltFiles();

files.forEach(file => {
  const srcPath = path.join(distDir, file.src);
  const destPath = path.join(extensionDir, file.dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file.src} to ${file.dest}`);
  } else {
    console.warn(`Warning: ${file.src} not found`);
  }
});

// Update HTML files to reference correct JS/CSS files
const updateHtmlFile = (filePath, oldRef, newRef) => {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(oldRef, newRef);
  fs.writeFileSync(filePath, content);
};

// Update popup.html
updateHtmlFile(
  path.join(extensionDir, 'popup.html'),
  '/src/popup/main.tsx',
  'popup.js'
);

// Update options.html
updateHtmlFile(
  path.join(extensionDir, 'options.html'),
  '/src/options/main.tsx',
  'options.js'
);

console.log('Extension prepared successfully!');
console.log('Load the "extension" folder in Chrome at chrome://extensions/'); 