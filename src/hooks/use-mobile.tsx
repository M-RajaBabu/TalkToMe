import { useEffect } from 'react';

export const useMobile = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return { isMobile };
};

// Custom hook for speech synthesis cleanup
export const useSpeechCleanup = () => {
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
};

// Utility function to stop speech synthesis
export const stopSpeechSynthesis = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
