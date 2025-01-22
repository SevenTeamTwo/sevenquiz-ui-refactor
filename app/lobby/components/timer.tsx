import { useRef, useState, useEffect } from "react";

export interface TimerProps {
  duration: number;
  onTimeout: () => void;
}

export function Timer(props: TimerProps) {
  const start = useRef(Date.now());
  const [remaining, setRemaining] = useState(props.duration);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(() => {
        const remaining = Math.max(0, props.duration - (Date.now() - start.current) / 1000);
        if (remaining === 0) {
          clearInterval(interval);
          props.onTimeout();
        }
        return remaining;
      });
    }, 10);
    return () => clearInterval(interval);
  }, [props.duration, props.onTimeout]);

  return (
    <div className="relative w-16 h-16">
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
        <title>{remaining.toFixed(0)} seconds remaining</title>
        <circle
          className="text-foreground"
          strokeWidth="3"
          strokeDasharray="100"
          strokeDashoffset={100 - 100 * (remaining / props.duration)}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="16"
          cx="18"
          cy="18"
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{remaining.toFixed(0)}</span>
      </div>
    </div>
  );
}
