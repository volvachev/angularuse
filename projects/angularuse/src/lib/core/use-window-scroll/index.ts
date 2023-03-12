import { Position, WindowRef } from '../types';
import { fromEvent, map, Observable, of } from 'rxjs';
import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { consistentQueue } from '../../shared/utils/consistent-queue';

function getPagePositionOfWindow(window: Window & typeof globalThis): Position {
  return {
    x: window.pageXOffset,
    y: window.pageYOffset
  };
}

export function useWindowScroll(): Observable<Position> {
  const document: Document = inject(DOCUMENT);
  const window: WindowRef = document.defaultView;

  if (!window) {
    return of({
      x: 0,
      y: 0
    });
  }

  return consistentQueue(() => null, fromEvent(window, 'scroll', { capture: false, passive: true })).pipe(
    map(() => getPagePositionOfWindow(window))
  );
}

export const WINDOW_SCROLL = new InjectionToken<Observable<Position>>('Reactive window scroll', {
  factory: useWindowScroll
});
