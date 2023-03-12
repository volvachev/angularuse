import { Observable, of, merge, fromEvent, map, debounce, timer, asyncScheduler, queueScheduler } from 'rxjs';
import { ElementRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WindowRef } from '../types';
import { consistentQueue } from '../../shared/utils/consistent-queue';

export interface UseElementHoverOptions {
  delayEnter?: number;
  delayLeave?: number;
}

export function elementHover(
  target: HTMLElement,
  windowRef: WindowRef,
  options: UseElementHoverOptions = {}
): Observable<boolean> {
  if (!windowRef) {
    return of(false);
  }

  const { delayEnter = 0, delayLeave = 0 } = options;

  return consistentQueue(
    () => false,
    merge(
      fromEvent<MouseEvent>(target, 'mouseenter', { passive: true }).pipe(map(() => true)),
      fromEvent<MouseEvent>(target, 'mouseleave', { passive: true }).pipe(map(() => false))
    ).pipe(
      debounce((value: boolean) => {
        const timeNumber = value ? delayEnter : delayLeave;
        const isZero = timeNumber === 0;
        const timerScheduler = isZero ? queueScheduler : asyncScheduler;
        return timer(timeNumber, timerScheduler);
      })
    )
  );
}

/*
 * internal realisation for reuse inside directives
 */
export function _useElementHover() {
  const element = inject(ElementRef).nativeElement as HTMLElement;
  const windowRef = inject(DOCUMENT).defaultView;

  return (options: UseElementHoverOptions = {}) => {
    return elementHover(element, windowRef, options);
  };
}
