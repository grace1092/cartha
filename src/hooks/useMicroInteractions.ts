'use client';

import { useState, useEffect, useCallback } from 'react';

interface MicroInteractionOptions {
  duration?: number;
  delay?: number;
  easing?: string;
}

export function useMicroInteractions(options: MicroInteractionOptions = {}) {
  const { duration = 200, delay = 0, easing = 'ease-out' } = options;
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), duration);
  }, [duration]);

  const hoverAnimation = useCallback((element: HTMLElement) => {
    element.style.transform = 'scale(1.05)';
    element.style.transition = `transform ${duration}ms ${easing}`;
  }, [duration, easing]);

  const leaveAnimation = useCallback((element: HTMLElement) => {
    element.style.transform = 'scale(1)';
  }, []);

  const clickAnimation = useCallback((element: HTMLElement) => {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 100);
  }, []);

  return {
    isAnimating,
    triggerAnimation,
    hoverAnimation,
    leaveAnimation,
    clickAnimation,
  };
}

// Hook for scroll-triggered animations
export function useScrollAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const [elementRef, setElementRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    observer.observe(elementRef);
    return () => observer.disconnect();
  }, [elementRef, threshold]);

  return { isVisible, setElementRef };
}

// Hook for keyboard navigation
export function useKeyboardNavigation(items: any[], onSelect: (item: any) => void) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          onSelect(items[selectedIndex]);
        }
        break;
      case 'Escape':
        setSelectedIndex(-1);
        break;
    }
  }, [items, selectedIndex, onSelect]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { selectedIndex, setSelectedIndex };
}

// Hook for focus management
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

  const focusElement = useCallback((element: HTMLElement) => {
    element.focus();
    setFocusedElement(element);
  }, []);

  const focusNext = useCallback((elements: HTMLElement[]) => {
    const currentIndex = elements.findIndex(el => el === focusedElement);
    const nextIndex = (currentIndex + 1) % elements.length;
    focusElement(elements[nextIndex]);
  }, [focusedElement, focusElement]);

  const focusPrevious = useCallback((elements: HTMLElement[]) => {
    const currentIndex = elements.findIndex(el => el === focusedElement);
    const prevIndex = (currentIndex - 1 + elements.length) % elements.length;
    focusElement(elements[prevIndex]);
  }, [focusedElement, focusElement]);

  return {
    focusedElement,
    focusElement,
    focusNext,
    focusPrevious,
  };
}

// Hook for loading states
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingMessage, setLoadingMessage] = useState('');

  const startLoading = useCallback((message = 'Loading...') => {
    setIsLoading(true);
    setLoadingMessage(message);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('');
  }, []);

  const withLoading = useCallback(async (asyncFn: () => Promise<any>, message?: string) => {
    startLoading(message);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    withLoading,
  };
}

// Hook for toast notifications
export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }>>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message: string) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message: string) => addToast(message, 'error'), [addToast]);
  const warning = useCallback((message: string) => addToast(message, 'warning'), [addToast]);
  const info = useCallback((message: string) => addToast(message, 'info'), [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
} 