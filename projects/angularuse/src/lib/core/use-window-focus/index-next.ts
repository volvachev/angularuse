import { inject, SettableSignal, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { useOnDestroy } from '../use-until-destroy/internal';

export function useWindowFocusSignal(): SettableSignal<boolean> {
  const documentRef: Document = inject(DOCUMENT);
  const windowRef: (Window & typeof globalThis) | null = documentRef.defaultView;
  const windowFocusSignal = signal<boolean>(false);
  const destroy = useOnDestroy();

  if (!windowRef) {
    return windowFocusSignal;
  }

  windowFocusSignal.set(documentRef.hasFocus());
  const focusHandler = () => {
    windowFocusSignal.set(true);
  };

  const blurHandler = () => {
    windowFocusSignal.set(false);
  };

  windowRef.addEventListener('focus', focusHandler, { passive: true });
  windowRef.addEventListener('blur', blurHandler, { passive: true });

  destroy(() => {
    windowRef.removeEventListener('focus', focusHandler);
    windowRef.removeEventListener('blur', blurHandler);
  });

  return windowFocusSignal;
}
