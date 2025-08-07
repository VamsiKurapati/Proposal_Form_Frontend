import React from 'react';

const SVGElement = ({ element }) => {
  if (!element.properties?.svgContent) return null;

  // Check if the SVG content is a data URL
  const svgContent = element.properties.svgContent;
  const isDataUrl = svgContent.startsWith('data:image/svg+xml');

  if (isDataUrl) {
    // If it's a data URL, use it as a background image
    return (
      <div
        className="w-full h-full"
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url('${svgContent}')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
    );
  } else {
    // If it's raw SVG content, render it safely
    return (
      <div
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{ width: '100%', height: '100%' }}
      />
    );
  }
};

export default SVGElement;