// Export-related utility functions
import { optimizeSVG, getOptimizationStats } from './svg.js';
import cloudImageService from './cloudImageService.js';
import axios from 'axios';

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
    const res = await axios.post('https://proposal-form-backend.vercel.app/api/proposals/generatePDF', {
      project: project
    }, {
      responseType: 'blob' // Important: tell axios to expect binary data
    });

    console.log('PDF response received:', res.data);
    console.log('Response type:', res.data.type);
    console.log('Response size:', res.data.size);

    let pdfBlob;

    // Check if the response is actually JSON (backend might be sending base64 PDF in JSON)
    if (res.data.type === 'application/json') {
      // Convert blob to text to read the JSON content
      const jsonText = await res.data.text();
      console.log('JSON content preview:', jsonText.substring(0, 200));

      try {
        const jsonData = JSON.parse(jsonText);
        console.log('Parsed JSON keys:', Object.keys(jsonData));

        // Check if the JSON contains PDF data in various possible fields
        let pdfData = null;
        if (jsonData.pdfData || jsonData.data || jsonData.content) {
          pdfData = jsonData.pdfData || jsonData.data || jsonData.content;
        } else if (jsonData.pdf || jsonData.file || jsonData.document) {
          pdfData = jsonData.pdf || jsonData.file || jsonData.document;
        }

        if (pdfData) {
          // Check if it's already PDF data (starts with %PDF)
          if (pdfData.startsWith('%PDF-')) {
            console.log('Direct PDF data detected, creating blob...');
            pdfBlob = new Blob([pdfData], { type: 'application/pdf' });
          } else {
            // Try to convert base64 to blob
            console.log('Converting base64 to PDF blob...');
            try {
              const binaryString = atob(pdfData);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              pdfBlob = new Blob([bytes], { type: 'application/pdf' });
            } catch (base64Error) {
              console.log('Base64 conversion failed, treating as direct PDF data...');
              pdfBlob = new Blob([pdfData], { type: 'application/pdf' });
            }
          }
        } else {
          // Check if the entire JSON content is actually PDF data
          if (jsonText.startsWith('%PDF-')) {
            console.log('JSON content is actually PDF data, creating blob...');

            // Find the end of the PDF content
            const pdfEndIndex = jsonText.lastIndexOf('%%EOF');
            let finalContent = jsonText;
            if (pdfEndIndex !== -1) {
              finalContent = jsonText.substring(0, pdfEndIndex + 5);
              console.log('Truncating JSON content to PDF end marker, new length:', finalContent.length);
            }

            pdfBlob = new Blob([finalContent], { type: 'application/pdf' });
          } else {
            // Check if any of the JSON values contain PDF data
            const jsonValues = Object.values(jsonData);
            const pdfValue = jsonValues.find(value =>
              typeof value === 'string' && value.startsWith('%PDF-')
            );

            if (pdfValue) {
              console.log('PDF data found in JSON values, creating blob...');
              pdfBlob = new Blob([pdfValue], { type: 'application/pdf' });
            } else {
              // Check if the PDF content is split into individual characters
              console.log('Checking if PDF content is split into characters...');

              // Reconstruct PDF content from individual characters
              const sortedKeys = Object.keys(jsonData).sort((a, b) => parseInt(a) - parseInt(b));
              const reconstructedContent = sortedKeys.map(key => jsonData[key]).join('');

              console.log('Reconstructed content preview:', reconstructedContent.substring(0, 100));
              console.log('Total reconstructed length:', reconstructedContent.length);
              console.log('Expected length from keys:', sortedKeys.length);

              // Check for PDF structure
              const pdfEndIndex = reconstructedContent.lastIndexOf('%%EOF');
              if (pdfEndIndex !== -1) {
                console.log('PDF end marker found at position:', pdfEndIndex);
                console.log('Content after end marker:', reconstructedContent.substring(pdfEndIndex + 5, pdfEndIndex + 20));
              } else {
                console.log('No PDF end marker found');
              }

              // Check for xref table
              const xrefIndex = reconstructedContent.indexOf('xref');
              if (xrefIndex !== -1) {
                console.log('XREF table found at position:', xrefIndex);
                console.log('XREF content preview:', reconstructedContent.substring(xrefIndex, xrefIndex + 100));
              } else {
                console.log('No XREF table found');
              }

              if (reconstructedContent.startsWith('%PDF-')) {
                console.log('PDF content reconstructed from characters, creating blob...');

                // Try to find the actual end of the PDF content
                let finalContent = reconstructedContent;
                if (pdfEndIndex !== -1) {
                  finalContent = reconstructedContent.substring(0, pdfEndIndex + 5);
                  console.log('Truncating content to PDF end marker, new length:', finalContent.length);
                }

                pdfBlob = new Blob([finalContent], { type: 'application/pdf' });
              } else {
                console.log('Available JSON keys:', Object.keys(jsonData));
                console.log('JSON values preview:', jsonValues.map(v =>
                  typeof v === 'string' ? v.substring(0, 50) : typeof v
                ));
                throw new Error('No PDF data found in JSON response');
              }
            }
          }
        }
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        throw new Error('Invalid response format from backend');
      }
    } else if (res.data.type === 'application/pdf') {
      // Direct PDF response
      pdfBlob = res.data;
    } else {
      // Try to treat as PDF anyway
      pdfBlob = new Blob([res.data], { type: 'application/pdf' });
    }

    const blobUrl = URL.createObjectURL(pdfBlob);

    // Create download link for the PDF
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `proposal-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Also provide option to view in new tab
    const viewLink = document.createElement('a');
    viewLink.href = blobUrl;
    viewLink.target = '_blank';
    viewLink.textContent = 'View PDF';
    viewLink.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #007bff;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      text-decoration: none;
      z-index: 10000;
      font-family: Arial, sans-serif;
    `;
    document.body.appendChild(viewLink);

    // Remove view link after 10 seconds
    setTimeout(() => {
      if (document.body.contains(viewLink)) {
        document.body.removeChild(viewLink);
      }
    }, 10000);

    // Clean up blob URL after a delay
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 10000);

  } catch (error) {
    console.error('PDF export error:', error);

    // Show more detailed error message
    let errorMessage = 'Error exporting PDF. ';
    if (error.message.includes('Invalid response format')) {
      errorMessage += 'Backend returned invalid format. Please check backend logs.';
    } else if (error.message.includes('No PDF data found')) {
      errorMessage += 'No PDF data found in response. Please check backend implementation.';
    } else {
      errorMessage += 'Please try again or contact support.';
    }

    alert(errorMessage);
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