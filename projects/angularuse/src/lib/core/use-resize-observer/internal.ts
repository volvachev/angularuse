import { debounceTime as debounceTimeOperator, filter, finalize, map, Observable, Subject } from 'rxjs';
import { ElementRef, inject } from '@angular/core';

type UseResizeObserverFunction = (options?: UseResizeObserverOptions) => Observable<ResizeObserverEntry[]>;

export interface UseResizeObserverOptions {
  resizeObserverOptions?: ResizeObserverOptions;
  debounceTime?: number;
}

// internal stream for sharing a single resizeObserver instance
const streamResizeObserver = new Subject<ResizeObserverEntry[]>();

const internalResizeObserver = new ResizeObserver(entries => {
  streamResizeObserver.next(entries);
});

export function resizeObserver(
  target: HTMLElement,
  options: UseResizeObserverOptions = {}
): Observable<ResizeObserverEntry[]> {
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

/*
 * internal realisation for reuse inside directives
 */
export function _useResizeObserver(): UseResizeObserverFunction {
  const target = inject(ElementRef).nativeElement as HTMLElement;

  return function useResizeObserver(options: UseResizeObserverOptions = {}): Observable<ResizeObserverEntry[]> {
    return resizeObserver(target, options);
  };
}
