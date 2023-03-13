import { debounceTime as debounceTimeOperator, filter, finalize, map, Observable, of, Subject } from 'rxjs';
import { WindowRef } from '../types';

export type UseResizeObserverFunction = (options?: UseResizeObserverOptions) => Observable<ResizeObserverEntry[]>;

export interface UseResizeObserverOptions {
  resizeObserverOptions?: ResizeObserverOptions;
  debounceTime?: number;
}

// internal stream for sharing a single resizeObserver instance
const streamResizeObserver = new Subject<ResizeObserverEntry[]>();

let internalResizeObserver!: ResizeObserver;

function createResizeObserver(windowRef: Window & typeof globalThis): void {
  if (internalResizeObserver) {
    return;
  }

  internalResizeObserver = new windowRef.ResizeObserver(entries => {
    streamResizeObserver.next(entries);
  });
}

export function resizeObserver(
  windowRef: WindowRef,
  target: HTMLElement,
  options: UseResizeObserverOptions = {}
): Observable<ResizeObserverEntry[]> {
  if (!windowRef || !('ResizeObserver' in windowRef)) {
    return of([]);
  }

  createResizeObserver(windowRef);

  internalResizeObserver.observe(target, options?.resizeObserverOptions);

  return streamResizeObserver.asObservable().pipe(
    map(entries => entries.filter(entry => entry.target === target)),
    filter(entries => entries.length > 0),
    debounceTimeOperator(options?.debounceTime ?? 0),
    finalize(() => {
      internalResizeObserver.unobserve(target);
    })
  );
}
