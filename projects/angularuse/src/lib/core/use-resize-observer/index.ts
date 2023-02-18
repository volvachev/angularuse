import { ElementRef, inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { resizeObserver, UseResizeObserverOptions } from './internal';
import { DOCUMENT } from '@angular/common';

export function useResizeObserver(options: UseResizeObserverOptions = {}): Observable<ResizeObserverEntry[]> {
  const target = inject(ElementRef).nativeElement as HTMLElement;
  const windowRef: (Window & typeof globalThis) | null = inject(DOCUMENT).defaultView;

  return resizeObserver(windowRef, target, options);
}

export const RESIZE_OBSERVER = new InjectionToken<Observable<ResizeObserverEntry[]>>(
  'Reactive changes of dimensions the Element',
  {
    factory: useResizeObserver
  }
);

export { UseResizeObserverOptions } from './internal';
