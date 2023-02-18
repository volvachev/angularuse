import { inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { idle, UseIdleOptions, UseIdleReturn } from './internal';
import { DOCUMENT } from '@angular/common';

export function useIdle(timeout?: number, options: UseIdleOptions = {}): Observable<UseIdleReturn> {
  const documentRef = inject(DOCUMENT);
  const windowRef: (Window & typeof globalThis) | null = documentRef.defaultView;

  return idle(windowRef, documentRef, timeout, options);
}

export const USE_IDLE = new InjectionToken<Observable<UseIdleReturn>>('Tracks whether the user is being inactive.', {
  factory: useIdle
});

export { UseIdleOptions, UseIdleReturn, WindowEventName } from './internal';
