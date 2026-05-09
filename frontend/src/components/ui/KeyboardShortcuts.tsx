'use client';

import { useEffect } from 'react';

const ADD_DOCTOR_EVENT = 'open-add-doctor-modal';

export function dispatchOpenAddDoctor() {
  window.dispatchEvent(new CustomEvent(ADD_DOCTOR_EVENT));
}

export function useOpenAddDoctorListener(handler: () => void) {
  useEffect(() => {
    window.addEventListener(ADD_DOCTOR_EVENT, handler);
    return () => window.removeEventListener(ADD_DOCTOR_EVENT, handler);
  }, [handler]);
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

export function KeyboardShortcuts() {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      if (e.key === '/') {
        const search = document.getElementById('global-search') as HTMLInputElement | null;
        if (search) {
          e.preventDefault();
          search.focus();
          search.select();
        }
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        dispatchOpenAddDoctor();
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return null;
}
