import { useState } from 'react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  loading?: 'eager' | 'lazy';
}

export function SmartImage({
  src,
  alt,
  className = '',
  fallbackLabel,
  loading = 'lazy',
}: SmartImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#221F1B] via-[#1A1713] to-[#100E0A] text-[#C9A96E]/75 p-4 text-center ${className}`}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          aria-hidden="true"
          className="mb-2 opacity-75"
        >
          <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <path
            d="M18 9C19.8 13.4 22.6 16.2 27 18C22.6 19.8 19.8 22.6 18 27C16.2 22.6 13.4 19.8 9 18C13.4 16.2 16.2 13.4 18 9Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
        {fallbackLabel && (
          <span className="font-display text-xs tracking-wider uppercase text-[#D0C5B5]/80">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
