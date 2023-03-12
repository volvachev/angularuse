import { WindowRef } from '../types';
import { of, merge, fromEvent, map, distinctUntilChanged } from 'rxjs';
import { consistentQueue } from '../../shared/utils/consistent-queue';

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
