'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image, { ImageProps } from 'next/image';

interface LazyImageProps extends Omit<ImageProps, 'onLoad' | 'onError' | 'placeholder'> {
  placeholderSrc?: string;
  fallback?: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export default function LazyImage({
  src,
  alt,
  placeholderSrc = '/placeholder.svg',
  fallback = '/fallback.svg',
  className = '',
  priority = false,
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const imageSrc = hasError ? fallback : src;

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          >
            <Image
              src={placeholderSrc}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Image */}
      {isInView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={imageSrc}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            priority={priority}
            {...props}
          />
        </motion.div>
      )}
    </div>
  );
}

// Optimized image component for hero sections
export function HeroImage({ src, alt, ...props }: LazyImageProps) {
  return (
    <LazyImage
      src={src}
      alt={alt}
      priority={true}
      className="w-full h-full object-cover"
      {...props}
    />
  );
}

// Optimized image component for avatars
export function AvatarImage({ src, alt, ...props }: LazyImageProps) {
  return (
    <LazyImage
      src={src}
      alt={alt}
      className="rounded-full"
      {...props}
    />
  );
}

// Optimized image component for cards
export function CardImage({ src, alt, ...props }: LazyImageProps) {
  return (
    <LazyImage
      src={src}
      alt={alt}
      className="rounded-lg"
      {...props}
    />
  );
} 