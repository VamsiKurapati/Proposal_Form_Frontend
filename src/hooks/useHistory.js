import { useState, useCallback, useEffect, useRef } from 'react';

export const useHistory = (project, setProject, setCurrentEditingPage, setSelectedElement) => {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);
  const maxHistorySize = 23; // Limit history to 23 entries (v2-v24, excluding v0 and v1)
  const isInitialized = useRef(false);
  const debounceTimeoutRef = useRef(null);
  const pendingHistoryUpdate = useRef(null);

  // Debounced save to history for property changes
  const saveToHistoryDebounced = useCallback((action, description, updates = null, customState = null) => {
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Store the pending update with current project state
    pendingHistoryUpdate.current = { 
      action, 
      description, 
      updates, 
      customState,
      projectState: JSON.parse(JSON.stringify(project)) // Capture current project state
    };
    
    // Set a new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      if (pendingHistoryUpdate.current) {
        // Use the captured project state instead of current project state
        const capturedProjectState = pendingHistoryUpdate.current.projectState;
        
        // Create a custom save function that uses the captured state
        const saveWithCapturedState = (action, description, updates, customState) => {
          if (isUndoRedoAction) {
            setIsUndoRedoAction(false);
            return;
          }

          const newState = customState ? JSON.parse(JSON.stringify(customState)) : JSON.parse(JSON.stringify(capturedProjectState));
          
          // Calculate the next version number based on the current history state
          let nextVersion;
          if (currentIndex >= 0 && history.length > 0) {
            nextVersion = currentIndex + 1;
          } else {
            nextVersion = 0;
          }
          
          // Ensure the state is properly structured
          if (!newState.pages || !Array.isArray(newState.pages)) {
            return;
          }
          
          const historyEntry = {
            id: Date.now(),
            timestamp: new Date(),
            action,
            description: `v${nextVersion} - ${description}`,
            state: newState,
            version: nextVersion
          };
          
          setHistory(prev => {
            // Remove any future history if we're not at the end
            const newHistory = prev.slice(0, currentIndex + 1);
            
            // Add new entry
            const updatedHistory = [...newHistory, historyEntry];
            
            // Implement queue behavior: keep v0 and v1 permanent, limit others to maxHistorySize
            if (updatedHistory.length > maxHistorySize + 2) { // +2 for v0 and v1 (total 25)
              // Keep v0 and v1, then take the last maxHistorySize entries
              const permanentEntries = updatedHistory.slice(0, 2); // v0 and v1
              const recentEntries = updatedHistory.slice(-maxHistorySize);
              return [...permanentEntries, ...recentEntries];
            }
            
            return updatedHistory;
          });

          // Update currentIndex to point to the new entry
          setCurrentIndex(prev => {
            const newIndex = currentIndex + 1;
            return newIndex;
          });
        };
        
        console.log('Debounced history save:', {
          action: pendingHistoryUpdate.current.action,
          description: pendingHistoryUpdate.current.description,
          currentIndex,
          historyLength: history.length
        });
        
        saveWithCapturedState(
          pendingHistoryUpdate.current.action,
          pendingHistoryUpdate.current.description,
          pendingHistoryUpdate.current.updates,
          pendingHistoryUpdate.current.customState
        );
        pendingHistoryUpdate.current = null;
      }
    }, 500); // 500ms debounce delay
  }, [project, currentIndex, history.length, isUndoRedoAction, maxHistorySize]);

  // Save current state to history
  const saveToHistory = useCallback((action, description, updates = null, customState = null) => {
    if (isUndoRedoAction) {
      setIsUndoRedoAction(false);
      return;
    }

    // Check if this is a minimal change that should be ignored
    // Only check for minimal changes if we're not using customState (element additions)
    if (updates && !customState && currentIndex >= 0 && currentIndex < history.length && history.length > 0) {
      const lastHistoryEntry = history[currentIndex];
      if (!lastHistoryEntry || !lastHistoryEntry.state) {
        return;
      }
      
      const lastState = lastHistoryEntry.state;
      const currentPage = lastState.pages[project.currentPage || 0];
      const newPage = project.pages[project.currentPage || 0];
      
      // Validate pages exist
      if (!currentPage || !newPage) {
        return;
      }
      
      // Find the element being updated
      const elementId = Object.keys(updates)[0];
      
      if (elementId) {
        const oldElement = currentPage.elements.find(el => el.id === elementId);
        const newElement = newPage.elements.find(el => el.id === elementId);
        
        if (oldElement && newElement) {
          // Check if this is a property-only change (color, font, rotation, z-index, etc.)
          const isPropertyOnlyChange = updates[elementId] && (
            (updates[elementId].properties && !updates[elementId].x && !updates[elementId].y && !updates[elementId].width && !updates[elementId].height) ||
            updates[elementId].rotation !== undefined ||
            updates[elementId].zIndex !== undefined
          );
          
          // If it's a property-only change, always save it
          if (isPropertyOnlyChange) {
            // Continue to save the history entry
          } else {
            // For position/size changes, check if they're minimal
            const deltaX = Math.abs(newElement.x - oldElement.x);
            const deltaY = Math.abs(newElement.y - oldElement.y);
            const deltaWidth = Math.abs(newElement.width - oldElement.width);
            const deltaHeight = Math.abs(newElement.height - oldElement.height);
            
            // Threshold values (in pixels)
            const POSITION_THRESHOLD = 5; // 5 pixels
            const SIZE_THRESHOLD = 3; // 3 pixels
            
            // Only save if changes are significant
            if (deltaX < POSITION_THRESHOLD && deltaY < POSITION_THRESHOLD && 
                deltaWidth < SIZE_THRESHOLD && deltaHeight < SIZE_THRESHOLD) {
              return; // Ignore minimal changes
            }
          }
        }
      }
    }

    const newState = customState ? JSON.parse(JSON.stringify(customState)) : JSON.parse(JSON.stringify(project));
    
    // Calculate the next version number based on the current history state
    let nextVersion;
    if (currentIndex >= 0 && history.length > 0) {
      // If we have history, get the next version after the current index
      nextVersion = currentIndex + 1;
    } else {
      // If no history, start with version 0
      nextVersion = 0;
    }
    

    
    // Ensure the state is properly structured
    if (!newState.pages || !Array.isArray(newState.pages)) {
      return;
    }
    
    const historyEntry = {
      id: Date.now(),
      timestamp: new Date(),
      action,
      description: `v${nextVersion} - ${description}`,
      state: newState,
      version: nextVersion
    };
    
    console.log('Regular history save:', {
      action,
      description,
      currentIndex,
      historyLength: history.length,
      nextVersion
    });
    


    setHistory(prev => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Add new entry
      const updatedHistory = [...newHistory, historyEntry];
      
      // Implement queue behavior: keep v0 and v1 permanent, limit others to maxHistorySize
      if (updatedHistory.length > maxHistorySize + 2) { // +2 for v0 and v1 (total 25)
        // Keep v0 and v1, then take the last maxHistorySize entries
        const permanentEntries = updatedHistory.slice(0, 2); // v0 and v1
        const recentEntries = updatedHistory.slice(-maxHistorySize);
        return [...permanentEntries, ...recentEntries];
      }
      
      return updatedHistory;
    });

    // Update currentIndex to point to the new entry
    setCurrentIndex(prev => {
      const newIndex = currentIndex + 1;
      return newIndex;
    });
  }, [project, currentIndex, isUndoRedoAction, maxHistorySize, history.length]);

  // Undo function
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setIsUndoRedoAction(true);
      const previousState = history[currentIndex - 1].state;
      
      // Validate the restored state
      if (!previousState.pages || !Array.isArray(previousState.pages) || previousState.pages.length === 0) {
        return;
      }
      
      // Ensure currentPage is valid
      const validCurrentPage = Math.max(0, Math.min(previousState.currentPage || 0, previousState.pages.length - 1));
      
      // Create a deep copy and ensure all elements have required properties
      const restoredStateCopy = JSON.parse(JSON.stringify(previousState));
      restoredStateCopy.currentPage = validCurrentPage;
      
      // Ensure all elements have required properties
      restoredStateCopy.pages.forEach((page, pageIndex) => {
        if (page.elements && Array.isArray(page.elements)) {
          page.elements.forEach(element => {
            // Ensure element has all required properties
            if (!element.properties) {
              element.properties = {};
            }
            if (!element.x) element.x = 0;
            if (!element.y) element.y = 0;
            if (!element.width) element.width = 100;
            if (!element.height) element.height = 100;
            if (!element.rotation) element.rotation = 0;
            if (!element.zIndex || isNaN(element.zIndex)) element.zIndex = 1;
            if (!element.id) element.id = `restored-${Date.now()}-${Math.random()}`;
          });
        }
      });
      
      setProject(restoredStateCopy);
      setCurrentEditingPage(validCurrentPage);
      setSelectedElement({ pageIndex: validCurrentPage, elementId: null });
      setCurrentIndex(currentIndex - 1);
      
      // Reset the flag after a short delay to allow the state to update
      setTimeout(() => {
        setIsUndoRedoAction(false);
      }, 100);
    }
  }, [currentIndex, history, setProject, setCurrentEditingPage, setSelectedElement]);

  // Redo function
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setIsUndoRedoAction(true);
      const nextState = history[currentIndex + 1].state;
      
      // Validate the restored state
      if (!nextState.pages || !Array.isArray(nextState.pages) || nextState.pages.length === 0) {
        return;
      }
      
      // Ensure currentPage is valid
      const validCurrentPage = Math.max(0, Math.min(nextState.currentPage || 0, nextState.pages.length - 1));
      
      // Create a deep copy and ensure all elements have required properties
      const restoredStateCopy = JSON.parse(JSON.stringify(nextState));
      restoredStateCopy.currentPage = validCurrentPage;
      
      // Ensure all elements have required properties
      restoredStateCopy.pages.forEach((page, pageIndex) => {
        if (page.elements && Array.isArray(page.elements)) {
          page.elements.forEach(element => {
            // Ensure element has all required properties
            if (!element.properties) {
              element.properties = {};
            }
            if (!element.x) element.x = 0;
            if (!element.y) element.y = 0;
            if (!element.width) element.width = 100;
            if (!element.height) element.height = 100;
            if (!element.rotation) element.rotation = 0;
            if (!element.zIndex || isNaN(element.zIndex)) element.zIndex = 1;
            if (!element.id) element.id = `restored-${Date.now()}-${Math.random()}`;
          });
        }
      });
      
      setProject(restoredStateCopy);
      setCurrentEditingPage(validCurrentPage);
      setSelectedElement({ pageIndex: validCurrentPage, elementId: null });
      setCurrentIndex(currentIndex + 1);
      
      // Reset the flag after a short delay to allow the state to update
      setTimeout(() => {
        setIsUndoRedoAction(false);
      }, 100);
    }
  }, [currentIndex, history, setProject, setCurrentEditingPage, setSelectedElement]);

  // Initialize history with current project state
  useEffect(() => {
    if (project && Object.keys(project).length > 0 && !isInitialized.current) {
      // Create initial state as v0
      const newState = JSON.parse(JSON.stringify(project));
      const initialHistoryEntry = {
        id: Date.now(),
        timestamp: new Date(),
        action: 'Initial State',
        description: 'v0 - Initial empty page',
        state: newState,
        version: 0
      };
      
      setHistory([initialHistoryEntry]);
      setCurrentIndex(0);
      isInitialized.current = true;
    }
  }, [project]); // Only depend on project changes



  // Check if undo/redo are available
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Get current history entry
  const getCurrentHistoryEntry = () => {
    return history[currentIndex] || null;
  };

  // Get history for display
  const getHistoryList = () => {
    return history.map((entry, index) => ({
      ...entry,
      isCurrent: index === currentIndex
    }));
  };

  // Clear history (useful for new projects)
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  // Cleanup effect to clear debounce timeout
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Restore to specific history entry
  const restoreToHistoryEntry = useCallback((entryId) => {
    const entryIndex = history.findIndex(entry => entry.id === entryId);
    if (entryIndex !== -1) {
      setIsUndoRedoAction(true);
      const restoredState = history[entryIndex].state;
      

      
      // Validate the restored state
      if (!restoredState.pages || !Array.isArray(restoredState.pages) || restoredState.pages.length === 0) {
        return;
      }
      
      // Ensure currentPage is valid
      const validCurrentPage = Math.max(0, Math.min(restoredState.currentPage || 0, restoredState.pages.length - 1));
      
      // Create a deep copy to avoid reference issues
      const restoredStateCopy = JSON.parse(JSON.stringify(restoredState));
      
      // Update the currentPage to match the valid page
      restoredStateCopy.currentPage = validCurrentPage;
      
      // Ensure all elements have required properties
      restoredStateCopy.pages.forEach((page, pageIndex) => {
        if (page.elements && Array.isArray(page.elements)) {
          page.elements.forEach(element => {
            // Ensure element has all required properties
            if (!element.properties) {
              element.properties = {};
            }
            if (!element.x) element.x = 0;
            if (!element.y) element.y = 0;
            if (!element.width) element.width = 100;
            if (!element.height) element.height = 100;
            if (!element.rotation) element.rotation = 0;
            if (!element.zIndex || isNaN(element.zIndex)) element.zIndex = 1;
            if (!element.id) element.id = `restored-${Date.now()}-${Math.random()}`;
          });
        }
      });
      
      // Mark as history restoration to prevent auto-save
      restoredStateCopy._isHistoryRestoration = true;
      
      setProject(restoredStateCopy);
      setCurrentEditingPage(validCurrentPage);
      setSelectedElement({ pageIndex: validCurrentPage, elementId: null });
      setCurrentIndex(entryIndex);
      
      // Force a re-render by updating the project state again and remove the restoration flag
      setTimeout(() => {
        setProject(prev => ({ ...prev, _isHistoryRestoration: false }));
        // Reset the undo/redo action flag
        setIsUndoRedoAction(false);
      }, 100); // Increased timeout to ensure state is properly updated
    }
  }, [history, setProject, setCurrentEditingPage, setSelectedElement]);

  return {
    saveToHistory,
    saveToHistoryDebounced,
    undo,
    redo,
    canUndo,
    canRedo,
    getCurrentHistoryEntry,
    getHistoryList,
    clearHistory,
    restoreToHistoryEntry,
    setIsUndoRedoAction,
    historyLength: history.length,
    currentIndex
  };
}; 