import { inject, SettableSignal, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Position } from '../types';
import { useOnDestroy } from '../use-until-destroy/internal';

const getPagePositionOfWindow =
  (windowRef: Window & typeof globalThis, signal: SettableSignal<Position>) => (): void => {
    signal.set({
      x: windowRef.pageXOffset,
      y: windowRef.pageYOffset
    });
  };

export function useWindowScrollSignal(): SettableSignal<Position> {
  const windowRef: (Window & typeof globalThis) | null = inject(DOCUMENT).defaultView;
  const windowScrollSignal = signal<Position>({ x: 0, y: 0 });
  const destroy = useOnDestroy();

  if (!windowRef) {
    return windowScrollSignal;
  }

  const getPagePositionOfWindowCurry = getPagePositionOfWindow(windowRef, windowScrollSignal);

  getPagePositionOfWindowCurry();

  windowRef.addEventListener('scroll', getPagePositionOfWindowCurry, { capture: false, passive: true });

  destroy(() => {
    windowRef.removeEventListener('scroll', getPagePositionOfWindowCurry, { capture: false });
  });

  return windowScrollSignal;
}
