import { map, mergeMap, Observable } from 'rxjs';
import { consistentQueue } from '../../shared/utils/consistent-queue';
import { UseResizeObserverFunction, UseResizeObserverOptions } from '../use-resize-observer/internal';

export interface ElementSize {
  width: number;
  height: number;
}

export function elementSize(
  element: HTMLElement,
  useResizeObserver: UseResizeObserverFunction,
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
