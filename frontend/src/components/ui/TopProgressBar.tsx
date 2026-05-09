'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minDurationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAtRef = useRef<number>(0);

  useEffect(() => {
    function start() {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (completeTimeoutRef.current) clearTimeout(completeTimeoutRef.current);
      if (minDurationRef.current) clearTimeout(minDurationRef.current);

      startedAtRef.current = performance.now();
      setVisible(true);
      setProgress(15);

      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return Math.min(prev + Math.random() * 8 + 2, 90);
        });
      }, 200);
    }

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) return;
      if (anchor.getAttribute('target') === '_blank') return;
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;

      start();
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (!visible) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    const elapsed = performance.now() - startedAtRef.current;
    const remaining = Math.max(400 - elapsed, 0);

    minDurationRef.current = setTimeout(() => {
      setProgress(100);
      completeTimeoutRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 200);
    }, remaining);

    return () => {
      if (minDurationRef.current) clearTimeout(minDurationRef.current);
    };
  }, [pathname, searchParams, visible]);

  if (!visible) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] h-0.5 overflow-hidden bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 10px rgba(20, 184, 166, 0.8)',
        }}
      />
    </div>
  );
}
