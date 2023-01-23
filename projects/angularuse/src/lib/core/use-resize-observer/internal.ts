import { Observable } from 'rxjs';
import { ElementRef, inject } from '@angular/core';

type UseResizeObserverFunction = (options?: ResizeObserverOptions) => Observable<ResizeObserverEntry[]>;

export function resizeObserver(
  target: HTMLElement,
  options: ResizeObserverOptions = {}
): Observable<ResizeObserverEntry[]> {
  return new Observable<ResizeObserverEntry[]>(subscriber => {
    const ro = new ResizeObserver(entries => {
      subscriber.next(entries);
    });

    ro.observe(target, options);

    return function unsubscribe(): void {
      ro.disconnect();
    };
  });
}

/*
 * internal realisation for reuse inside directives
 */
export function _useResizeObserver(): UseResizeObserverFunction {
  const target = inject(ElementRef).nativeElement as HTMLElement;

  return function useResizeObserver(options: ResizeObserverOptions = {}): Observable<ResizeObserverEntry[]> {
    return resizeObserver(target, options);
  };
}
