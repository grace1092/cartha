'use client';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export default function Progress({ 
  value, 
  max = 100, 
  className = '' 
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-gradient-to-r from-primary-start to-primary-end h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
} 