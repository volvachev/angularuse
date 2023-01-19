import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, map, Observable, of } from 'rxjs';
import { consistentQueue } from '../../shared/utils/consistent-queue';

const getDocumentVisibilityState = (document: Document) => (): DocumentVisibilityState => document.visibilityState;

export function useDocumentVisibility(): Observable<DocumentVisibilityState> {
  const document: Document = inject(DOCUMENT);

  if (!document) {
    return of('visible');
  }

  const getVisibilityState = getDocumentVisibilityState(document);

  return consistentQueue(
    getVisibilityState,
    fromEvent(document, 'visibilitychange', { passive: true }).pipe(map(getVisibilityState))
  );
}

export const DOCUMENT_IS_VISIBLE = new InjectionToken<Observable<DocumentVisibilityState>>(
  'Reactively track document.visibilityState',
  {
    factory: useDocumentVisibility
  }
);
