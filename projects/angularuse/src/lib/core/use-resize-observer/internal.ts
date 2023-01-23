import { debounceTime as debounceTimeOperator, Observable } from 'rxjs';
import { ElementRef, inject } from '@angular/core';

type UseResizeObserverFunction = (options?: UseResizeObserverOptions) => Observable<ResizeObserverEntry[]>;

export interface UseResizeObserverOptions {
  resizeObserverOptions?: ResizeObserverOptions;
  debounceTime?: number;
}

export function resizeObserver(
  target: HTMLElement,
  options: UseResizeObserverOptions = {}
): Observable<ResizeObserverEntry[]> {
  return new Observable<ResizeObserverEntry[]>(subscriber => {
    const ro = new ResizeObserver(entries => {
      subscriber.next(entries);
    });

    ro.observe(target, options?.resizeObserverOptions);

    return function unsubscribe(): void {
      ro.disconnect();
    };
  }).pipe(debounceTimeOperator(options?.debounceTime ?? 0));
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
