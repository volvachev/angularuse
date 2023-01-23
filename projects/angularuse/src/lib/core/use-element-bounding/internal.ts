import { debounceTime, defer, EMPTY, fromEvent, iif, map, merge, Observable } from 'rxjs';
import { ElementRef, inject } from '@angular/core';
import { consistentQueue } from '../../shared/utils/consistent-queue';
import { _useResizeObserver, UseResizeObserverOptions } from '../use-resize-observer/internal';

type UseElementBoundingFunction = (options?: UseElementBoundingOptions) => Observable<UseElementBounding>;

export interface UseElementBoundingOptions {
  /**
   * settings for resize observer
   *
   * @default { box: 'border-box' }
   */
  resizeOptions?: UseResizeObserverOptions;
  /**
   * Listen to window resize event
   *
   * @default true
   */
  windowResize?: boolean;
  /**
   * debounceTime value fore resize event
   *
   * @default 0
   */
  windowResizeDebounceTime?: number;
  /**
   * Listen to window scroll event
   *
   * @default true
   */
  windowScroll?: boolean;
  /**
   * debounceTime value fore scroll event
   *
   * @default 0
   */
  windowScrollDebounceTime?: number;
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

export function elementBounding(
  element: HTMLElement,
  useResizeObserver: ReturnType<typeof _useResizeObserver>,
  options: UseElementBoundingOptions = {}
): Observable<UseElementBounding> {
  const {
    windowResize = true,
    windowScroll = true,
    windowResizeDebounceTime = 0,
    windowScrollDebounceTime = 0
  } = options;
  const resizeStream$ = useResizeObserver(options?.resizeOptions);
  const windowScroll$ = defer(() =>
    iif(
      () => windowScroll,
      fromEvent(window, 'scroll', { capture: true, passive: true }).pipe(debounceTime(windowScrollDebounceTime)),
      EMPTY
    )
  );
  const windowResize$ = defer(() =>
    iif(
      () => windowResize,
      fromEvent(window, 'resize', { passive: true }).pipe(debounceTime(windowResizeDebounceTime)),
      EMPTY
    )
  );

  return consistentQueue(() => null, merge(resizeStream$, windowScroll$, windowResize$)).pipe(
    map(() => update(element))
  );
}

/*
 * internal realisation for reuse inside directives
 */
export function _useElementBounding(): UseElementBoundingFunction {
  const element = inject(ElementRef).nativeElement as HTMLElement;
  const useResizeObserver = _useResizeObserver();

  return (options: UseElementBoundingOptions = {}): Observable<UseElementBounding> =>
    elementBounding(element, useResizeObserver, options);
}
