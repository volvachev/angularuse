import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, map, merge, Observable, of } from 'rxjs';
import { consistentQueue } from '../../shared/utils/consistent-queue';

export function useWindowFocus(): Observable<boolean> {
  const document: Document = inject(DOCUMENT);
  const window: (Window & typeof globalThis) | null = document.defaultView;

  if (!window) {
    return of(false);
  }

  const blur$ = fromEvent(window, 'blur', { passive: true }).pipe(map(() => false));
  const focus$ = fromEvent(window, 'focus', { passive: true }).pipe(map(() => true));

  return consistentQueue(() => document.hasFocus(), merge(blur$, focus$));
}

export const WINDOW_IS_FOCUSED = new InjectionToken<Observable<boolean>>('Window is focused', {
  factory: useWindowFocus
});
