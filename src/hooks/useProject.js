import { useState, useEffect } from 'react';
import { DEFAULT_PAGE_SETTINGS } from '../constants';

export const useProject = () => {
  const [project, setProject] = useState({
    pages: [{
      id: 1,
      pageSettings: DEFAULT_PAGE_SETTINGS,
      elements: []
    }],
    currentPage: 0
  });

  const [selectedElement, setSelectedElement] = useState({ pageIndex: 0, elementId: null });

  // Wrapper function to ensure selectedElement always has valid structure
  const safeSetSelectedElement = (newValue) => {
    if (newValue && typeof newValue === 'object' && newValue.pageIndex !== undefined) {
      setSelectedElement(newValue);
    } else {
      // Fallback to safe default
      setSelectedElement({ pageIndex: 0, elementId: null });
    }
  };
  const [currentEditingPage, setCurrentEditingPage] = useState(0);

  // Auto-save to localStorage
  useEffect(() => {
    // Only auto-save if not in the middle of a history restoration
    if (!project._isHistoryRestoration) {
      localStorage.setItem('canva-project', JSON.stringify(project));
    }
  }, [project]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('canva-project');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration for old format
        if (parsed.pageSettings && parsed.elements) {
          const migratedProject = {
            pages: [{
              id: 1,
              pageSettings: parsed.pageSettings,
              elements: parsed.elements
            }],
            currentPage: 0
          };
          setProject(migratedProject);
        } else {
          setProject(parsed);
        }
      } catch (e) {
        console.error('Error loading saved project:', e);
      }
    }
  }, []);

  const getCurrentPage = () => project.pages[project.currentPage];

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Optionally accepts an insertion index (insert after this index)
  const addPage = (onComplete, insertAfterIndexParam) => {
    if (project.pages.length >= 50) {
      alert('Maximum page limit reached. You can only have up to 50 pages.');
      return;
    }

    const newPage = {
      id: Date.now(),
      pageSettings: DEFAULT_PAGE_SETTINGS,
      elements: []
    };
    // Allow caller to specify the insertion base index; default to currentEditingPage
    let insertAfterIndex = currentEditingPage;
    if (typeof onComplete === 'number' && insertAfterIndexParam === undefined) {
      // Backward-compatible overload: addPage(insertAfterIndex)
      insertAfterIndex = onComplete;
      onComplete = undefined;
    } else if (typeof insertAfterIndexParam === 'number') {
      insertAfterIndex = insertAfterIndexParam;
    }
    const safeAfterIndex = Math.max(-1, Math.min(insertAfterIndex, project.pages.length - 1));
    const insertionIndex = safeAfterIndex + 1;
    setProject(prev => {
      const pagesBefore = prev.pages.slice(0, insertionIndex);
      const pagesAfter = prev.pages.slice(insertionIndex);
      const updatedPages = [...pagesBefore, newPage, ...pagesAfter];

      const newProject = {
        ...prev,
        pages: updatedPages,
        currentPage: insertionIndex
      };

      // Call onComplete with the updated project if provided
      if (onComplete) {
        setTimeout(() => onComplete(newProject), 0);
      }

      return newProject;
    });

    // Update currentEditingPage to the inserted page
    setTimeout(() => {
      setCurrentEditingPage(insertionIndex);
      setSelectedElement({ pageIndex: insertionIndex, elementId: null });
    }, 0);
  };

  const goToPage = (pageIndex) => {
    if (pageIndex >= 0 && pageIndex < project.pages.length) {
      setProject(prev => ({
        ...prev,
        currentPage: pageIndex
      }));
      setSelectedElement({ pageIndex: pageIndex, elementId: null });
    }
  };

  const deletePage = (pageIndex, onComplete) => {
    if (project.pages.length <= 1) {
      alert('Cannot delete the only page. At least one page must remain.');
      return;
    }

    // Calculate the new current page before the setProject call
    let newCurrentPage = project.currentPage;
    if (pageIndex <= project.currentPage) {
      newCurrentPage = Math.max(0, project.currentPage - 1);
    }

    setProject(prev => {
      const newPages = prev.pages.filter((_, index) => index !== pageIndex);

      const newProject = {
        ...prev,
        pages: newPages,
        currentPage: newCurrentPage
      };

      // Call onComplete with the updated project if provided
      if (onComplete) {
        setTimeout(() => onComplete(newProject), 0);
      }

      return newProject;
    });

    // Update currentEditingPage to match the new current page
    setCurrentEditingPage(prev => {
      if (pageIndex <= prev) {
        return Math.max(0, prev - 1);
      }
      return prev;
    });

    // Clear selected element and set to the new current page
    setSelectedElement({ pageIndex: newCurrentPage, elementId: null });
  };

  const clearCurrentPage = (onComplete) => {
    setProject(prev => {
      const newProject = {
        ...prev,
        pages: prev.pages.map((page, index) =>
          index === prev.currentPage
            ? { ...page, elements: [] }
            : page
        )
      };

      // Call onComplete with the updated project if provided
      if (onComplete) {
        setTimeout(() => onComplete(newProject), 0);
      }

      return newProject;
    });
    setSelectedElement({ pageIndex: prev.currentPage, elementId: null });
  };

  const clearAllPages = (onComplete) => {
    setProject(prev => {
      const newProject = {
        pages: [{
          id: 1,
          pageSettings: DEFAULT_PAGE_SETTINGS,
          elements: []
        }],
        currentPage: 0
      };

      // Call onComplete with the updated project if provided
      if (onComplete) {
        setTimeout(() => onComplete(newProject), 0);
      }

      return newProject;
    });
    setSelectedElement({ pageIndex: 0, elementId: null });
  };

  const setBackground = (type, value, onComplete) => {
    setProject(prev => {
      const newProject = {
        ...prev,
        pages: prev.pages.map((page, index) =>
          index === prev.currentPage
            ? {
              ...page,
              pageSettings: {
                ...page.pageSettings,
                background: { type, value }
              }
            }
            : page
        )
      };

      // Provide the updated project to a callback for history saving, similar to other actions
      if (onComplete) {
        onComplete(newProject);
      }

      return newProject;
    });
  };

  const duplicatePage = (pageIndex, onComplete) => {
    if (project.pages.length >= 50) {
      alert('Maximum page limit reached. You can only have up to 50 pages.');
      return;
    }

    const pageToDuplicate = project.pages[pageIndex];
    if (!pageToDuplicate) {
      console.error('Page to duplicate not found');
      return;
    }

    // Create a deep copy of the page with new IDs for all elements
    const duplicatedPage = {
      ...pageToDuplicate,
      id: Date.now(),
      elements: pageToDuplicate.elements.map(element => ({
        ...element,
        id: generateId()
      }))
    };

    // Insert the duplicated page right after the original page
    const insertionIndex = pageIndex + 1;
    setProject(prev => {
      const pagesBefore = prev.pages.slice(0, insertionIndex);
      const pagesAfter = prev.pages.slice(insertionIndex);
      const updatedPages = [...pagesBefore, duplicatedPage, ...pagesAfter];

      const newProject = {
        ...prev,
        pages: updatedPages,
        currentPage: insertionIndex
      };

      // Call onComplete with the updated project if provided
      if (onComplete) {
        setTimeout(() => onComplete(newProject), 0);
      }

      return newProject;
    });

    // Update currentEditingPage to the duplicated page
    setTimeout(() => {
      setCurrentEditingPage(insertionIndex);
      setSelectedElement({ pageIndex: insertionIndex, elementId: null });
    }, 0);
  };

  const reorderPages = (fromIndex, toIndex, onComplete) => {
    if (fromIndex === toIndex) return;

    // Calculate new currentEditingPage before the setProject call
    let newCurrentEditingPage = currentEditingPage;
    if (fromIndex === currentEditingPage) {
      newCurrentEditingPage = toIndex;
    } else if (fromIndex < currentEditingPage && toIndex >= currentEditingPage) {
      newCurrentEditingPage = currentEditingPage - 1;
    } else if (fromIndex > currentEditingPage && toIndex <= currentEditingPage) {
      newCurrentEditingPage = currentEditingPage + 1;
    }

    setProject(prev => {
      const newPages = [...prev.pages];
      const [movedPage] = newPages.splice(fromIndex, 1);
      newPages.splice(toIndex, 0, movedPage);

      // Update currentPage if it was affected
      let newCurrentPage = prev.currentPage;
      if (fromIndex === prev.currentPage) {
        newCurrentPage = toIndex;
      } else if (fromIndex < prev.currentPage && toIndex >= prev.currentPage) {
        newCurrentPage = prev.currentPage - 1;
      } else if (fromIndex > prev.currentPage && toIndex <= prev.currentPage) {
        newCurrentPage = prev.currentPage + 1;
      }

      const newProject = {
        ...prev,
        pages: newPages,
        currentPage: newCurrentPage
      };

      // Call onComplete with the updated project if provided
      if (onComplete) {
        setTimeout(() => onComplete(newProject), 0);
      }

      return newProject;
    });

    // Update currentEditingPage
    setTimeout(() => {
      setCurrentEditingPage(newCurrentEditingPage);
    }, 0);
  };

  return {
    project,
    setProject,
    selectedElement,
    setSelectedElement: safeSetSelectedElement,
    currentEditingPage,
    setCurrentEditingPage,
    getCurrentPage,
    generateId,
    addPage,
    goToPage,
    deletePage,
    duplicatePage,
    reorderPages,
    clearCurrentPage,
    clearAllPages,
    setBackground
  };
};