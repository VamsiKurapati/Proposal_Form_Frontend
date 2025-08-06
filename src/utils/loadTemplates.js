// canva-app/src/utils/loadTemplates.js

// Vite's import.meta.glob to import all SVGs in subfolders
const svgModules = import.meta.glob('../components/design/**/*.svg', { eager: true });

function importAll() {
  let files = {};
  Object.entries(svgModules).forEach(([key, module]) => {
    // key: '/src/components/design/Green Modern Project Proposal/Green Simple Company Project Proposal-1.svg'
    const match = key.match(/design\/([^/]+)\/(.+\.svg)$/);
    if (match) {
      const folder = match[1];
      const filename = match[2];
      if (!files[folder]) files[folder] = [];
      files[folder].push({
        filename,
        url: module.default || module
      });
    }
  });
  return files;
}

// This will import all SVGs in all subfolders of design/
const svgFiles = importAll();

export function getTemplateSets() {
  // sets: { folder: [filename, ...] }
  const sets = {};
  // svgPreviews: { folder: [svgUrl, ...] }
  const svgPreviews = {};
  Object.entries(svgFiles).forEach(([folder, files]) => {
    sets[folder] = files.map(f => f.filename);
    svgPreviews[folder] = files.map(f => f.url);
  });
  return { sets, svgPreviews };
} 