import { useState, useEffect } from 'react';

const TUTORIAL_STORAGE_KEY = 'pgm-tutorial-completed';

export const useTutorial = () => {
  const [tutorialCompleted, setTutorialCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se o tutorial já foi completado
    const completed = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    setTutorialCompleted(completed === 'true');
    setIsLoading(false);
  }, []);

  const markTutorialCompleted = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    setTutorialCompleted(true);
  };

  const resetTutorial = () => {
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
    setTutorialCompleted(false);
  };

  return {
    tutorialCompleted,
    isLoading,
    markTutorialCompleted,
    resetTutorial,
  };
};