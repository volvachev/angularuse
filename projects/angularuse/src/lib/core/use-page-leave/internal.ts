import { WindowRef } from '../types';
import { of, merge, fromEvent, map, distinctUntilChanged } from 'rxjs';
import { consistentQueue } from '../../shared/utils/consistent-queue';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export function pageLeave(windowRef: WindowRef, documentRef: Document) {
  if (!windowRef) {
    return of(false);
  }

  const handler = (event: MouseEvent | null): boolean => {
    if (event === null) {
      return false;
    }

    const patchedEvent = event || (windowRef.event as any);
    // @ts-expect-error missing types
    const from = patchedEvent.relatedTarget || patchedEvent.toElement;
    return !from;
  };

  return consistentQueue(
    () => null,
    merge(
      fromEvent<MouseEvent>(windowRef, 'mouseout', { passive: true }),
      fromEvent<MouseEvent>(documentRef, 'mouseleave', { passive: true }),
      fromEvent<MouseEvent>(documentRef, 'mouseenter', { passive: true })
    )
  ).pipe(map(handler), distinctUntilChanged());
}

/*
 * internal realisation for reuse inside directives
 */
export function _usePageLeave() {
  const documentRef = inject(DOCUMENT);
  const windowRef = documentRef.defaultView;

  return () => pageLeave(windowRef, documentRef);
}
