import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

function getScoreColor(score: number): string {
  if (score <= 30) return '#CE6B59'; // danger-500 (warm rose)
  if (score <= 60) return '#C99A55'; // warning-500 (warm amber)
  return '#7FA584'; // success-500 (warm sage)
}

function getScoreTrackColor(score: number): string {
  if (score <= 30) return '#332320'; // danger-100
  if (score <= 60) return '#332B1E'; // warning-100
  return '#2A2E26'; // success-100
}

export default function ScoreGauge({
  score,
  size = 80,
  label,
}: ScoreGaugeProps) {
  const [mounted, setMounted] = useState(false);
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (progress / 100) * circumference;
  const color = getScoreColor(score);
  const trackColor = getScoreTrackColor(score);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: mounted ? offset : circumference,
            }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-lg font-bold"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      {label && (
        <span className="text-xs text-ivory-muted font-medium">{label}</span>
      )}
    </div>
  );
}
