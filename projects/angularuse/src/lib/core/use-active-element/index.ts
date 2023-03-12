import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { filter, fromEvent, map, merge, Observable, of } from 'rxjs';
import { consistentQueue } from '../../shared/utils/consistent-queue';
import { WindowRef } from '../types';

export function useActiveElement(): Observable<null | Element> {
  const document: Document = inject(DOCUMENT);
  const window: WindowRef = document.defaultView;

  if (!window) {
    return of(null);
  }

  return consistentQueue(
    () => null,
    merge(
      fromEvent<FocusEvent>(window, 'blur', { passive: true, capture: true }).pipe(
        filter(event => event.relatedTarget === null)
      ),
      fromEvent<FocusEvent>(window, 'focus', { passive: true, capture: true })
    )
  ).pipe(map(() => document?.activeElement ?? null));
}

export const ACTIVE_ELEMENT = new InjectionToken<Observable<null | Element>>('Reactive `document.activeElement`', {
  factory: useActiveElement
});
