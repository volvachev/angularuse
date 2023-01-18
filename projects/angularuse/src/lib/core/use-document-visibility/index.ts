import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { concat, defer, fromEvent, map, Observable, of } from 'rxjs';

export function useDocumentVisibility(): Observable<DocumentVisibilityState> {
  const document: Document = inject(DOCUMENT);

  if (!document) {
    return of('visible');
  }

  return concat(
    defer(() => of(document.visibilityState)),
    fromEvent(document, 'visibilitychange', { passive: true }).pipe(map(() => document.visibilityState))
  );
}

export const DOCUMENT_IS_VISIBLE = new InjectionToken('Reactively track document.visibilityState', {
  factory: useDocumentVisibility,
});
