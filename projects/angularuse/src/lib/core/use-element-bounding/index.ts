import { ElementRef, inject, InjectionToken } from '@angular/core';
import { useResizeObserver } from '../use-resize-observer';
import { consistentQueue } from '../../shared/utils/consistent-queue';
import { defer, EMPTY, fromEvent, iif, map, merge, Observable } from 'rxjs';

export interface UseElementBoundingOptions {
  /**
   * Listen to window resize event
   *
   * @default true
   */
  windowResize?: boolean;
  /**
   * Listen to window scroll event
   *
   * @default true
   */
  windowScroll?: boolean;
}

export type UseElementBounding = Omit<DOMRect, 'toJSON'>;

function update(element: HTMLElement): UseElementBounding {
  if (!element) {
    return {
      height: 0,
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0
    };
  }

  return element.getBoundingClientRect();
}

export function useElementBounding(options: UseElementBoundingOptions = {}): Observable<UseElementBounding> {
  const { windowResize = true, windowScroll = true } = options;
  const element = inject(ElementRef).nativeElement as HTMLElement;

  const resizeStream$ = useResizeObserver();
  const windowScroll$ = defer(() =>
    iif(() => windowScroll, fromEvent(window, 'scroll', { capture: true, passive: true }), EMPTY)
  );
  const windowResize$ = defer(() => iif(() => windowResize, fromEvent(window, 'resize', { passive: true }), EMPTY));

  return consistentQueue(() => null, merge(resizeStream$, windowScroll$, windowResize$)).pipe(
    map(() => update(element))
  );
}

export const ELEMENT_BOUNDING = new InjectionToken<Observable<UseElementBounding>>(
  'Reactive bounding box of an HTML element',
  {
    factory: useElementBounding
  }
);
