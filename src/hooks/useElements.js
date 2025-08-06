import { useCallback } from 'react';

export const useElements = (project, setProject, generateId, currentEditingPage, setSelectedElement) => {
  const updateElement = useCallback((pageIndex, elementId, updates) => {
    const page = project.pages[pageIndex];
    if (!page) return;
    
    // Check if element is being moved or resized
    if (updates.x !== undefined || updates.y !== undefined || updates.width !== undefined || updates.height !== undefined) {
      const element = page.elements.find(el => el.id === elementId);
      const newX = updates.x !== undefined ? updates.x : element.x;
      const newY = updates.y !== undefined ? updates.y : element.y;
      const newWidth = updates.width !== undefined ? updates.width : element.width;
      const newHeight = updates.height !== undefined ? updates.height : element.height;
      
      // Check if element is fully outside the canvas bounds
      const isFullyOutside = 
        newX + newWidth < 0 || 
        newY + newHeight < 0 || 
        newX > page.pageSettings.width || 
        newY > page.pageSettings.height;
      
      // If element is fully outside, don't update it (let useInteraction handle deletion)
      if (isFullyOutside) {
        return;
      }
      
      // Apply updates without boundary constraints
      updates.x = newX;
      updates.y = newY;
      updates.width = Math.max(20, newWidth);
      updates.height = Math.max(20, newHeight);
    }
    
    setProject(prev => {
      const newProject = {
        ...prev,
        pages: prev.pages.map((p, idx) =>
          idx === pageIndex
            ? {
                ...p,
                elements: p.elements.map(el => 
                  el.id === elementId 
                    ? { ...el, ...updates }
                    : el
                )
              }
            : p
        )
      };
      

      
      return newProject;
    });
  }, [project, setProject]);

  const deleteElement = useCallback((pageIndex, elementId, onComplete) => {
    setProject(prev => {
      const newProject = {
        ...prev,
        pages: prev.pages.map((p, idx) => 
          idx === pageIndex 
            ? { ...p, elements: p.elements.filter(el => el.id !== elementId) }
            : p
        )
      };
      
      // Call onComplete with the updated project if provided
      if (onComplete) {
        setTimeout(() => onComplete(newProject), 0);
      }
      
      return newProject;
    });
    setSelectedElement({ pageIndex: 0, elementId: null });
  }, [setProject, setSelectedElement]);

  const addTextElement = useCallback((onComplete) => {
    const pageIndex = currentEditingPage;
    const page = project.pages[pageIndex];
    const newElement = {
      id: generateId(),
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      zIndex: page.elements.length + 1,
      properties: {
        text: 'Click to edit text',
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#000000',
        bold: false,
        italic: false,
        underline: false,
        textAlign: 'left',
        listStyle: 'none',
        lineHeight: 1.2,
        letterSpacing: 0
      }
    };
    
    setProject(prev => {
      const newProject = {
        ...prev,
        pages: prev.pages.map((p, idx) => 
          idx === pageIndex 
            ? { ...p, elements: [...p.elements, newElement] }
            : p
        )
      };
      
      // Call the callback with the updated state immediately
      if (onComplete) {
        onComplete(newProject);
      }
      
      return newProject;
    });
    setSelectedElement({ pageIndex, elementId: newElement.id });
  }, [currentEditingPage, project, generateId, setProject, setSelectedElement]);

  const addCustomTextElement = useCallback((customElement, onComplete) => {
    const pageIndex = currentEditingPage;
    const page = project.pages[pageIndex];
    const newElement = {
      ...customElement,
      id: generateId(),
      zIndex: page.elements.length + 1,
    };
    
    setProject(prev => {
      const newProject = {
        ...prev,
        pages: prev.pages.map((p, idx) => 
          idx === pageIndex 
            ? { ...p, elements: [...p.elements, newElement] }
            : p
        )
      };
      
      // Call the callback with the updated state immediately
      if (onComplete) {
        onComplete(newProject);
      }
      
      return newProject;
    });
    setSelectedElement({ pageIndex, elementId: newElement.id });
    
    return newElement.id; // Return the element ID
  }, [currentEditingPage, project, generateId, setProject, setSelectedElement]);

  const addImageElement = useCallback((src, onComplete) => {
    const pageIndex = currentEditingPage;
    const page = project.pages[pageIndex];
    const newElement = {
      id: generateId(),
      type: 'image',
      x: 150,
      y: 150,
      width: 200,
      height: 200,
      rotation: 0,
      zIndex: page.elements.length + 1,
      properties: {
        src: src,
        fit: 'contain'
      }
    };
    
    setProject(prev => {
      const newProject = {
        ...prev,
        pages: prev.pages.map((p, idx) => 
          idx === pageIndex 
            ? { ...p, elements: [...p.elements, newElement] }
            : p
        )
      };
      
      // Call the callback with the updated state immediately
      if (onComplete) {
        onComplete(newProject);
      }
      
      return newProject;
    });
    setSelectedElement({ pageIndex, elementId: newElement.id });
  }, [currentEditingPage, project, generateId, setProject, setSelectedElement]);

  const addShapeElement = useCallback((shapeType, onComplete) => {
    const pageIndex = currentEditingPage;
    const page = project.pages[pageIndex];
    let newElement = null;
    const base = {
      id: generateId(),
      type: 'shape',
      shapeType,
      x: 120,
      y: 120,
      width: 120,
      height: 80,
      rotation: 0,
      zIndex: page.elements.length + 1,
      properties: {
        fill: '#f3f4f6',
        stroke: '#111827',
        strokeWidth: 2
      }
    };

    // Shape-specific dimensions
    const shapeConfig = {
      rectangle: { width: 120, height: 80 },
      ellipse: { width: 100, height: 100 },
      line: { width: 120, height: 20 },
      triangle: { width: 100, height: 90 },
      pentagon: { width: 100, height: 100 },
      diamond: { width: 100, height: 100 },
      hexagon: { width: 100, height: 100 },
      octagon: { width: 100, height: 100 },
      star: { width: 100, height: 100 },
      heart: { width: 100, height: 100 },
      cloud: { width: 120, height: 80 },
      arrow: { width: 120, height: 40 },
      rightArrow: { width: 120, height: 40 },
      leftArrow: { width: 120, height: 40 },
      upArrow: { width: 40, height: 120 },
      downArrow: { width: 40, height: 120 },
      parallelogram: { width: 120, height: 80 },
      trapezoid: { width: 120, height: 80 },
      chevron: { width: 120, height: 40 },
      bookmark: { width: 80, height: 120 },
      lightning: { width: 80, height: 120 },
      sun: { width: 100, height: 100 },
      crescent: { width: 100, height: 100 },
      speechBubble: { width: 120, height: 80 },
      cross: { width: 80, height: 80 },
      checkmark: { width: 80, height: 80 },
      plus: { width: 80, height: 80 },
      minus: { width: 80, height: 40 },
      exclamation: { width: 40, height: 80 },
      // ... add more shapes as needed
    };

    const config = shapeConfig[shapeType] || base;
    newElement = { ...base, ...config };
    
    // Special handling for line shape to ensure proper stroke width
    if (shapeType === 'line') {
      newElement.properties = {
        ...newElement.properties,
        strokeWidth: 3
      };
    }

    setProject(prev => {
      const newProject = {
        ...prev,
        pages: prev.pages.map((p, idx) =>
          idx === pageIndex
            ? { ...p, elements: [...p.elements, newElement] }
            : p
        )
      };
      
      // Call the callback with the updated state immediately
      if (onComplete) {
        onComplete(newProject);
      }
      
      return newProject;
    });
    setSelectedElement({ pageIndex, elementId: newElement.id });
  }, [currentEditingPage, project, generateId, setProject, setSelectedElement]);

  const duplicateElement = useCallback((selectedEl, selectedElement, onComplete) => {
    if (!selectedEl) return;
    const pageIndex = selectedElement.pageIndex;
    const page = project.pages[pageIndex];
    const orig = selectedEl;
    const offset = 20;
    
    const newElement = {
      ...orig,
      id: generateId(),
      x: orig.x + offset,
      y: orig.y + offset,
      zIndex: page.elements.length + 1,
    };
    
    setProject(prev => {
      const newProject = {
        ...prev,
        pages: prev.pages.map((p, idx) =>
          idx === pageIndex
            ? { ...p, elements: [...p.elements, newElement] }
            : p
        )
      };
      
      // Call the callback with the updated state immediately
      if (onComplete) {
        onComplete(newProject);
      }
      
      return newProject;
    });
    setSelectedElement({ pageIndex, elementId: newElement.id });
  }, [project, generateId, setProject, setSelectedElement]);

  return {
    updateElement,
    deleteElement,
    addTextElement,
    addCustomTextElement,
    addImageElement,
    addShapeElement,
    duplicateElement
  };
};