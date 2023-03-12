import { ElementRef, inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { intersectionObserver, UseIntersectionObserverOptions } from './internal';
import { DOCUMENT } from '@angular/common';
import { WindowRef } from '../types';

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): Observable<IntersectionObserverEntry[]> {
  const target = inject(ElementRef).nativeElement as HTMLElement;
  const window: WindowRef = inject(DOCUMENT).defaultView;

  return intersectionObserver(window, target, options);
}

export const INTERSECTION_OBSERVER = new InjectionToken<Observable<IntersectionObserverEntry[]>>(
  "Detects that a target element's visibility.",
  {
    factory: useIntersectionObserver
  }
);

export { UseIntersectionObserverOptions } from './internal';
