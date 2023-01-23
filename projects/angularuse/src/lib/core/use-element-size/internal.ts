import { map, mergeMap, Observable } from 'rxjs';
import { ElementRef, inject } from '@angular/core';
import { consistentQueue } from '../../shared/utils/consistent-queue';
import { _useResizeObserver, UseResizeObserverOptions } from '../use-resize-observer/internal';

export interface ElementSize {
  width: number;
  height: number;
}

type UseElementSizeFunction = (
  initialSize?: ElementSize,
  options?: UseResizeObserverOptions
) => Observable<ElementSize>;

export function elementSize(
  element: HTMLElement,
  useResizeObserver: ReturnType<typeof _useResizeObserver>,
  initialSize: ElementSize = { width: 0, height: 0 },
  options: UseResizeObserverOptions = {}
): Observable<ElementSize> {
  const { box = 'content-box' } = options?.resizeObserverOptions ?? {};
  const resize$ = useResizeObserver({
    resizeObserverOptions: {
      box
    },
    debounceTime: options?.debounceTime
  }).pipe(
    mergeMap((entry: ResizeObserverEntry[]) => entry),
    map(({ contentBoxSize, borderBoxSize, devicePixelContentBoxSize, contentRect }: ResizeObserverEntry) => {
      const boxSize =
        box === 'border-box' ? borderBoxSize : box === 'content-box' ? contentBoxSize : devicePixelContentBoxSize;

      if (boxSize) {
        return {
          width: boxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0),
          height: boxSize.reduce((acc, { blockSize }) => acc + blockSize, 0)
        };
      }

      return {
        width: contentRect.width,
        height: contentRect.height
      };
    })
  );

  return consistentQueue(
    () => ({
      width: element ? initialSize.width : 0,
      height: element ? initialSize.height : 0
    }),
    resize$
  );
}

/*
 * internal realisation for reuse inside directives
 */
export function _useElementSize(): UseElementSizeFunction {
  const element = inject(ElementRef).nativeElement as HTMLElement;
  const useResizeObserver = _useResizeObserver();

  return (
    initialSize: ElementSize = { width: 0, height: 0 },
    options: UseResizeObserverOptions = {}
  ): Observable<ElementSize> => {
    return elementSize(element, useResizeObserver, initialSize, options);
  };
}
