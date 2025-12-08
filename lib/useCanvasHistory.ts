import { useState, useCallback } from 'react';

interface HistoryEntry<T> {
  state: T;
  timestamp: number;
}

export function useCanvasHistory<T>(initialState: T, maxHistory: number = 50) {
  const [history, setHistory] = useState<HistoryEntry<T>[]>([{ state: initialState, timestamp: Date.now() }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentState = history[currentIndex].state;

  const addToHistory = useCallback((newState: T) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ state: newState, timestamp: Date.now() });

      if (newHistory.length > maxHistory) {
        return newHistory.slice(newHistory.length - maxHistory);
      }

      return newHistory;
    });
    setCurrentIndex((prev) => {
      const newHistory = history.slice(0, prev + 1);
      const newLength = Math.min(newHistory.length + 1, maxHistory);
      return newLength - 1;
    });
  }, [currentIndex, history, maxHistory]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      return history[currentIndex - 1].state;
    }
    return currentState;
  }, [currentIndex, history, currentState]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return history[currentIndex + 1].state;
    }
    return currentState;
  }, [currentIndex, history, currentState]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const reset = useCallback((newInitialState: T) => {
    setHistory([{ state: newInitialState, timestamp: Date.now() }]);
    setCurrentIndex(0);
  }, []);

  return {
    currentState,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  };
}
