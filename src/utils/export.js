// Export-related utility functions
import { optimizeSVG, getOptimizationStats } from './svg.js';
import cloudImageService from './cloudImageService.js';

export function exportToJSON(project) {
  // Process images for export (handle cloud URLs)
  const processedProject = {
    ...project,
    pages: project.pages.map(page => ({
      ...page,
      elements: page.elements.map(element => cloudImageService.processImageForExport(element))
    })),
    metadata: {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      appName: 'Canva App'
    }
  };

  const dataStr = JSON.stringify(processedProject, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const exportFileDefaultName = `canva-project-${timestamp}.json`;
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

export function importFromJSON(event, setProject, setSelectedElement, clearHistory) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        let migratedProject = imported;
        if (imported.pageSettings && imported.elements) {
          migratedProject = {
            pages: [{
              id: 1,
              pageSettings: imported.pageSettings,
              elements: imported.elements
            }],
            currentPage: 0
          };
        }
        migratedProject.pages = migratedProject.pages.map(page => ({
          ...page,
          elements: page.elements.map(element => {
            if (element.type === 'text') {
              return {
                ...element,
                properties: {
                  text: element.properties?.text || 'Click to edit text',
                  fontSize: element.properties?.fontSize || 16,
                  fontFamily: element.properties?.fontFamily || 'Arial',
                  color: element.properties?.color || '#000000',
                  bold: element.properties?.bold || false,
                  italic: element.properties?.italic || false,
                  underline: element.properties?.underline || false,
                  textAlign: element.properties?.textAlign || 'left',
                  listStyle: element.properties?.listStyle || 'none',
                  lineHeight: element.properties?.lineHeight || 1.2,
                  letterSpacing: element.properties?.letterSpacing || 0
                }
              };
            } else if (element.type === 'image') {
              // Process image elements for import (handle cloud URLs)
              return cloudImageService.processImageForImport(element);
            } else if (element.type === 'shape') {
              // Ensure shape elements have all required properties
              return {
                ...element,
                shapeType: element.shapeType || 'rectangle',
                properties: {
                  fill: element.properties?.fill || '#f3f4f6',
                  stroke: element.properties?.stroke || '#111827',
                  strokeWidth: element.properties?.strokeWidth || 2,
                  opacity: element.properties?.opacity || 1,
                  rx: element.properties?.rx || 0,
                  strokeDasharray: element.properties?.strokeDasharray || 'none',
                  shadow: element.properties?.shadow || false,
                  shadowBlur: element.properties?.shadowBlur || 0,
                  shadowColor: element.properties?.shadowColor || '#000',
                  ...element.properties
                }
              };
            }
            return element;
          })
        }));

        // Extract images from JSON and add to uploads panel
        cloudImageService.extractImagesFromJSON(migratedProject);

        // Add flag to indicate this is a newly imported project
        migratedProject._isNewlyImported = true;

        // Clear history first if clearHistory function is provided
        if (clearHistory && typeof clearHistory === 'function') {
          clearHistory();
        }

        setProject(migratedProject);
        setSelectedElement({ pageIndex: 0, elementId: null });
        event.target.value = '';
      } catch (error) {
        alert('Error importing file. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  }
}

export function importFromJSONData(jsonData, setProject, setSelectedElement, clearHistory) {
  try {
    let migratedProject = jsonData;
    if (jsonData.pageSettings && jsonData.elements) {
      migratedProject = {
        pages: [{
          id: 1,
          pageSettings: jsonData.pageSettings,
          elements: jsonData.elements
        }],
        currentPage: 0
      };
    }
    migratedProject.pages = migratedProject.pages.map(page => ({
      ...page,
      elements: page.elements.map(element => {
        if (element.type === 'text') {
          return {
            ...element,
            properties: {
              text: element.properties?.text || 'Click to edit text',
              fontSize: element.properties?.fontSize || 16,
              fontFamily: element.properties?.fontFamily || 'Arial',
              color: element.properties?.color || '#000000',
              bold: element.properties?.bold || false,
              italic: element.properties?.italic || false,
              underline: element.properties?.underline || false,
              textAlign: element.properties?.textAlign || 'left',
              listStyle: element.properties?.listStyle || 'none',
              lineHeight: element.properties?.lineHeight || 1.2,
              letterSpacing: element.properties?.letterSpacing || 0
            }
          };
        } else if (element.type === 'image') {
          // Process image elements for import (handle cloud URLs)
          return cloudImageService.processImageForImport(element);
        } else if (element.type === 'shape') {
          // Ensure shape elements have all required properties
          return {
            ...element,
            shapeType: element.shapeType || 'rectangle',
            properties: {
              fill: element.properties?.fill || '#f3f4f6',
              stroke: element.properties?.stroke || '#111827',
              strokeWidth: element.properties?.strokeWidth || 2,
              opacity: element.properties?.opacity || 1,
              rx: element.properties?.rx || 0,
              strokeDasharray: element.properties?.strokeDasharray || 'none',
              shadow: element.properties?.shadow || false,
              shadowBlur: element.properties?.shadowBlur || 0,
              shadowColor: element.properties?.shadowColor || '#000',
              ...element.properties
            }
          };
        }
        return element;
      })
    }));

    // Extract images from JSON and add to uploads panel
    cloudImageService.extractImagesFromJSON(migratedProject);

    // Add flag to indicate this is a newly imported project
    migratedProject._isNewlyImported = true;

    // Clear history first if clearHistory function is provided
    if (clearHistory && typeof clearHistory === 'function') {
      clearHistory();
    }

    setProject(migratedProject);
    setSelectedElement({ pageIndex: 0, elementId: null });
  } catch (error) {
    console.error('Import error:', error);
    throw error;
  }
}

// Image compression utility
async function compressImage(src, maxWidth = 1920, quality = 0.8) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    img.onerror = () => resolve(src); // Fallback to original if compression fails
    img.src = src;
  });
}

