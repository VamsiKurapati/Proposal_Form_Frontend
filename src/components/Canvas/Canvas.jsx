import React, { useEffect } from 'react';
import CanvasPage from './CanvasPage';

const Canvas = ({
  project,
  zoom,
  currentEditingPage,
  selectedElement,
  canvasRefs,
  scrollContainerRef,
  handleMouseDown,
  handleResizeMouseDown,
  isEditing,
  setIsEditing,
  updateElement,
  setSelectedElement,
  setCurrentEditingPage,
  draggedElement
}) => {
  
  // Function to determine which update function to use based on element type
  const getUpdateFunction = (elementType) => {
    // For text elements, we'll use the regular updateElement (which should be updateElementWithHistory)
    // The debouncing will be handled in the TextElement component itself
    return updateElement;
  };

  // Ensure proper scroll positioning
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Ensure scroll starts at the top
    scrollContainer.scrollTop = 0;

    // Reset scroll position when zoom changes
    const resetScroll = () => {
      scrollContainer.scrollTop = 0;
    };

    resetScroll();
  }, [zoom]);

  return (
    <div ref={scrollContainerRef} className="h-full overflow-auto bg-gray-200 relative" style={{ 
      overscrollBehavior: 'contain',
      paddingTop: '0'
    }}>
      <div className="flex flex-col items-center w-full bg-gray-200" style={{ 
        minHeight: '100%'
      }}>
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s',
            width: 'fit-content',
            marginTop: '80px',
            marginBottom: '20px'
          }}
        >
          {project.pages.map((page, pageIndex) => (
            <CanvasPage
              key={page.id}
              page={page}
              pageIndex={pageIndex}
              currentEditingPage={currentEditingPage}
              selectedElement={selectedElement}
              canvasRefs={canvasRefs}
              handleMouseDown={handleMouseDown}
              handleResizeMouseDown={handleResizeMouseDown}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              updateElement={getUpdateFunction()}
              setSelectedElement={setSelectedElement}
              setCurrentEditingPage={setCurrentEditingPage}
              project={project}
              draggedElement={draggedElement}
              zoom={zoom}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Canvas;