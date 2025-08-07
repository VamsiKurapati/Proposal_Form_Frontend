import { useState, useEffect } from 'react';
import { DEFAULT_PAGE_SETTINGS } from '../constants';
import { safeSetItem, safeGetItem, STORAGE_KEYS } from '../utils/storage';

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
  const [currentEditingPage, setCurrentEditingPage] = useState(0);

  // Auto-save to localStorage
  useEffect(() => {
    // Only auto-save if not in the middle of a history restoration
    if (!project._isHistoryRestoration) {
      const success = safeSetItem(STORAGE_KEYS.PROJECT, project);
      if (!success) {
        console.warn('Failed to save project to localStorage. Data may be too large.');
      }
    }
  }, [project]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = safeGetItem(STORAGE_KEYS.PROJECT);
    if (saved) {
      try {
        // Migration for old format
        if (saved.pageSettings && saved.elements) {
          const migratedProject = {
            pages: [{
              id: 1,
              pageSettings: saved.pageSettings,
              elements: saved.elements
            }],
            currentPage: 0
          };
          setProject(migratedProject);
        } else {
          setProject(saved);
        }
      } catch (e) {
        console.error('Error loading saved project:', e);
      }
    }
  }, []);

  const getCurrentPage = () => project.pages[project.currentPage];

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addPage = (onComplete) => {
    if (project.pages.length >= 20) {
      alert('Maximum page limit reached. You can only have up to 20 pages.');
      return;
    }

    const newPage = {
      id: Date.now(),
      pageSettings: DEFAULT_PAGE_SETTINGS,
      elements: []
    };
    setProject(prev => {
      const newPageIndex = prev.pages.length;
      const newProject = {
        ...prev,
        pages: [...prev.pages, newPage],
        currentPage: newPageIndex
      };

      // Call onComplete with the updated project if provided
      if (onComplete) {
        setTimeout(() => onComplete(newProject), 0);
      }

      return newProject;
    });

    // Update currentEditingPage to the new page after state update
    setTimeout(() => {
      const newPageIndex = project.pages.length;
      setCurrentEditingPage(newPageIndex);
      setSelectedElement({ pageIndex: newPageIndex, elementId: null });
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

    setProject(prev => {
      const newPages = prev.pages.filter((_, index) => index !== pageIndex);
      let newCurrentPage = prev.currentPage;

      // If we're deleting the current page or a page before it
      if (pageIndex <= prev.currentPage) {
        // Move to the previous page (current-1), but don't go below 0
        newCurrentPage = Math.max(0, prev.currentPage - 1);
      }
      // If we're deleting a page after the current page, current page stays the same

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

    // Clear selected element
    setSelectedElement({ pageIndex: 0, elementId: null });
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
    setSelectedElement({ pageIndex: 0, elementId: null });
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

  const setBackground = (type, value) => {
    setProject(prev => {
      const newProject = {
        ...prev,
        pages: prev.pages.map((page, index) =>
          index === currentEditingPage
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



      return newProject;
    });
  };

  return {
    project,
    setProject,
    selectedElement,
    setSelectedElement,
    currentEditingPage,
    setCurrentEditingPage,
    getCurrentPage,
    generateId,
    addPage,
    goToPage,
    deletePage,
    clearCurrentPage,
    clearAllPages,
    setBackground
  };
};