// Process element and optimize for export
async function processElementForExport(element) {
  if (element.type === 'image' && element.properties.src) {
    // Compress images to reduce file size
    const compressedSrc = await compressImage(element.properties.src);
    return {
      ...element,
      properties: {
        ...element.properties,
        src: compressedSrc
      }
    };
  }
  return element;
}

// Enhanced PDF export with size optimization
export const exportToPDF = async (project) => {

  // Show loading indicator
  const loadingDiv = document.createElement('div');
  loadingDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    color: white;
    font-family: Arial, sans-serif;
    font-size: 18px;
  `;
  loadingDiv.innerHTML = 'Processing images and preparing PDF export...';
  document.body.appendChild(loadingDiv);

  try {
    // Process all elements to optimize images
    const processedPages = await Promise.all(
      project.pages.map(async (page) => ({
        ...page,
        elements: await Promise.all(
          page.elements.map(processElementForExport)
        )
      }))
    );

    // Generate HTML content
    const allCanvases = processedPages.map((page, index) => {
      const pageElements = page.elements
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
        .map(element => {
          if (element.type === 'text') {
            const fontSize = element.properties.fontSize || 16;
            const lineHeight = element.properties.lineHeight || 1.2;
            const textAlign = element.properties.textAlign || 'left';

            let textContent;
            if (element.properties.listStyle === 'bullet') {
              const lines = element.properties.text.split('\n').filter(line => line.trim() !== '');
              textContent = lines.map(line => `• ${line}`).join('<br>');
            } else {
              textContent = element.properties.text.replace(/\n/g, '<br>');
            }

            const containerStyle = `
              position: absolute;
              left: ${Math.round(element.x || 0)}px;
              top: ${Math.round(element.y || 0)}px;
              width: ${Math.round(element.width || 100)}px;
              height: ${Math.round(element.height || 30)}px;
              z-index: ${element.zIndex || 1};
              transform: rotate(${element.rotation || 0}deg);
              transform-origin: center;
              box-sizing: border-box;
              overflow: hidden;
            `;

            const getFontFamily = (fontFamily) => {
              return `'${fontFamily || 'Arial'}', sans-serif`;
            };

            const textStyle = `
              font-size: ${fontSize}px;
              font-family: ${getFontFamily(element.properties.fontFamily)};
              color: ${element.properties.color || '#000000'};
              font-weight: ${element.properties.bold ? 'bold' : 'normal'};
              font-style: ${element.properties.italic ? 'italic' : 'normal'};
              text-align: ${textAlign};
              text-decoration: ${element.properties.underline ? 'underline' : 'none'};
              line-height: ${lineHeight};
              letter-spacing: ${(element.properties.letterSpacing || 0)}px;
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              word-wrap: break-word;
              word-break: break-word;
              overflow-wrap: break-word;
              hyphens: auto;
              white-space: pre-wrap;
            `;

            return `
              <div style="${containerStyle}">
                <div style="${textStyle}">${textContent}</div>
              </div>
            `;
          }
          else if (element.type === 'image') {
            // Compose transform for rotation and flip
            const transforms = [];
            if (element.properties.flipHorizontal) {
              transforms.push('scaleX(-1)');
            }
            if (element.properties.flipVertical) {
              transforms.push('scaleY(-1)');
            }
            if (element.rotation && element.rotation !== 0) {
              transforms.push(`rotate(${element.rotation}deg)`);
            }
            const transformStyle = transforms.length > 0 ? transforms.join(' ') : 'none';
            const borderRadius = element.properties.borderRadius || 0;
            return `
              <div style="
                position: absolute;
                left: ${Math.round(element.x)}px;
                top: ${Math.round(element.y)}px;
                width: ${Math.round(element.width)}px;
                height: ${Math.round(element.height)}px;
                z-index: ${element.zIndex || 1};
                overflow: hidden;
              ">
                <img src="${element.properties.src}" 
                     alt="Exported image"
                     style="
                       width: 100%;
                       height: 100%;
                       object-fit: ${element.properties.fit === 'stretch' ? 'fill' :
                element.properties.fit === 'scale-down' ? 'scale-down' :
                  (element.properties.fit || 'contain')};
                       display: block;
                       border-radius: ${borderRadius}px;
                       transform: ${transformStyle};
                     " 
                     onload="this.style.opacity='1'" 
                     onerror="this.style.display='none'"
                />
              </div>
            `;
          }
          else if (element.type === 'svg') {
            let svgContent = element.properties.svgContent;
            if (!svgContent.includes('viewBox') && !svgContent.includes('width=') && !svgContent.includes('height=')) {
              svgContent = svgContent.replace('<svg', `<svg width="100%" height="100%" viewBox="0 0 ${element.width} ${element.height}"`);
            }

            return `
              <div style="
                position: absolute;
                left: ${Math.round(element.x)}px;
                top: ${Math.round(element.y)}px;
                width: ${Math.round(element.width)}px;
                height: ${Math.round(element.height)}px;
                z-index: ${element.zIndex || 1};
                transform: rotate(${element.rotation || 0}deg);
                transform-origin: center;
                overflow: hidden;
              ">
                ${svgContent}
              </div>
            `;
          }
          else if (element.type === 'shape') {
            const {
              fill = '#f3f4f6',
              stroke = '#111827',
              strokeWidth = 2,
              opacity = 1,
              rx = 0,
              strokeDasharray,
              shadow = false,
              shadowBlur = 0,
              shadowColor = '#000',
            } = element.properties || {};

            const shapeType = element.shapeType || 'rectangle';
            let svgContent = '';



            // Generate SVG content based on shape type
            switch (shapeType) {
              case 'rectangle':
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${element.width} ${element.height}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <rect
                      x="${(strokeWidth || 0) / 2}"
                      y="${(strokeWidth || 0) / 2}"
                      width="${element.width - (strokeWidth || 0)}"
                      height="${element.height - (strokeWidth || 0)}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      rx="${rx}"
                      ry="${rx}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              case 'ellipse':
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${element.width} ${element.height}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <ellipse
                      cx="${element.width / 2}"
                      cy="${element.height / 2}"
                      rx="${(element.width - (strokeWidth || 0)) / 2}"
                      ry="${(element.height - (strokeWidth || 0)) / 2}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              case 'triangle': {
                const w = element.width, h = element.height;
                const strokeOffset = (strokeWidth || 0);
                const points = `${w / 2},${strokeOffset} ${w - strokeOffset},${h - strokeOffset} ${strokeOffset},${h - strokeOffset}`;
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <polygon
                      points="${points}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'diamond': {
                const points = `${element.width / 2},0 ${element.width},${element.height / 2} ${element.width / 2},${element.height} 0,${element.height / 2}`;
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${element.width} ${element.height}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <polygon
                      points="${points}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'hexagon': {
                const w = element.width, h = element.height;
                const strokeOffset = (strokeWidth || 0);
                const points = [
                  [w * 0.25 + strokeOffset, strokeOffset],
                  [w * 0.75 - strokeOffset, strokeOffset],
                  [w - strokeOffset, h / 2],
                  [w * 0.75 - strokeOffset, h - strokeOffset],
                  [w * 0.25 + strokeOffset, h - strokeOffset],
                  [strokeOffset, h / 2]
                ].map(p => p.join(',')).join(' ');
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <polygon
                      points="${points}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                                        ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                  ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                />
              </svg>
            `;
                break;
              }
              case 'pentagon': {
                const spikes = 5;
                const w = element.width, h = element.height;
                const cx = w / 2;
                const cy = h / 2;
                const outerRadiusX = w / 2;
                const outerRadiusY = h / 2;
                const innerRadiusX = w / 2.5;
                const innerRadiusY = h / 2.5;
                let points = '';
                for (let i = 0; i < spikes * 2; i++) {
                  const isOuter = i % 2 === 0;
                  const angle = (Math.PI / spikes) * i - Math.PI / 2;
                  const rX = isOuter ? outerRadiusX : innerRadiusX;
                  const rY = isOuter ? outerRadiusY : innerRadiusY;
                  points += `${cx + rX * Math.cos(angle)},${cy + rY * Math.sin(angle)} `;
                }
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <polygon
                      points="${points.trim()}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'octagon': {
                const r = Math.min(element.width, element.height) / 2;
                const cx = element.width / 2;
                const cy = element.height / 2;
                const points = Array.from({ length: 8 }).map((_, i) => {
                  const angle = (Math.PI / 8) + (i * 2 * Math.PI / 8);
                  return `${cx + r * Math.cos(angle)},${cy - r * Math.sin(angle)}`;
                }).join(' ');
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${element.width} ${element.height}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <polygon
                      points="${points}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'star': {
                const spikes = 5;
                const w = element.width, h = element.height;
                const cx = w / 2;
                const cy = h / 2;
                const strokeOffset = (strokeWidth || 0);
                const outerRadiusX = (w / 2) - strokeOffset;
                const outerRadiusY = (h / 2) - strokeOffset;
                const innerRatio = 0.382;
                const innerRadiusX = outerRadiusX * innerRatio;
                const innerRadiusY = outerRadiusY * innerRatio;
                let points = '';
                for (let i = 0; i < spikes * 2; i++) {
                  const isOuter = i % 2 === 0;
                  const angle = (Math.PI / spikes) * i - Math.PI / 2;
                  const rX = isOuter ? outerRadiusX : innerRadiusX;
                  const rY = isOuter ? outerRadiusY : innerRadiusY;
                  points += `${cx + rX * Math.cos(angle)},${cy + rY * Math.sin(angle)} `;
                }
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <polygon
                      points="${points.trim()}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'line': {
                const w = element.width, h = element.height;
                let lineStroke = stroke;
                if (!lineStroke || lineStroke === 'none' || lineStroke === '#00000000' || lineStroke === 'transparent') {
                  lineStroke = '#111827';
                }
                const lineStrokeWidth = !strokeWidth || strokeWidth === 0 ? 2 : strokeWidth;
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <line
                      x1="0"
                      y1="${h / 2}"
                      x2="${w}"
                      y2="${h / 2}"
                      stroke="${lineStroke}"
                      stroke-width="${lineStrokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'parallelogram': {
                const offset = element.width * 0.2;
                const points = `${offset},0 ${element.width},0 ${element.width - offset},${element.height} 0,${element.height}`;
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${element.width} ${element.height}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <polygon
                      points="${points}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'trapezoid': {
                const offset = element.width * 0.2;
                const points = `${offset},0 ${element.width - offset},0 ${element.width},${element.height} 0,${element.height}`;
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${element.width} ${element.height}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <polygon
                      points="${points}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'chevron': {
                const offset = element.width * 0.2;
                const points = `0,0 ${element.width - offset},0 ${element.width},${element.height / 2} ${element.width - offset},${element.height} 0,${element.height} ${offset},${element.height / 2}`;
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${element.width} ${element.height}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <polygon
                      points="${points}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'bookmark': {
                const w = element.width;
                const h = element.height;
                const path = `M0,0 H${w} V${h} L${w / 2},${h * 0.7} L0,${h} Z`;
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <path
                      d="${path}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'heart': {
                const w = element.width, h = element.height;
                const path = `M ${w / 2},${h * 0.8} C ${w * 0.05},${h * 0.55} ${w * 0.2},${h * 0.05} ${w / 2},${h * 0.3} C ${w * 0.8},${h * 0.05} ${w * 0.95},${h * 0.55} ${w / 2},${h * 0.8} Z`;
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <path
                      d="${path}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'cloud': {
                const w = element.width, h = element.height;
                const path = `M${w * 0.25},${h * 0.7} Q0,${h * 0.7} 0,${h * 0.5} Q0,${h * 0.3} ${w * 0.2},${h * 0.3} Q${w * 0.25},0 ${w * 0.5},${h * 0.1} Q${w * 0.75},0 ${w * 0.8},${h * 0.3} Q${w},${h * 0.3} ${w},${h * 0.5} Q${w},${h * 0.7} ${w * 0.75},${h * 0.7} Z`;
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <path
                      d="${path}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'sun': {
                const w = element.width, h = element.height;
                const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.25;
                const rays = Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 2 * Math.PI) / 12;
                  const x1 = cx + Math.cos(angle) * r;
                  const y1 = cy + Math.sin(angle) * r;
                  const x2 = cx + Math.cos(angle) * r * 1.5;
                  const y2 = cy + Math.sin(angle) * r * 1.5;
                  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeWidth / 2}" opacity="${opacity}" ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''} ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}/>`;
                }).join('');
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''} ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}/>
                    ${rays}
                  </svg>
                `;
                break;
              }
              case 'crescent': {
                const w = element.width, h = element.height;
                const cx = w / 2;
                const cy = h / 2;
                const r = Math.min(w, h) / 2 * 0.9;
                const d = r * 0.4;
                const intersectY = Math.sqrt(r * r - d * d);
                const path = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx + d} ${cy - intersectY} A ${r} ${r} 0 0 0 ${cx + d} ${cy + intersectY} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${r} ${r} 0 0 1 ${cx} ${cy - r} Z`;
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <path
                      d="${path}"
                      fill="${fill}"
                      fill-rule="nonzero"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'speechBubble': {
                const w = element.width, h = element.height;
                const radius = Math.min(w, h) * 0.1;
                const tailSize = Math.min(w, h) * 0.15;
                const bubbleHeight = h - tailSize;
                const path = `M${radius},0 L${w - radius},0 Q${w},0 ${w},${radius} L${w},${bubbleHeight - radius} Q${w},${bubbleHeight} ${w - radius},${bubbleHeight} L${w * 0.3},${bubbleHeight} L${w * 0.2},${h} L${w * 0.25},${bubbleHeight} L${radius},${bubbleHeight} Q0,${bubbleHeight} 0,${bubbleHeight - radius} L0,${radius} Q0,0 ${radius},0 Z`;
                svgContent = `
                  <svg viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;" preserveAspectRatio="none">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <path
                      d="${path}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'arrow': {
                const w = element.width, h = element.height;
                const strokeOffset = (strokeWidth || 0) / 2;
                const arrowHeadSize = Math.max(10, h * 0.15);
                const shaftEnd = w - arrowHeadSize;
                const arrowTip = w + arrowHeadSize;
                const arrowTop = h / 2 - arrowHeadSize / 2;
                const arrowBottom = h / 2 + arrowHeadSize / 2;
                svgContent = `
                  <svg viewBox="0 0 ${w + arrowHeadSize} ${h}" style="width: 100%; height: 100%;" preserveAspectRatio="none">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <line x1="${strokeOffset}" y1="${h / 2}" x2="${w}" y2="${h / 2}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''} ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}/>
                    <line x1="${shaftEnd}" y1="${arrowTop}" x2="${arrowTip}" y2="${h / 2}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''} ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}/>
                    <line x1="${shaftEnd}" y1="${arrowBottom}" x2="${arrowTip}" y2="${h / 2}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''} ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}/>
                  </svg>
                `;
                break;
              }
              case 'rightArrow': {
                const w = element.width, h = element.height;
                const points = [
                  [w * 0.15, h * 0.35],
                  [w * 0.7, h * 0.35],
                  [w * 0.7, 0],
                  [w, h / 2],
                  [w * 0.7, h],
                  [w * 0.7, h * 0.65],
                  [w * 0.15, h * 0.65]
                ].map(p => p.join(",")).join(" ");
                svgContent = `
                  <svg width="60%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 60%; height: 100%; margin: 0 20%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <polygon
                      points="${points}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray && strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'leftArrow': {
                const w = element.width, h = element.height;
                const points = [
                  [w * 0.85, h * 0.35],
                  [w * 0.3, h * 0.35],
                  [w * 0.3, 0],
                  [0, h / 2],
                  [w * 0.3, h],
                  [w * 0.3, h * 0.65],
                  [w * 0.85, h * 0.65]
                ].map(p => p.join(",")).join(" ");
                svgContent = `
                  <svg width="60%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 60%; height: 100%; margin: 0 20%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <polygon
                      points="${points}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray && strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'upArrow': {
                const w = element.width, h = element.height;
                const points = [
                  [w * 0.35, h * 0.85],
                  [w * 0.35, h * 0.3],
                  [0, h * 0.3],
                  [w / 2, 0],
                  [w, h * 0.3],
                  [w * 0.65, h * 0.3],
                  [w * 0.65, h * 0.85]
                ].map(p => p.join(",")).join(" ");
                svgContent = `
                  <svg width="60%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 60%; height: 100%; margin: 0 20%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <polygon
                      points="${points}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray && strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'downArrow': {
                const w = element.width, h = element.height;
                const points = [
                  [w * 0.35, h * 0.15],
                  [w * 0.35, h * 0.7],
                  [0, h * 0.7],
                  [w / 2, h],
                  [w, h * 0.7],
                  [w * 0.65, h * 0.7],
                  [w * 0.65, h * 0.15]
                ].map(p => p.join(",")).join(" ");
                svgContent = `
                  <svg width="60%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 60%; height: 100%; margin: 0 20%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <polygon
                      points="${points}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray && strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'lightning': {
                const w = element.width, h = element.height;
                const points = [
                  [w * 0.4, 0],
                  [w * 0.6, 0],
                  [w * 0.5, h * 0.4],
                  [w * 0.7, h * 0.4],
                  [w * 0.3, h],
                  [w * 0.4, h * 0.6],
                  [w * 0.3, h * 0.6]
                ].map(p => p.join(',')).join(' ');
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <polygon
                      points="${points}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              case 'plus': {
                const w = element.width, h = element.height;
                const lineLength = 0.6;
                const verticalStart = h * (1 - lineLength) / 2;
                const verticalEnd = h * (1 + lineLength) / 2;
                const horizontalStart = w * (1 - lineLength) / 2;
                const horizontalEnd = w * (1 + lineLength) / 2;
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <line x1="${w / 2}" y1="${verticalStart}" x2="${w / 2}" y2="${verticalEnd}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''} ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}/>
                    <line x1="${horizontalStart}" y1="${h / 2}" x2="${horizontalEnd}" y2="${h / 2}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''} ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}/>
                  </svg>
                `;
                break;
              }
              case 'minus': {
                const w = element.width, h = element.height;
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <line x1="${w * 0.2}" y1="${h / 2}" x2="${w * 0.8}" y2="${h / 2}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''} ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}/>
                  </svg>
                `;
                break;
              }
              case 'exclamation': {
                const w = element.width, h = element.height;
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <rect x="${w / 2 - 2}" y="${h * 0.2}" width="4" height="${h * 0.5}" fill="${stroke}" opacity="${opacity}" ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}/>
                    <circle cx="${w / 2}" cy="${h * 0.8}" r="4" fill="${stroke}" opacity="${opacity}" ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}/>
                  </svg>
                `;
                break;
              }
              case 'cross': {
                const w = element.width, h = element.height;
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <line x1="${w * 0.2}" y1="${h * 0.2}" x2="${w * 0.8}" y2="${h * 0.8}" stroke="${stroke}" stroke-width="${strokeWidth * 2}" opacity="${opacity}" ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''} ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}/>
                    <line x1="${w * 0.8}" y1="${h * 0.2}" x2="${w * 0.2}" y2="${h * 0.8}" stroke="${stroke}" stroke-width="${strokeWidth * 2}" opacity="${opacity}" ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''} ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}/>
                  </svg>
                `;
                break;
              }
              case 'checkmark': {
                const w = element.width, h = element.height;
                const points = [
                  [w * 0.05, h * 0.55],
                  [w * 0.4, h * 0.95],
                  [w * 0.95, h * 0.05]
                ].map(p => p.join(',')).join(' ');
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <polyline
                      points="${points}"
                      fill="none"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth * 2}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
                break;
              }
              default:
                // Default to rectangle for unknown shapes
                svgContent = `
                  <svg width="100%" height="100%" viewBox="0 0 ${element.width} ${element.height}" style="width: 100%; height: 100%;">
                    ${shadow && shadowBlur > 0 ? `<defs><filter id="shape-shadow-${element.id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${shadowBlur}" floodColor="${shadowColor}" floodOpacity="1" /></filter></defs>` : ''}
                    <rect
                      x="${(strokeWidth || 0) / 2}"
                      y="${(strokeWidth || 0) / 2}"
                      width="${element.width - (strokeWidth || 0)}"
                      height="${element.height - (strokeWidth || 0)}"
                      fill="${fill}"
                      stroke="${stroke}"
                      stroke-width="${strokeWidth}"
                      rx="${rx}"
                      ry="${rx}"
                      opacity="${opacity}"
                      ${strokeDasharray !== 'none' ? `stroke-dasharray="${strokeDasharray}"` : ''}
                      ${shadow && shadowBlur > 0 ? `filter="url(#shape-shadow-${element.id})"` : ''}
                    />
                  </svg>
                `;
            }

            return `
              <div style="
                position: absolute;
                left: ${Math.round(element.x)}px;
                top: ${Math.round(element.y)}px;
                width: ${Math.round(element.width)}px;
                height: ${Math.round(element.height)}px;
                z-index: ${element.zIndex || 1};
                transform: rotate(${element.rotation || 0}deg);
                transform-origin: center;
                overflow: hidden;
              ">
                ${svgContent}
              </div>
            `;
          }

          return '';
        }).join('');

      let backgroundStyle = '';
      if (page.pageSettings.background.type === 'color') {
        backgroundStyle = `background-color: ${page.pageSettings.background.value};`;
      } else if (page.pageSettings.background.type === 'gradient') {
        backgroundStyle = `background: ${page.pageSettings.background.value};`;
      } else if (page.pageSettings.background.type === 'image') {
        backgroundStyle = `
          background-image: url('${page.pageSettings.background.value}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        `;
      } else if (page.pageSettings.background.type === 'svg') {
        const encodedSvg = encodeURIComponent(page.pageSettings.background.value);
        backgroundStyle = `
          background-image: url('data:image/svg+xml;charset=utf-8,${encodedSvg}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        `;
      }

      return `
        <div class="page" style="
          position: relative;
          width: ${page.pageSettings.width}px;
          height: ${page.pageSettings.height}px;
          ${backgroundStyle}
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          overflow: hidden;
          page-break-after: ${index < processedPages.length - 1 ? 'always' : 'auto'};
          page-break-inside: avoid;
        ">
          ${pageElements}
        </div>
      `;
    }).join('');

    // Create HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Canva Export - PDF</title>
          <meta charset="UTF-8">
          <style>
            @page {
              margin: 0;
              padding: 0;
              size: ${processedPages[0].pageSettings.width}px ${processedPages[0].pageSettings.height}px;
            }
            
            * {
              box-sizing: border-box;
            }
            
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              font-family: Arial, sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              text-rendering: optimizeLegibility;
              font-feature-settings: "liga", "kern";
            }
            

            
            .page {
              position: relative;
              display: block;
            }
            
            img {
              max-width: 100%;
              height: auto;
            }
            
            svg {
              max-width: 100%;
              max-height: 100%;
            }
            
            div[style*="position: absolute"] {
              overflow: hidden;
            }
            

            
            @media print {
              html, body {
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              .page {
                page-break-inside: avoid !important;
              }
              
              img {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              div[style*="background"] {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              div[style*="position: absolute"] {
                overflow: hidden !important;
                position: absolute !important;
              }
              

            }
            
            @media screen {
              body {
                background: #f0f0f0;
                padding: 20px;
              }
              
              .page {
                margin: 0 auto 20px auto;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
              }
            }
          </style>
        </head>
        <body>
          ${allCanvases}
          <script>
            const images = document.querySelectorAll('img');
            let loadedImages = 0;
            const totalImages = images.length;
            
            if (totalImages === 0) {
              setTimeout(() => {
                window.print();
                setTimeout(() => window.close(), 100);
              }, 500);
            } else {
              images.forEach(img => {
                if (img.complete) {
                  loadedImages++;
                } else {
                  img.onload = img.onerror = () => {
                    loadedImages++;
                    if (loadedImages === totalImages) {
                      setTimeout(() => {
                        window.print();
                        setTimeout(() => window.close(), 100);
                      }, 500);
                    }
                  };
                }
              });
              
              if (loadedImages === totalImages) {
                setTimeout(() => {
                  window.print();
                  setTimeout(() => window.close(), 100);
                }, 500);
              }
            }
          </script>
        </body>
      </html>
    `;

    // Create blob URL instead of using data URL to avoid length limits
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);

    // Open in new window
    window.open(blobUrl, '_blank');

    // Clean up blob URL after a delay
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 10000);

  } catch (error) {
    console.error('PDF export error:', error);
    alert('Error exporting PDF. Please try again.');
  } finally {
    // Remove loading indicator
    document.body.removeChild(loadingDiv);
  }
};

// Export project as optimized SVG
export function exportToOptimizedSVG(project) {
  try {
    const page = project.pages[project.currentPage || 0];
    if (!page) {
      throw new Error('No page found to export');
    }

    // Create SVG content from page elements
    const svgContent = generateSVGFromPage(page);

    // Optimize the SVG using SVGO
    const optimizedSVG = optimizeSVG(svgContent);

    // Get optimization statistics
    const stats = getOptimizationStats(svgContent, optimizedSVG);

    // Create download
    const blob = new Blob([optimizedSVG], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `canva-export-${timestamp}.svg`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);

    return { success: true, stats };
  } catch (error) {
    console.error('SVG export error:', error);
    return { success: false, error: error.message };
  }
}

// Generate SVG content from page elements
function generateSVGFromPage(page) {
  const { pageSettings, elements } = page;
  const { width, height } = pageSettings;

  // Sort elements by z-index
  const sortedElements = elements.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  // Generate background
  let backgroundElement = '';
  if (pageSettings.background) {
    if (pageSettings.background.type === 'color') {
      backgroundElement = `<rect width="100%" height="100%" fill="${pageSettings.background.value}"/>`;
    } else if (pageSettings.background.type === 'gradient') {
      // Handle gradient backgrounds
      backgroundElement = `<defs><linearGradient id="bg-gradient"><stop offset="0%" style="stop-color:${pageSettings.background.value.split(',')[0]};stop-opacity:1" /><stop offset="100%" style="stop-color:${pageSettings.background.value.split(',')[1]};stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#bg-gradient)"/>`;
    }
  }

  // Generate elements
  const elementSVGs = sortedElements.map(element => {
    if (element.type === 'text') {
      return generateTextSVG(element);
    } else if (element.type === 'image') {
      return generateImageSVG(element);
    } else if (element.type === 'svg') {
      return generateEmbeddedSVG(element);
    } else if (element.type === 'shape') {
      return generateShapeSVG(element);
    }
    return '';
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${backgroundElement}
  ${elementSVGs}
</svg>`;
}

// Generate SVG for text elements
function generateTextSVG(element) {
  const { x, y, width, height, rotation = 0, properties } = element;
  const { text, fontSize = 16, fontFamily = 'Arial', color = '#000000', bold, italic, textAlign = 'left' } = properties;

  const fontWeight = bold ? 'bold' : 'normal';
  const fontStyle = italic ? 'italic' : 'normal';
  const textAnchor = textAlign === 'center' ? 'middle' : textAlign === 'right' ? 'end' : 'start';

  const getSVGFontFamily = (fontFamily) => {
    return fontFamily;
  };

  const transform = rotation !== 0 ? `transform="rotate(${rotation} ${x + width / 2} ${y + height / 2})"` : '';

  return `<text x="${x + (textAlign === 'center' ? width / 2 : textAlign === 'right' ? width : 0)}" y="${y + fontSize}"
    font-family="${getSVGFontFamily(fontFamily)}" font-size="${fontSize}" fill="${color}"
    font-weight="${fontWeight}" font-style="${fontStyle}" text-anchor="${textAnchor}"
    ${transform}>${text}</text>`;
}

function generateImageSVG(element) {
  // Minimal implementation for SVG image export
  const { x, y, width, height, rotation = 0, properties } = element;
  const { src } = properties;
  const transform = rotation !== 0 ? `transform="rotate(${rotation} ${x + width / 2} ${y + height / 2})"` : '';
  return `<image x="${x}" y="${y}" width="${width}" height="${height}" href="${src}" ${transform}/>`;
}

function generateEmbeddedSVG(element) {
  // Minimal implementation for embedded SVG export
  const { x, y, width, height, rotation = 0, properties } = element;
  let svgContent = properties.svgContent;
  if (!svgContent.includes('viewBox') && !svgContent.includes('width=') && !svgContent.includes('height=')) {
    svgContent = svgContent.replace('<svg', `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}"`);
  }
  // Optionally wrap in a <g> with transform for rotation
  if (rotation && rotation !== 0) {
    return `<g transform="rotate(${rotation} ${x + width / 2} ${y + height / 2})"><svg x="${x}" y="${y}" width="${width}" height="${height}">${svgContent}</svg></g>`;
  }
  return `<svg x="${x}" y="${y}" width="${width}" height="${height}">${svgContent}</svg>`;
}

function generateShapeSVG(element) {
  // Minimal implementation for shape export (rectangle as example)
  const { x, y, width, height, properties } = element;
  const { fill = '#000', stroke = '#000', strokeWidth = 1 } = properties;
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
}