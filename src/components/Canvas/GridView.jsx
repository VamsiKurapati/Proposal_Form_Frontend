import React, { useEffect } from 'react';
import GridElementRenderer from './GridElementRenderer';

const GridView = ({
  project,
  zoom,
  scrollContainerRef,
  onPageClick,
  currentEditingPage
}) => {
  // Calculate grid layout based on screen size
  const [itemsPerRow, setItemsPerRow] = React.useState(3);
  
  // Ensure proper scroll positioning
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Ensure scroll starts at the top
    scrollContainer.scrollTop = 0;
  }, []);
  
  React.useEffect(() => {
    const updateGridLayout = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerRow(1);
      } else if (width < 1024) {
        setItemsPerRow(2);
      } else if (width < 1440) {
        setItemsPerRow(3);
      } else {
        setItemsPerRow(4);
      }
    };
    
    updateGridLayout();
    window.addEventListener('resize', updateGridLayout);
    return () => window.removeEventListener('resize', updateGridLayout);
  }, []);
  
  const gridGap = 12;

  return (
    <div ref={scrollContainerRef} className="h-full overflow-auto bg-gray-200 relative" style={{ overscrollBehavior: 'contain' }}>
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="mb-4 flex-shrink-0 p-4">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-bold text-gray-800">Grid View</h2>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              Read Only
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">View all pages in a grid layout. Click the grid icon to return to edit mode.</p>
          <p className="text-xs text-gray-500">Showing {project.pages.length} page{project.pages.length !== 1 ? 's' : ''}</p>
        </div>
        
        <div 
          className="grid flex-1 px-4 pb-4"
          style={{
            gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
            gap: `${gridGap}px`,
            alignContent: project.pages.length <= itemsPerRow ? 'center' : 'start',
            justifyContent: project.pages.length <= itemsPerRow ? 'center' : 'start',
            minHeight: 'fit-content'
          }}
        >
          {project.pages.map((page, pageIndex) => (
            <div
              key={page.id}
              className={`rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-200 ${
                currentEditingPage === pageIndex 
                  ? 'bg-blue-50 border-2 border-blue-500' 
                  : 'bg-white'
              }`}
              style={{
                transition: 'transform 0.2s',
                width: 'fit-content',
                maxWidth: '100%'
              }}
              onClick={() => onPageClick(pageIndex)}
              title={`Click to edit Page ${pageIndex + 1}`}
            >
              {/* Page Header */}
              <div className={`px-2 py-1 border-b border-gray-200 ${
                currentEditingPage === pageIndex ? 'bg-blue-100' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-medium ${
                      currentEditingPage === pageIndex ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      Page {pageIndex + 1}
                    </span>
                    {currentEditingPage === pageIndex && (
                      <span className="text-xs text-blue-600 font-bold">(Current)</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {Math.round(page.pageSettings.width * 0.3)} × {Math.round(page.pageSettings.height * 0.3)}
                  </span>
                </div>
              </div>

              {/* Page Content */}
              <div
                className="relative bg-white overflow-hidden"
                style={{
                  width: `${page.pageSettings.width * 0.3}px`,
                  height: `${page.pageSettings.height * 0.3}px`,
                  backgroundColor: page.pageSettings.background.type === 'color'
                    ? page.pageSettings.background.value
                    : '#ffffff',
                  backgroundImage: page.pageSettings.background.type === 'gradient'
                    ? page.pageSettings.background.value
                    : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  boxSizing: 'border-box',
                }}
              >
                {/* SVG Background Layer */}
                {page.pageSettings.background.type === 'svg' && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ width: '100%', height: '100%', zIndex: 0 }}
                    dangerouslySetInnerHTML={{ __html: page.pageSettings.background.value }}
                  />
                )}
                
                {/* Elements - Read Only */}
                {page.elements.map((element) => {
                  // Create a scaled version of the element for grid view
                  const scaledElement = {
                    ...element,
                    x: element.x * 0.3,
                    y: element.y * 0.3,
                    width: element.width * 0.3,
                    height: element.height * 0.3
                  };
                  
                  return (
                    <div
                      key={element.id}
                      className="absolute pointer-events-none"
                      style={{
                        left: `${scaledElement.x}px`,
                        top: `${scaledElement.y}px`,
                        width: `${scaledElement.width}px`,
                        height: `${scaledElement.height}px`,
                        transform: `rotate(${element.rotation}deg)`,
                        zIndex: isNaN(element.zIndex) ? 1 : element.zIndex
                      }}
                    >
                      <GridElementRenderer
                        element={scaledElement}
                        pageIndex={pageIndex}
                        project={project}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridView; 