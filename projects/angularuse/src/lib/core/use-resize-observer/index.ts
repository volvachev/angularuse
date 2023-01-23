import { ElementRef, inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { resizeObserver, UseResizeObserverOptions } from './internal';

export function useResizeObserver(options: UseResizeObserverOptions = {}): Observable<ResizeObserverEntry[]> {
  const target = inject(ElementRef).nativeElement as HTMLElement;

  return resizeObserver(target, options);
}

export const RESIZE_OBSERVER = new InjectionToken<Observable<ResizeObserverEntry[]>>(
  'Reactive changes of dimensions the Element',
  {
    factory: useResizeObserver
  }
);
