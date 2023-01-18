import { ElementRef, inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export function useResizeObserver(options: ResizeObserverOptions = {}): Observable<ResizeObserverEntry[]> {
  const target = inject(ElementRef).nativeElement as HTMLElement;

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

export const RESIZE_OBSERVER = new InjectionToken<Observable<ResizeObserverEntry[]>>(
  'Reactive changes of dimensions the Element',
  {
    factory: useResizeObserver,
  }
);
