import { of, merge, fromEvent, defer, iif, EMPTY, map, Observable } from 'rxjs';
import { consistentQueue } from '../../shared/utils/consistent-queue';
import { MouseSourceType } from '../use-mouse';
import { ElementRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WindowRef } from '../types';

export interface UseMousePressedOptions {
  /**
   * Listen to `touchstart` `touchend` events
   *
   * @default true
   */
  touch?: boolean;

  /**
   * Listen to `dragstart` `drop` and `dragend` events
   *
   * @default true
   */
  drag?: boolean;

  /**
   * Initial values
   *
   * @default false
   */
  initialValue?: boolean;

  /**
   * Element target to be capture the click
   */
  targetRef?: HTMLElement;
}

export interface MousePressedParams {
  windowRef: WindowRef;
  targetRef: HTMLElement | null;
}

export interface UseMousePressedReturn {
  pressed: boolean;
  sourceType: MouseSourceType;
}

const onPressed = (sourceType: MouseSourceType) => () => ({
  pressed: true,
  sourceType
});

const onReleased = () => ({
  pressed: false,
  sourceType: null
});

const pipeOnReleased = map(onReleased);

export function mousePressed(
  params: MousePressedParams,
  options: UseMousePressedOptions = {}
): Observable<UseMousePressedReturn> {
  const { touch = true, drag = true, initialValue = false, targetRef: targetRefOptions } = options;
  const { windowRef, targetRef } = params;

  const defaultValue = () => ({
    pressed: initialValue,
    sourceType: null
  });

  if (!windowRef) {
    return of(defaultValue());
  }

  const target = targetRefOptions ?? targetRef ?? windowRef;

  const drag$ = defer(() =>
    iif(
      () => drag,
      merge(
        fromEvent<DragEvent>(target, 'dragstart', { passive: true }).pipe(map(onPressed('mouse'))),
        fromEvent<DragEvent>(windowRef, 'drop', { passive: true }).pipe(pipeOnReleased),
        fromEvent<DragEvent>(windowRef, 'dragend', { passive: true }).pipe(pipeOnReleased)
      ),
      EMPTY
    )
  );

  const touch$ = defer(() =>
    iif(
      () => touch,
      merge(
        fromEvent<DragEvent>(target, 'touchstart', { passive: true }).pipe(map(onPressed('touch'))),
        fromEvent<DragEvent>(windowRef, 'touchend', { passive: true }).pipe(pipeOnReleased),
        fromEvent<DragEvent>(windowRef, 'touchcancel', { passive: true }).pipe(pipeOnReleased)
      ),
      EMPTY
    )
  );

  return consistentQueue(
    defaultValue,
    merge(
      fromEvent<MouseEvent>(target, 'mousedown', { passive: true }).pipe(map(onPressed('mouse'))),
      fromEvent<MouseEvent>(windowRef, 'mouseleave', { passive: true }).pipe(pipeOnReleased),
      fromEvent<MouseEvent>(windowRef, 'mouseup', { passive: true }).pipe(pipeOnReleased),
      drag$,
      touch$
    )
  );
}

/*
 * internal realisation for reuse inside directives
 */
export function _useMousePressed() {
  const element = inject(ElementRef, { optional: true });
  const windowRef = inject(DOCUMENT).defaultView;

  return (options: UseMousePressedOptions = {}): Observable<UseMousePressedReturn> => {
    const targetRef = element?.nativeElement ?? windowRef;
    return mousePressed({ windowRef, targetRef }, options);
  };
}
