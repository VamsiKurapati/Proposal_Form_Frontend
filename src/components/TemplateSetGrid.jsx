import React from 'react';

const TemplateSetGrid = ({ sets, svgPreviews, setShowTemplatePreview }) => (
  <div className="grid grid-cols-2 gap-3">
    {Object.entries(sets).map(([folder, svgs]) => (
      <button
        key={folder}
        className="flex flex-col items-center border rounded p-2 bg-gray-50 hover:bg-blue-50 transition-colors min-w-0"
        onClick={() => setShowTemplatePreview(folder)}
      >
        <div className="w-16 h-20 flex items-center justify-center overflow-hidden bg-white border mb-1">
          {svgPreviews[folder] && svgPreviews[folder][0] ? (
            (() => {
              const svgContent = svgPreviews[folder][0];
              const isDataUrl = svgContent.startsWith('data:image/svg+xml');

              if (isDataUrl) {
                return (
                  <div
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
                return (
                  <div
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                  />
                );
              }
            })()
          ) : (
            <span className="text-xs text-gray-400">Loading...</span>
          )}
        </div>
        <span className="text-xs text-center">{folder}</span>
      </button>
    ))}
  </div>
);

export default TemplateSetGrid; 