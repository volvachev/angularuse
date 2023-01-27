import { map, Observable } from 'rxjs';
import { ElementRef, inject, InjectionToken } from '@angular/core';
import { useActiveElement } from '../use-active-element';

export function useFocusWithin(): Observable<boolean> {
  const targetElement = inject(ElementRef).nativeElement as Element;

  return useActiveElement().pipe(
    map((element: Element | null) => (element && targetElement ? targetElement.contains(element) : false))
  );
}

export const IS_FOCUS_WITHIN = new InjectionToken<Observable<boolean>>(
  'Track if focus is contained within the target element',
  {
    factory: useFocusWithin
  }
);
