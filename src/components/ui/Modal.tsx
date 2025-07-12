'use client';

import { useEffect, ReactNode } from 'react';
import { X, Minimize2 } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  title: string;
  children: ReactNode;
  showMinimize?: boolean;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  onMinimize, 
  title, 
  children, 
  showMinimize = true 
}: ModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-[95%] h-[95%] max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          
          <div className="flex items-center space-x-2">
            {showMinimize && onMinimize && (
              <button
                onClick={onMinimize}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-all duration-200 group"
                title="Minimize"
              >
                <Minimize2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
              title="Close"
            >
              <X className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
} 