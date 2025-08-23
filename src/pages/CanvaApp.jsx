import React, { useRef, useEffect, useCallback, useState } from 'react';
import { MdOutlineArrowBack } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProject } from '../hooks/useProject';
import { useElements } from '../hooks/useElements';
import { useInteraction } from '../hooks/useInteraction';
import { usePanelState } from '../hooks/usePanelState';
import { useHistory } from '../hooks/useHistory';
import SidePanel from '../components/SidePanel';
import DesignPanel from '../components/DesignPanel';

import ElementsPanel from '../components/ElementsPanel';
import TextPanel from '../components/TextPanel.jsx';
import Canvas from '../components/Canvas/Canvas.jsx';
import GridView from '../components/Canvas/GridView.jsx';
import FloatingToolbar from '../components/Toolbar/FloatingToolbar.jsx';
import Footer from '../components/Footer.jsx';
import { exportToJSON, exportToPDF, exportToOptimizedSVG, importFromJSON, importFromJSONData } from '../utils/export';
import { getTemplateSets } from '../utils/loadTemplates';

import PropertiesPanel from '../components/PropertiesPanel.jsx';
import HistoryPanel from '../components/HistoryPanel.jsx';
import UploadsPanel from '../components/UploadsPanel.jsx';
import ToolsPanel from '../components/ToolsPanel.jsx';
import ProjectsPanel from '../components/ProjectsPanel.jsx';

import NavbarComponent from './NavbarComponent.jsx';

const CanvaApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [zoom, setZoom] = React.useState(100);
  const [isGridView, setIsGridView] = React.useState(false);
  const [sets, setSets] = React.useState({});
  const [svgPreviews, setSvgPreviews] = React.useState({});

  const panelState = usePanelState();

  const {
    project,
    setProject,
    selectedElement,
    setSelectedElement,
    currentEditingPage,
    setCurrentEditingPage,
    generateId,
    addPage,
    deletePage,
    duplicatePage,
    reorderPages,
    clearCurrentPage,
    clearAllPages,
    setBackground,
    validateProjectStructure,
    getValidatedPages
  } = useProject();

  // History management
  const {
    saveToHistory,
    saveToHistoryDebounced,
    undo,
    redo,
    canUndo,
    canRedo,
    getHistoryList,
    restoreToHistoryEntry,
    clearHistory
  } = useHistory(project, setProject, setCurrentEditingPage, setSelectedElement);

  const {
    updateElement,
    deleteElement,
    addTextElement,
    addCustomTextElement,
    addImageElement,
    addShapeElement,
    duplicateElement
  } = useElements(project, setProject, generateId, currentEditingPage, setSelectedElement);

  // Create a flag to track if we're in the middle of an interaction
  const [isInInteraction, setIsInInteraction] = useState(false);

  // State for copy/cut feedback
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [lastOperation, setLastOperation] = useState('copy'); // 'copy', 'cut', or 'external-copy'

  // Function to paste internal elements
  const pasteInternalElement = useCallback(() => {
    const copiedElementData = localStorage.getItem('canva-copied-element');
    if (copiedElementData) {
      try {
        const elementData = JSON.parse(copiedElementData);
        const newElement = {
          ...elementData,
          id: generateId(),
          x: elementData.x + 20,
          y: elementData.y + 20
        };

        // Add the element to the current editing page
        setProject(prev => {
          const newProject = {
            ...prev,
            pages: prev.pages.map((page, idx) =>
              idx === currentEditingPage
                ? {
                  ...page,
                  elements: [...page.elements, newElement]
                }
                : page
            )
          };

          // Mark this project as a paste operation for history tracking
          newProject._isPasteOperation = true;

          return newProject;
        });

        // Select the new element
        setSelectedElement({
          pageIndex: currentEditingPage,
          elementId: newElement.id
        });
      } catch (error) {
        console.error('Error pasting element:', error);
      }
    }
  }, [generateId, setProject, currentEditingPage, setSelectedElement]);

  // Create updateElementWithHistory function before useInteraction hook
  const updateElementWithHistory = useCallback((pageIndex, elementId, updates) => {
    if (!updates) return;

    try {
      updateElement(pageIndex, elementId, updates);
    } catch (error) {
      console.error('updateElementWithHistory: Error calling updateElement', error);
      return;
    }

    const isAnyPropertyUpdate = updates && !!updates.properties;
    const isTextContentChange = updates.properties && updates.properties.text !== undefined;
    const isColorChange = updates.properties && (
      updates.properties.fill !== undefined ||
      updates.properties.stroke !== undefined ||
      updates.properties.color !== undefined
    );
    const isOtherPropertyChange = updates.properties && !isTextContentChange && !isColorChange;
    const isRotationChange = updates.rotation !== undefined;
    const isZIndexChange = updates.zIndex !== undefined;

    // For text content changes, use debouncing
    if (isTextContentChange) {
      // Clear existing timer
      if (textChangeTimerRef.current) {
        clearTimeout(textChangeTimerRef.current);
      }

      // Store the pending text change
      pendingTextChangesRef.current[elementId] = updates;

      // Set a timer to save history after user stops typing
      textChangeTimerRef.current = setTimeout(() => {
        if (saveToHistory && pendingTextChangesRef.current[elementId]) {
          saveToHistory('Text Updated', 'Updated text content', { [elementId]: pendingTextChangesRef.current[elementId] });
          // Clear the pending changes
          pendingTextChangesRef.current[elementId] = null;
        }
      }, 1000); // Wait 1 second after last text change
    }
    // For color changes, use longer debouncing to handle drag operations
    else if (isColorChange) {
      // Clear existing timer
      if (propertyChangeTimerRef.current) {
        clearTimeout(propertyChangeTimerRef.current);
      }

      // Store the pending color change
      pendingPropertyChangesRef.current[elementId] = updates;

      // Set a timer to save history after user stops changing colors
      propertyChangeTimerRef.current = setTimeout(() => {
        if (saveToHistory && pendingPropertyChangesRef.current[elementId]) {
          saveToHistory('Color Updated', 'Updated element colors', { [elementId]: pendingPropertyChangesRef.current[elementId] });
          // Clear the pending changes
          pendingPropertyChangesRef.current[elementId] = null;
        }
      }, 1500); // Wait 1.5 seconds after last color change to handle drag operations
    }
    // Use debounced history for image properties (contrast, brightness, blur, etc.)
    else if (saveToHistoryDebounced && (isOtherPropertyChange || isRotationChange || isZIndexChange)) {
      // Check if these are image-specific properties that should be debounced
      const isImageProperty = updates.properties && (
        updates.properties.contrast !== undefined ||
        updates.properties.brightness !== undefined ||
        updates.properties.blur !== undefined ||
        updates.properties.saturation !== undefined ||
        updates.properties.hue !== undefined ||
        updates.properties.grayscale !== undefined ||
        updates.properties.sepia !== undefined ||
        updates.properties.invert !== undefined
      );

      if (isImageProperty) {
        saveToHistoryDebounced('Image Properties Updated', 'Updated image properties', { [elementId]: updates });
      } else {
        saveToHistory('Properties Updated', 'Updated element properties', { [elementId]: updates });
      }
    }
    // Save movement/resize changes only when not in interaction
    else if (saveToHistory && !isInInteraction) {
      const action = isAnyPropertyUpdate ? 'Properties Updated' : 'Element Updated';
      const description = isAnyPropertyUpdate ? 'Updated element properties' : 'Updated element properties';
      saveToHistory(action, description, { [elementId]: updates });
    }
  }, [updateElement, saveToHistory, saveToHistoryDebounced, isInInteraction]);



  // Debounce timer for property changes
  const propertyChangeTimerRef = useRef(null);
  const pendingPropertyChangesRef = useRef({});

  // Debounce timer for text changes
  const textChangeTimerRef = useRef(null);
  const pendingTextChangesRef = useRef({});

  // Create a special update function for properties that bypasses interaction checks
  const updateElementPropertiesOnly = useCallback((pageIndex, elementId, updates) => {
    if (pageIndex === undefined || elementId === undefined || !updates) {
      return;
    }

    try {
      updateElement(pageIndex, elementId, updates);

      // Clear existing timer
      if (propertyChangeTimerRef.current) {
        clearTimeout(propertyChangeTimerRef.current);
      }

      // Store the pending change
      pendingPropertyChangesRef.current[elementId] = updates;

      // Check if these are color changes that should be debounced
      const isColorChange = updates.properties && (
        updates.properties.fill !== undefined ||
        updates.properties.stroke !== undefined ||
        updates.properties.color !== undefined
      );

      // Check if these are image-specific properties that should be debounced
      const isImageProperty = updates.properties && (
        updates.properties.contrast !== undefined ||
        updates.properties.brightness !== undefined ||
        updates.properties.blur !== undefined ||
        updates.properties.saturation !== undefined ||
        updates.properties.hue !== undefined ||
        updates.properties.grayscale !== undefined ||
        updates.properties.sepia !== undefined ||
        updates.properties.invert !== undefined
      );

      // Set a timer to save history after user stops making changes
      propertyChangeTimerRef.current = setTimeout(() => {
        if (pendingPropertyChangesRef.current[elementId]) {
          if (isColorChange && saveToHistory) {
            saveToHistory('Color Updated', 'Updated element colors', { [elementId]: pendingPropertyChangesRef.current[elementId] });
          } else if (isImageProperty && saveToHistoryDebounced) {
            saveToHistoryDebounced('Image Properties Updated', 'Updated image properties', { [elementId]: pendingPropertyChangesRef.current[elementId] });
          } else if (saveToHistory) {
            saveToHistory('Properties Updated', 'Updated element properties', { [elementId]: pendingPropertyChangesRef.current[elementId] });
          }
          // Clear the pending changes
          pendingPropertyChangesRef.current[elementId] = null;
        }
      }, isColorChange ? 1500 : 1000); // Wait 1.5 seconds for color changes, 1 second for other properties

    } catch (error) {
      console.error('updateElementPropertiesOnly: Error calling updateElement', error);
    }
  }, [updateElement, saveToHistory, saveToHistoryDebounced]);

  // Define deleteElementWithHistory before useInteraction hook
  const deleteElementWithHistory = useCallback((pageIndex, elementId) => {
    deleteElement(pageIndex, elementId, (updatedProject) => {
      if (saveToHistory) {
        saveToHistory('Element Deleted', 'Deleted element', null, updatedProject);
      }
    });
  }, [deleteElement, saveToHistory]);

  const {
    isEditing,
    setIsEditing: setIsEditingOriginal,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleResizeMouseDown,
    draggedElement
  } = useInteraction(zoom / 100, updateElement, project, setSelectedElement, setCurrentEditingPage, saveToHistory, setIsInInteraction, deleteElementWithHistory, currentEditingPage);

  // Wrapper for text editing that saves history after editing ends
  const setIsEditing = useCallback((elementId) => {
    if (elementId && !isEditing) {
      // Set interaction flag when editing starts
      setIsInInteraction(true);
    } else if (!elementId && isEditing) {
      // Save state after editing ends with the current project state
      setIsInInteraction(false);
      if (saveToHistory) {
        // Save the current project state to capture the final text content
        saveToHistory('Text Edit Completed', 'Finished editing text', null, project);
      }
    }
    setIsEditingOriginal(elementId);
  }, [isEditing, saveToHistory, setIsEditingOriginal, project]);





  const canvasRefs = useRef([]);
  const scrollContainerRef = useRef(null);
  const imageInputRef = useRef(null);
  const svgInputRef = useRef(null);
  const jsonInputRef = useRef(null);

  const [hasLoadedJSON, setHasLoadedJSON] = useState(false);

  // Handle JSON data from navigation state
  useEffect(() => {
    if (location.state?.jsonData && !hasLoadedJSON) {
      try {
        // Use the JSON data from the navigation state if it exists, otherwise use the project from localStorage
        const jsonData = location.state.jsonData || localStorage.getItem('canva-project');

        // After using jsonData for 1st time, delete it from the navigation state for security reasons to prevent users from manipulating the JSON data and also to avoid resetting the project when the user refreshes the page
        if (location.state.jsonData) {
          delete location.state.jsonData;
        }

        // Import the JSON data into the project
        importFromJSONData(jsonData, setProject, setCurrentEditingPage, setSelectedElement);
        setHasLoadedJSON(true);
      } catch (error) {
        console.error('Error loading JSON data from navigation state:', error);
      }
    }
  }, [location.state, setProject, setCurrentEditingPage, setSelectedElement, hasLoadedJSON]);

  // Load template sets asynchronously
  useEffect(() => {
    const loadTemplateSets = async () => {
      try {
        const templateData = await getTemplateSets();
        setSets(templateData.sets);
        setSvgPreviews(templateData.svgPreviews);
      } catch (error) {
        console.error('Error loading template sets:', error);
      }
    };

    loadTemplateSets();
  }, []);

  // Validate project structure on mount
  useEffect(() => {
    if (project && project.pages) {
      validateProjectStructure();
    }
  }, []); // Only run once on mount

  // Get selected element
  const getSelectedElement = () => {
    // Store selectedElement in a local variable to prevent race conditions
    const currentSelectedElement = selectedElement;

    // Validate selectedElement and pageIndex before accessing
    if (!currentSelectedElement ||
      currentSelectedElement.pageIndex === undefined ||
      currentSelectedElement.pageIndex < 0 ||
      currentSelectedElement.pageIndex >= project.pages.length) {
      // Reset selectedElement to a valid state if it's invalid
      if (currentSelectedElement && currentSelectedElement.pageIndex !== undefined) {
        // Use currentEditingPage or fall back to 0 if it's also invalid
        const safePageIndex = (currentEditingPage >= 0 && currentEditingPage < project.pages.length) ? currentEditingPage : 0;
        setSelectedElement({ pageIndex: safePageIndex, elementId: null });
      }
      return null;
    }

    // Ensure pages are valid before accessing
    const validatedPages = getValidatedPages();
    const page = validatedPages[currentSelectedElement.pageIndex];
    if (!page) return null;

    // Ensure page has proper structure
    if (!page.pageSettings || !page.elements) {
      console.warn('Invalid page structure detected, triggering validation...');
      validateProjectStructure();
      return null;
    }

    return page.elements.find(el => el.id === currentSelectedElement.elementId);
  };

  const selectedEl = getSelectedElement();

  // Wrapper functions to save history after operations
  const addPageWithHistory = useCallback(() => {
    addPage((updatedProject) => {
      if (saveToHistory) {
        const insertedAt = updatedProject.currentPage + 1;
        saveToHistory('Page Added', `Added new page at position ${insertedAt}`, null, updatedProject);
      }
    }, currentEditingPage);
  }, [addPage, saveToHistory, currentEditingPage]);

  const deletePageWithHistory = useCallback((pageIndex) => {
    deletePage(pageIndex, (updatedProject) => {
      if (saveToHistory) {
        saveToHistory('Page Deleted', `Deleted page ${pageIndex + 1}`, null, updatedProject);
      }
    });
  }, [deletePage, saveToHistory]);

  const duplicatePageWithHistory = useCallback((pageIndex) => {
    duplicatePage(pageIndex, (updatedProject) => {
      if (saveToHistory) {
        saveToHistory('Page Duplicated', `Duplicated page ${pageIndex + 1}`, null, updatedProject);
      }
    });
  }, [duplicatePage, saveToHistory]);

  const reorderPagesWithHistory = useCallback((fromIndex, toIndex) => {
    reorderPages(fromIndex, toIndex, (updatedProject) => {
      if (saveToHistory) {
        saveToHistory('Pages Reordered', `Moved page ${fromIndex + 1} to position ${toIndex + 1}`, null, updatedProject);
      }
    });
  }, [reorderPages, saveToHistory]);

  const clearCurrentPageWithHistory = useCallback(() => {
    clearCurrentPage((updatedProject) => {
      if (saveToHistory) {
        saveToHistory('Page Cleared', `Cleared all elements from page ${currentEditingPage + 1}`, null, updatedProject);
      }
    });
  }, [clearCurrentPage, currentEditingPage, saveToHistory]);

  const clearAllPagesWithHistory = useCallback(() => {
    clearAllPages((updatedProject) => {
      if (saveToHistory) {
        saveToHistory('All Pages Cleared', 'Cleared all pages and started fresh', null, updatedProject);
      }
    });
  }, [clearAllPages, saveToHistory]);

  const setBackgroundWithHistory = useCallback((type, value) => {
    setBackground(type, value, (updatedProject) => {
      if (saveToHistory) {
        // Use the currentPage from the updated project to ensure we're referencing the correct page
        const targetPageIndex = updatedProject.currentPage;
        saveToHistory('Background Changed', `Changed background on page ${targetPageIndex + 1}`, null, updatedProject);
      }
    });
  }, [setBackground, saveToHistory]);

  const addTextElementWithHistory = () => {
    addTextElement((updatedProject) => {
      if (saveToHistory) {
        saveToHistory('Text Element Added', 'Added text element', null, updatedProject);
      }
    });
  };

  const addCustomTextElementWithHistory = (customElement) => {
    addCustomTextElement(customElement, (updatedProject) => {
      if (saveToHistory) {
        // Check if this is a page number element by looking at the text content
        const isPageNumber = customElement.properties?.text &&
          (customElement.properties.text.includes('Page') ||
            /^\d+$/.test(customElement.properties.text) ||
            customElement.properties.text.includes('of'));

        const action = isPageNumber ? 'Page Number Added' : 'Custom Text Added';
        const description = isPageNumber ? 'Added page number' : 'Added custom text element';

        saveToHistory(action, description, null, updatedProject);
      }
    });
  };

  const addImageElementWithHistory = (src) => {
    addImageElement(src, (updatedProject) => {
      if (saveToHistory) {
        saveToHistory('Image Added', 'Added image element', null, updatedProject);
      }
    });
  };

  const addShapeElementWithHistory = (shapeType) => {
    addShapeElement(shapeType, (updatedProject) => {
      if (saveToHistory) {
        saveToHistory('Shape Added', `Added ${shapeType} shape`, null, updatedProject);
      }
    });
  };

  const duplicateElementWithHistory = (selectedEl, selectedElement) => {
    duplicateElement(selectedEl, selectedElement, (updatedProject) => {
      if (saveToHistory) {
        saveToHistory('Element Duplicated', 'Duplicated element', null, updatedProject);
      }
    });
  };

  // Wrapper for mouse up to save history after interactions
  const handleMouseUpWithHistory = useCallback(() => {
    handleMouseUp();
  }, [handleMouseUp]);

  // Event listeners
  useEffect(() => {
    const handleMove = (e) => handleMouseMove(e, canvasRefs, currentEditingPage);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleMouseUpWithHistory);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleMouseUpWithHistory);
    };
  }, [handleMouseMove, handleMouseUpWithHistory, currentEditingPage]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent shortcuts when editing text
      if (isEditing) return;

      // Prevent shortcuts when focused on input elements
      const activeElement = document.activeElement;
      const isInputElement = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT' ||
        activeElement.contentEditable === 'true' ||
        activeElement.classList.contains('color-picker') ||
        activeElement.type === 'color' ||
        activeElement.type === 'range' ||
        activeElement.type === 'number'
      );

      if (isInputElement) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        if (canRedo) redo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        // Delete selected element
        if (selectedEl && selectedElement && selectedElement.pageIndex !== undefined && selectedElement.pageIndex >= 0 && selectedElement.pageIndex < project.pages.length) {
          e.preventDefault();
          deleteElementWithHistory(selectedElement.pageIndex, selectedElement.elementId);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        // Cut selected element (copy then delete)
        if (selectedEl && selectedElement && selectedElement.pageIndex !== undefined && selectedElement.pageIndex >= 0 && selectedElement.pageIndex < project.pages.length) {
          e.preventDefault();
          // Store element data in localStorage for internal copy/paste
          const elementData = {
            ...selectedEl,
            id: undefined, // Remove id so a new one will be generated
            x: selectedEl.x + 20, // Offset for visual feedback
            y: selectedEl.y + 20
          };
          localStorage.setItem('canva-copied-element', JSON.stringify(elementData));
          localStorage.removeItem('canva-copied-text'); // Clear any copied text

          // Delete the original element
          deleteElementWithHistory(selectedElement.pageIndex, selectedElement.elementId);

          // Show cut feedback
          setLastOperation('cut');
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2000);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        // Copy selected element
        if (selectedEl && selectedElement && selectedElement.pageIndex !== undefined && selectedElement.pageIndex >= 0 && selectedElement.pageIndex < project.pages.length) {
          e.preventDefault();
          // Store element data in localStorage for internal copy/paste
          const elementData = {
            ...selectedEl,
            id: undefined, // Remove id so a new one will be generated
            x: selectedEl.x + 20, // Offset for visual feedback
            y: selectedEl.y + 20
          };
          localStorage.setItem('canva-copied-element', JSON.stringify(elementData));
          localStorage.removeItem('canva-copied-text'); // Clear any copied text

          // Show copy feedback
          setLastOperation('copy');
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2000);
        } else {
          // No element selected, check if we can copy external text
          if (navigator.clipboard && navigator.clipboard.readText) {
            navigator.clipboard.readText().then(externalText => {
              if (externalText && externalText.trim()) {
                // Store external text as the last copied item
                localStorage.setItem('canva-copied-text', externalText);
                localStorage.removeItem('canva-copied-element'); // Clear element clipboard

                // Show external copy feedback
                setLastOperation('external-copy');
                setCopyFeedback(true);
                setTimeout(() => setCopyFeedback(false), 2000);
              }
            }).catch(() => {
              // If clipboard API fails, do nothing
            });
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        // Handle paste - paste whatever was last copied
        e.preventDefault();

        // Check if we have internal clipboard data
        const copiedElementData = localStorage.getItem('canva-copied-element');
        const copiedTextData = localStorage.getItem('canva-copied-text');

        if (copiedElementData) {
          // Paste internal element
          pasteInternalElement();
        } else if (copiedTextData) {
          // Paste copied text
          const externalText = copiedTextData;

          // If we have text and a text element is selected, paste into it
          if (selectedEl && selectedElement && selectedEl.type === 'text') {
            // Paste text into the selected text element (replace existing text)
            updateElement(currentEditingPage, selectedEl.id, {
              properties: {
                ...selectedEl.properties,
                text: externalText
              }
            });

            // Show text paste feedback
            setLastOperation('text-paste');
            setCopyFeedback(true);
            setTimeout(() => setCopyFeedback(false), 2000);

            // Save to history
            if (saveToHistory) {
              saveToHistory('Text Pasted', 'Pasted copied text', null, project);
            }
          } else {
            // Create a new text element with the copied text
            const validatedPages = getValidatedPages();
            const page = validatedPages[currentEditingPage];
            if (!page || !page.pageSettings) {
              console.error('Page or pageSettings not found, cannot create text element');
              return;
            }
            const newTextElement = {
              id: generateId(),
              type: 'text',
              x: 100,
              y: 100,
              width: Math.min(200, page.pageSettings.width),
              height: Math.min(100, page.pageSettings.height),
              rotation: 0,
              zIndex: page.elements.length + 1,
              properties: {
                text: externalText,
                fontSize: 16,
                fontFamily: 'Arial, sans-serif',
                color: '#000000',
                bold: false,
                italic: false,
                textAlign: 'left',
                underline: false,
                lineHeight: 1.2,
                letterSpacing: 0,
                listStyle: 'none'
              }
            };

            setProject(prev => {
              const newProject = {
                ...prev,
                pages: prev.pages.map((page, idx) =>
                  idx === currentEditingPage
                    ? {
                      ...page,
                      elements: [...page.elements, newTextElement]
                    }
                    : page
                )
              };

              newProject._isPasteOperation = true;
              return newProject;
            });

            // Select the new text element
            setSelectedElement({
              pageIndex: currentEditingPage,
              elementId: newTextElement.id
            });

            // Show text paste feedback
            setLastOperation('text-paste');
            setCopyFeedback(true);
            setTimeout(() => setCopyFeedback(false), 2000);
          }
        } else {
          // Try to paste external text from system clipboard
          if (navigator.clipboard && navigator.clipboard.readText) {
            navigator.clipboard.readText().then(externalText => {
              if (externalText && externalText.trim()) {
                // If we have external text and a text element is selected, paste into it
                if (selectedEl && selectedElement && selectedEl.type === 'text') {
                  // Paste external text into the selected text element (replace existing text)
                  updateElement(currentEditingPage, selectedEl.id, {
                    properties: {
                      ...selectedEl.properties,
                      text: externalText
                    }
                  });

                  // Show external paste feedback
                  setLastOperation('external-paste');
                  setCopyFeedback(true);
                  setTimeout(() => setCopyFeedback(false), 2000);

                  // Save to history
                  if (saveToHistory) {
                    saveToHistory('External Text Pasted', 'Pasted external text', null, project);
                  }
                } else {
                  // Create a new text element with the external text
                  const validatedPages = getValidatedPages();
                  const page = validatedPages[currentEditingPage];
                  if (!page || !page.pageSettings) {
                    console.error('Page or pageSettings not found, cannot create text element');
                    return;
                  }
                  const newTextElement = {
                    id: generateId(),
                    type: 'text',
                    x: 100,
                    y: 100,
                    width: Math.min(200, page.pageSettings.width),
                    height: Math.min(100, page.pageSettings.height),
                    rotation: 0,
                    zIndex: page.elements.length + 1,
                    properties: {
                      text: externalText,
                      fontSize: 16,
                      fontFamily: 'Arial, sans-serif',
                      color: '#000000',
                      bold: false,
                      italic: false,
                      textAlign: 'left',
                      underline: false,
                      lineHeight: 1.2,
                      letterSpacing: 0,
                      listStyle: 'none'
                    }
                  };

                  setProject(prev => {
                    const newProject = {
                      ...prev,
                      pages: prev.pages.map((p, idx) =>
                        idx === currentEditingPage
                          ? {
                            ...p,
                            elements: [...p.elements, newTextElement]
                          }
                          : p
                      )
                    };

                    newProject._isPasteOperation = true;
                    return newProject;
                  });

                  // Select the new text element
                  setSelectedElement({
                    pageIndex: currentEditingPage,
                    elementId: newTextElement.id
                  });

                  // Show external paste feedback
                  setLastOperation('external-paste');
                  setCopyFeedback(true);
                  setTimeout(() => setCopyFeedback(false), 2000);
                }
              }
            }).catch((error) => {
              console.error('Clipboard API failed:', error);
              // If clipboard API fails, try alternative method
            });
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo, canUndo, canRedo, selectedEl, selectedElement, deleteElementWithHistory, generateId, setProject, saveToHistory, project, isEditing, currentEditingPage, setSelectedElement, pasteInternalElement, updateElement]);

  // Effect to handle paste operation history
  useEffect(() => {
    if (project && project._isPasteOperation) {
      // Remove the flag and save to history
      const cleanProject = { ...project };
      delete cleanProject._isPasteOperation;

      if (saveToHistory) {
        saveToHistory('Element Pasted', 'Pasted element', null, cleanProject);
      }

      // Clean up the flag from the project state
      setProject(prev => {
        const { _isPasteOperation, ...cleanState } = prev;
        return cleanState;
      });
    }
  }, [project, saveToHistory, setProject]);

  // Global paste event listener as fallback
  useEffect(() => {
    const handleGlobalPaste = (event) => {
      // Only handle if we're not in a text input/textarea
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      const clipboardData = event.clipboardData;
      if (clipboardData && clipboardData.getData('text')) {
        const externalText = clipboardData.getData('text');

        if (externalText && externalText.trim()) {
          // Create a new text element with the external text
          const validatedPages = getValidatedPages();
          const page = validatedPages[currentEditingPage];
          if (!page || !page.pageSettings) {
            console.error('Page or pageSettings not found, cannot create text element');
            return;
          }
          const newTextElement = {
            id: generateId(),
            type: 'text',
            x: 100,
            y: 100,
            width: Math.min(200, page.pageSettings.width),
            height: Math.min(100, page.pageSettings.height),
            rotation: 0,
            zIndex: page.elements.length + 1,
            properties: {
              text: externalText,
              fontSize: 16,
              fontFamily: 'Arial, sans-serif',
              color: '#000000',
              bold: false,
              italic: false,
              textAlign: 'left',
              underline: false,
              lineHeight: 1.2,
              letterSpacing: 0,
              listStyle: 'none'
            }
          };

          setProject(prev => {
            const newProject = {
              ...prev,
              pages: prev.pages.map((p, idx) =>
                idx === currentEditingPage
                  ? {
                    ...p,
                    elements: [...p.elements, newTextElement]
                  }
                  : p
              )
            };

            newProject._isPasteOperation = true;
            return newProject;
          });

          // Select the new text element
          setSelectedElement({
            pageIndex: currentEditingPage,
            elementId: newTextElement.id
          });

          // Show external paste feedback
          setLastOperation('external-paste');
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2000);
        }
      }
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [project, currentEditingPage, generateId, setProject, setSelectedElement]);



  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        addImageElementWithHistory(e.target.result);
        event.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <NavbarComponent />

      {/* Main editor content */}
      <div
        className="flex-1 w-full overflow-hidden mt-16"
        style={{
          display: 'grid',
          gridTemplateRows: '1fr 32px',
          gridTemplateColumns: '72px 1fr',
          gridTemplateAreas: `
          "sidebar main"
          "footer footer"
        `
        }}
      >


        {/* Side Panel - Grid area sidebar */}
        <div
          className="bg-white border-r flex flex-col items-center shadow-md z-40"
          style={{
            gridArea: 'sidebar',
            overflowY: 'auto'
          }}
        >
          <SidePanel
            onDesignClick={() => panelState.showDesignPanel ? panelState.setShowDesignPanel(false) : panelState.openDesignPanel()}
            onElementsClick={() => panelState.showElementsPanel ? panelState.setShowElementsPanel(false) : panelState.openElementsPanel()}
            onTextClick={() => panelState.showTextPanel ? panelState.setShowTextPanel(false) : panelState.openTextPanel()}
            onHistoryClick={() => panelState.showHistoryPanel ? panelState.setShowHistoryPanel(false) : panelState.openHistoryPanel()}
            onUploadsClick={() => panelState.showUploadsPanel ? panelState.setShowUploadsPanel(false) : panelState.openUploadsPanel()}
            onToolsClick={() => panelState.showToolsPanel ? panelState.setShowToolsPanel(false) : panelState.openToolsPanel()}
            onProjectsClick={() => panelState.showProjectsPanel ? panelState.setShowProjectsPanel(false) : panelState.openProjectsPanel()}
            onPropertiesClick={() => panelState.showPropertiesPanel ? panelState.setShowPropertiesPanel(false) : panelState.openPropertiesPanel()}
            onBackgroundClick={setBackgroundWithHistory}
            onLayoutTemplateClick={() => alert('Layout templates coming soon!')}
            onResetBackgroundClick={() => setBackgroundWithHistory('color', '#ffffff')}
            showDesignPanel={panelState.showDesignPanel}
            showElementsPanel={panelState.showElementsPanel}
            showTextPanel={panelState.showTextPanel}
            showHistoryPanel={panelState.showHistoryPanel}
            showUploadsPanel={panelState.showUploadsPanel}
            showToolsPanel={panelState.showToolsPanel}
            showProjectsPanel={panelState.showProjectsPanel}
            showPropertiesPanel={panelState.showPropertiesPanel}
          />
        </div>

        {/* Main Content Area */}
        <div
          className="relative overflow-hidden bg-gray-100"
          style={{
            gridArea: 'main',
            overscrollBehavior: 'contain'
          }}
        >
          {/* Floating Toolbar */}
          {!isGridView && (
            //Add a back button to go back to the previous page
            <>
              <div className="absolute top-2 left-4 z-10">
                <button className="rounded-lg bg-[#2563EB] text-white p-2 hover:bg-[#1d4ed8] transition-colors" onClick={() => navigate(-1)}>
                  <MdOutlineArrowBack className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
                <FloatingToolbar
                  addTextElement={addTextElementWithHistory}
                  imageInputRef={imageInputRef}
                  showBackgroundPanel={panelState.showBackgroundPanel}
                  setShowBackgroundPanel={panelState.setShowBackgroundPanel}
                  addPage={addPageWithHistory}
                  deletePage={deletePageWithHistory}
                  currentEditingPage={currentEditingPage}
                  clearCurrentPage={clearCurrentPageWithHistory}
                  clearAllPages={clearAllPagesWithHistory}
                  jsonInputRef={null} // Removed jsonInputRef
                  exportToJSON={() => exportToJSON(project)}
                  exportToPDF={async () => await exportToPDF(project)}
                  exportToSVG={() => exportToOptimizedSVG(project)}
                  totalPages={project.pages.length}
                  selectedElement={selectedElement}
                  selectedEl={selectedEl}
                  updateElement={updateElementWithHistory}
                  deleteElement={deleteElementWithHistory}
                  duplicateElement={duplicateElementWithHistory}
                  onDeselect={() => setSelectedElement({ pageIndex: currentEditingPage, elementId: null })}
                  onOpenProperties={() => panelState.showPropertiesPanel ? panelState.setShowPropertiesPanel(false) : panelState.openPropertiesPanel()}
                  setProject={setProject}
                />
              </div>
              <div className="absolute top-2 right-4 z-10">
                <button className="rounded-lg bg-[#2563EB] text-white p-2 hover:bg-[#1d4ed8] transition-colors" onClick={() => window.location.href = '/dashboard'}>
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Copy/Cut/Paste Feedback */}
          {copyFeedback && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300">
              {lastOperation === 'cut' ? 'Element cut! Press Ctrl+V to paste' :
                lastOperation === 'copy' ? 'Element copied! Press Ctrl+V to paste' :
                  lastOperation === 'external-copy' ? 'Text copied! Press Ctrl+V to paste' :
                    lastOperation === 'external-paste' ? 'External text pasted!' :
                      lastOperation === 'text-paste' ? 'Text pasted!' :
                        'Element copied! Press Ctrl+V to paste'}
            </div>
          )}
          {/* Panels */}
          <DesignPanel
            show={panelState.showDesignPanel}
            view={panelState.designPanelView}
            onClose={() => panelState.setShowDesignPanel(false)}
            onBack={() => panelState.setDesignPanelView('main')}
            selectedTemplateSet={panelState.selectedTemplateSet}
            onTemplateSetClick={(set) => {
              panelState.setSelectedTemplateSet(set);
              panelState.setDesignPanelView('preview');
            }}
            sets={sets}
            svgPreviews={svgPreviews}
            svgInputRef={svgInputRef}
            setBackground={setBackgroundWithHistory}
          />

          <ElementsPanel
            show={panelState.showElementsPanel}
            onClose={() => panelState.setShowElementsPanel(false)}
            addTextElement={addTextElementWithHistory}
            imageInputRef={imageInputRef}
            addShapeElement={addShapeElementWithHistory}
          />

          <TextPanel
            show={panelState.showTextPanel}
            onClose={() => panelState.setShowTextPanel(false)}
            addTextElement={addTextElementWithHistory}
            addCustomTextElement={addCustomTextElementWithHistory}
            currentPage={currentEditingPage}
            totalPages={project.pages.length}
            project={project}
            updateElement={updateElementPropertiesOnly}
            deleteElement={deleteElementWithHistory}
          />

          <HistoryPanel
            show={panelState.showHistoryPanel}
            onClose={() => panelState.setShowHistoryPanel(false)}
            project={project}
            historyList={getHistoryList()}
            onRestoreHistoryEntry={restoreToHistoryEntry}
          />

          <UploadsPanel
            show={panelState.showUploadsPanel}
            onClose={() => panelState.setShowUploadsPanel(false)}
            onImageSelect={(dataUrl) => {
              addImageElementWithHistory(dataUrl);
              panelState.setShowUploadsPanel(false);
            }}
          />

          <ToolsPanel
            show={panelState.showToolsPanel}
            onClose={() => panelState.setShowToolsPanel(false)}
            onClearPage={clearCurrentPageWithHistory}
            onClearAll={clearAllPagesWithHistory}
            onDeletePage={() => deletePageWithHistory(currentEditingPage)}
            onInsertPage={addPageWithHistory}
            onDuplicatePage={() => duplicatePageWithHistory(currentEditingPage)}
            onExportJSON={() => exportToJSON(project)}
            onExportPDF={async () => await exportToPDF(project)}
            onPrint={() => {
              // Create a simple print function that opens the current page in a new window
              const validatedPages = getValidatedPages();
              const currentPageData = validatedPages[currentEditingPage];
              if (!currentPageData || !currentPageData.pageSettings) {
                console.error('Page or pageSettings not found, cannot print');
                return;
              }
              const printWindow = window.open('', '_blank');
              printWindow.document.write(`
              <!DOCTYPE html>
              <html>
              <head>
                <title>Print - Page ${currentEditingPage + 1}</title>
                <style>
                  body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                  .page { 
                    width: ${currentPageData.pageSettings.width}px; 
                    height: ${currentPageData.pageSettings.height}px; 
                    margin: 0 auto; 
                    position: relative;
                    background: ${currentPageData.pageSettings.background.type === 'color' ? currentPageData.pageSettings.background.value : '#ffffff'};
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                  }
                  @media print {
                    body { padding: 0; }
                    .page { box-shadow: none; }
                  }
                </style>
              </head>
              <body>
                <div class="page">
                  <!-- Page content would be rendered here -->
                  <div style="padding: 20px; text-align: center;">
                    <h2>Page ${currentEditingPage + 1}</h2>
                    <p>Print functionality - Page content would be rendered here</p>
                  </div>
                </div>
                <script>
                  window.onload = function() {
                    setTimeout(() => {
                      window.print();
                      setTimeout(() => window.close(), 100);
                    }, 500);
                  };
                </script>
              </body>
              </html>
            `);
              printWindow.document.close();
            }}
            currentPage={typeof currentEditingPage === 'number' ? currentEditingPage + 1 : 1}
            totalPages={project.pages.length}
          />

          <ProjectsPanel
            show={panelState.showProjectsPanel}
            onClose={() => panelState.setShowProjectsPanel(false)}
          />

          {!isGridView && (
            <PropertiesPanel
              show={panelState.showPropertiesPanel}
              selectedElement={selectedElement}
              selectedEl={selectedEl}
              updateElement={updateElementPropertiesOnly}
              deleteElement={deleteElementWithHistory}
              duplicateElement={() => duplicateElementWithHistory(selectedEl, selectedElement)}
              onClose={() => panelState.setShowPropertiesPanel(false)}
              project={project}

            />
          )}

          {/* Canvas Area - Full height with no scroll interference */}
          <div
            className="absolute inset-0 w-full h-full"
            ref={scrollContainerRef}
          >
            {isGridView ? (
              <GridView
                project={project}
                zoom={zoom / 100}
                scrollContainerRef={scrollContainerRef}
                currentEditingPage={currentEditingPage}
                onPageClick={(pageIndex) => {
                  setCurrentEditingPage(pageIndex);
                  // Also update the project's currentPage to ensure consistency
                  setProject(prev => ({
                    ...prev,
                    currentPage: pageIndex
                  }));
                  setIsGridView(false);
                }}
                onReorderPages={reorderPagesWithHistory}
              />
            ) : (
              <Canvas
                project={project}
                zoom={zoom / 100}
                currentEditingPage={currentEditingPage}
                selectedElement={selectedElement}
                canvasRefs={canvasRefs}
                scrollContainerRef={scrollContainerRef}
                handleMouseDown={(e, pageIndex, elementId) => handleMouseDown(e, pageIndex, elementId, canvasRefs, panelState.setShowProperties)}
                handleResizeMouseDown={(e, elementId, handle) => handleResizeMouseDown(e, elementId, handle, selectedElement, canvasRefs)}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                updateElement={updateElementWithHistory}
                setSelectedElement={setSelectedElement}
                setCurrentEditingPage={setCurrentEditingPage}
                draggedElement={draggedElement}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="bg-white border-t z-50 shadow-lg"
          style={{
            gridArea: 'footer'
          }}
        >
          <Footer
            onHelpClick={() => alert('Keyboard Shortcuts:\n\nCtrl/Cmd + C: Copy element\nCtrl/Cmd + X: Cut element\nCtrl/Cmd + V: Paste last copied item\nCtrl/Cmd + Z: Undo\nCtrl/Cmd + Shift + Z: Redo\nDelete/Backspace: Delete element\n\nPaste Behavior:\n- Ctrl+V pastes whatever was last copied (element or external text)\n- If you copy/cut an element, that gets pasted\n- If you copy text from outside, that gets pasted\n- Last copied item always takes precedence\n\nHelp documentation coming soon!')}
            onFullscreenClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
            }}
            onGridClick={() => setIsGridView(!isGridView)}
            currentPage={typeof currentEditingPage === 'number' ? currentEditingPage + 1 : 1}
            totalPages={project.pages.length}
            zoom={zoom}
            onZoomChange={setZoom}
            isGridView={isGridView}
          />
        </div>

        {/* Hidden file inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default CanvaApp;