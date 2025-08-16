// canva-app/src/utils/loadTemplates.js

// Webpack's require.context to import all SVGs in subfolders
function importAll(r) {
  let files = {};
  r.keys().forEach((key) => {
    // key: './Green Modern Project Proposal/Green Simple Company Project Proposal-1.svg'
    const match = key.match(/^\.\/([^/]+)\/(.+\.svg)$/);
    if (match) {
      const folder = match[1];
      const filename = match[2];
      if (!files[folder]) files[folder] = [];
      files[folder].push({
        filename,
        url: r(key).default || r(key)
      });
    }
  });
  return files;
}

// This will import all SVGs in all subfolders of design/
const svgFiles = importAll(
  require.context(
    '../components/design', // relative to this file
    true,                   // search subdirectories
    /\.svg$/                // only SVG files
  )
);

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