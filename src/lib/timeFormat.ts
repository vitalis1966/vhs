// Time formatting utilities for the Time Tracking system.
// All durations are integer seconds.

export function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export interface DurationParts {
  hours: number;
  minutes: number;
  seconds: number;
  hhmm: string;        // "1:23"
  hhmmss: string;      // "01:23:45"
  human: string;       // "1h 23m"
  decimal: number;     // 1.38
  decimalLabel: string; // "1.38h"
}

export function formatDuration(totalSeconds: number): DurationParts {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const decimal = Math.round((s / 3600) * 100) / 100;
  return {
    hours,
    minutes,
    seconds,
    hhmm: `${hours}:${pad2(minutes)}`,
    hhmmss: `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`,
    human: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
    decimal,
    decimalLabel: `${decimal.toFixed(2)}h`,
  };
}

// Round seconds to nearest N-minute interval (0 = no rounding)
export function roundSeconds(seconds: number, roundingMinutes: number) {
  if (!roundingMinutes || roundingMinutes <= 0) return seconds;
  const r = roundingMinutes * 60;
  return Math.round(seconds / r) * r;
}

export function dualLabel(totalSeconds: number, showDecimal = true) {
  const d = formatDuration(totalSeconds);
  return showDecimal ? `${d.human} / ${d.decimalLabel}` : d.human;
}

export function hoursToSeconds(hours: number) {
  return Math.round((hours || 0) * 3600);
}
