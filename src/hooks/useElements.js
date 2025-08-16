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
      updates.width = Math.max(5, Math.min(page.pageSettings.width, newWidth));
      updates.height = Math.max(5, Math.min(page.pageSettings.height, newHeight));
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
      width: Math.min(200, page.pageSettings.width),
      height: Math.min(50, page.pageSettings.height),
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
      width: Math.min(200, page.pageSettings.width),
      height: Math.min(200, page.pageSettings.height),
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
      width: Math.min(120, page.pageSettings.width),
      height: Math.min(80, page.pageSettings.height),
      rotation: 0,
      zIndex: page.elements.length + 1,
      properties: {
        fill: '#f3f4f6',
        stroke: '#111827',
        strokeWidth: 2
      }
    };

    // Shape-specific dimensions with page boundary constraints
    const shapeConfig = {
      rectangle: { width: Math.min(120, page.pageSettings.width), height: Math.min(80, page.pageSettings.height) },
      ellipse: { width: Math.min(100, page.pageSettings.width), height: Math.min(100, page.pageSettings.height) },
      line: { width: Math.min(120, page.pageSettings.width), height: Math.min(20, page.pageSettings.height) },
      triangle: { width: Math.min(100, page.pageSettings.width), height: Math.min(90, page.pageSettings.height) },
      pentagon: { width: Math.min(100, page.pageSettings.width), height: Math.min(100, page.pageSettings.height) },
      diamond: { width: Math.min(100, page.pageSettings.width), height: Math.min(100, page.pageSettings.height) },
      hexagon: { width: Math.min(100, page.pageSettings.width), height: Math.min(100, page.pageSettings.height) },
      octagon: { width: Math.min(100, page.pageSettings.width), height: Math.min(100, page.pageSettings.height) },
      star: { width: Math.min(100, page.pageSettings.width), height: Math.min(100, page.pageSettings.height) },
      heart: { width: Math.min(100, page.pageSettings.width), height: Math.min(100, page.pageSettings.height) },
      cloud: { width: Math.min(120, page.pageSettings.width), height: Math.min(80, page.pageSettings.height) },
      arrow: { width: Math.min(120, page.pageSettings.width), height: Math.min(40, page.pageSettings.height) },
      rightArrow: { width: Math.min(120, page.pageSettings.width), height: Math.min(40, page.pageSettings.height) },
      leftArrow: { width: Math.min(120, page.pageSettings.width), height: Math.min(40, page.pageSettings.height) },
      upArrow: { width: Math.min(40, page.pageSettings.width), height: Math.min(120, page.pageSettings.height) },
      downArrow: { width: Math.min(40, page.pageSettings.width), height: Math.min(120, page.pageSettings.height) },
      parallelogram: { width: Math.min(120, page.pageSettings.width), height: Math.min(80, page.pageSettings.height) },
      trapezoid: { width: Math.min(120, page.pageSettings.width), height: Math.min(80, page.pageSettings.height) },
      chevron: { width: Math.min(120, page.pageSettings.width), height: Math.min(40, page.pageSettings.height) },
      bookmark: { width: Math.min(80, page.pageSettings.width), height: Math.min(120, page.pageSettings.height) },
      lightning: { width: Math.min(80, page.pageSettings.width), height: Math.min(120, page.pageSettings.height) },
      sun: { width: Math.min(100, page.pageSettings.width), height: Math.min(100, page.pageSettings.height) },
      crescent: { width: Math.min(100, page.pageSettings.width), height: Math.min(100, page.pageSettings.height) },
      speechBubble: { width: Math.min(120, page.pageSettings.width), height: Math.min(80, page.pageSettings.height) },
      cross: { width: Math.min(80, page.pageSettings.width), height: Math.min(80, page.pageSettings.height) },
      checkmark: { width: Math.min(80, page.pageSettings.width), height: Math.min(80, page.pageSettings.height) },
      plus: { width: Math.min(80, page.pageSettings.width), height: Math.min(80, page.pageSettings.height) },
      minus: { width: Math.min(80, page.pageSettings.width), height: Math.min(40, page.pageSettings.height) },
      exclamation: { width: Math.min(40, page.pageSettings.width), height: Math.min(80, page.pageSettings.height) },
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