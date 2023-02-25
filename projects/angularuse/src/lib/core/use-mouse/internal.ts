import { Position } from '../types';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { of, merge, fromEvent, iif, defer, EMPTY, map, filter, Observable } from 'rxjs';
import { consistentQueue } from '../../shared/utils/consistent-queue';

export interface UseMouseOptions {
  /**
   * Mouse position based by page, client, or relative to previous position
   *
   * @default 'page'
   */
  type?: 'page' | 'client' | 'movement';

  /**
   * Listen to `touchmove` events
   *
   * @default true
   */
  touch?: boolean;

  /**
   * Reset to initial value when `touchend` event fired
   *
   * @default false
   */
  resetOnTouchEnds?: boolean;

  /**
   * Initial values
   */
  initialValue?: Position;
}

export type MouseSourceType = 'mouse' | 'touch' | null;

export type UseMouseReturn = { x: number; y: number; sourceType: MouseSourceType };

const mouseHandler = (type: UseMouseOptions['type'], event: MouseEvent): UseMouseReturn | undefined => {
  const sourceType = 'mouse';

  if (type === 'page') {
    return {
      x: event.pageX,
      y: event.pageY,
      sourceType
    };
  } else if (type === 'client') {
    return {
      x: event.clientX,
      y: event.clientY,
      sourceType
    };
  } else if (type === 'movement') {
    return {
      x: event.movementX,
      y: event.movementY,
      sourceType
    };
  }

  return undefined;
};

const touchHandler = (type: UseMouseOptions['type'], event: TouchEvent): UseMouseReturn | undefined => {
  if (event.touches.length > 0) {
    const touch = event.touches[0];
    const sourceType = 'touch';
    if (type === 'page') {
      return {
        x: touch.pageX,
        y: touch.pageY,
        sourceType
      };
    } else if (type === 'client') {
      return {
        x: touch.clientX,
        y: touch.clientY,
        sourceType
      };
    }
  }

  return undefined;
};

export function useMouseInternal(
  windowRef: (Window & typeof globalThis) | null,
  options: UseMouseOptions = {}
): Observable<UseMouseReturn> {
  const { type = 'page', touch = true, resetOnTouchEnds = false, initialValue = { x: 0, y: 0 } } = options;

  const reset = (): UseMouseReturn => ({ ...initialValue, sourceType: null });

  if (!windowRef) {
    return of(reset());
  }

  const touchEventEnd$ = defer(() =>
    iif(() => resetOnTouchEnds, fromEvent<TouchEvent>(windowRef, 'touchend', { passive: true }).pipe(map(reset)), EMPTY)
  );

  const touchEvent$ = merge(
    fromEvent<TouchEvent>(windowRef, 'touchstart', { passive: true }),
    fromEvent<TouchEvent>(windowRef, 'touchmove', { passive: true })
  );

  const touchEvents$ = defer(() =>
    iif(
      () => touch && type !== 'movement',
      merge(touchEvent$.pipe(map(event => touchHandler(type, event))), touchEventEnd$),
      EMPTY
    )
  );

  const mouseEvents$ = merge(
    fromEvent<MouseEvent>(windowRef, 'mousemove', { passive: true }),
    fromEvent<MouseEvent>(windowRef, 'dragover', { passive: true })
  ).pipe(map(event => mouseHandler(type, event)));

  return consistentQueue(reset, merge(mouseEvents$, touchEvents$).pipe(filter(Boolean)));
}

/*
 * internal realisation for reuse inside directives
 */
export function _useMouse() {
  const windowRef = inject(DOCUMENT).defaultView;

  return (options: UseMouseOptions = {}): Observable<UseMouseReturn> => {
    return useMouseInternal(windowRef, options);
  };
}
