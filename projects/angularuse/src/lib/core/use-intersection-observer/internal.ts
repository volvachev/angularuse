import { Observable, of, debounceTime as debounceTimeOperator } from 'rxjs';
import { ElementRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface UseIntersectionObserverOptions {
  /**
   * The Element or Document whose bounds are used as the bounding box when testing for intersection.
   */
  root?: HTMLElement;

  /**
   * A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections.
   */
  rootMargin?: string;

  /**
   * Either a single number or an array of numbers between 0.0 and 1.
   */
  threshold?: number | number[];

  debounceTime?: number;
}

export function intersectionObserver(
  windowRef: (Window & typeof globalThis) | null,
  target: HTMLElement,
  options: UseIntersectionObserverOptions
): Observable<IntersectionObserverEntry[]> {
  if (!windowRef || !('IntersectionObserver' in windowRef)) {
    return of([]);
  }

  const { root, rootMargin = '0px', threshold = 0.1 } = options;

  return new Observable<IntersectionObserverEntry[]>(observer => {
    const intersectionObserver = new IntersectionObserver(
      entries => {
        observer.next(entries);
      },
      {
        threshold,
        root,
        rootMargin
      }
    );
    intersectionObserver.observe(target);

    return () => {
      intersectionObserver.disconnect();
    };
  }).pipe(debounceTimeOperator(options?.debounceTime ?? 0));
}

/*
 * internal realisation for reuse inside directives
 */
export function _useIntersectionObserver() {
  const target = inject(ElementRef).nativeElement as HTMLElement;
  const window: (Window & typeof globalThis) | null = inject(DOCUMENT).defaultView;

  return (options: UseIntersectionObserverOptions = {}): Observable<IntersectionObserverEntry[]> => {
    return intersectionObserver(window, target, options);
  };
}
