import { map, Observable } from 'rxjs';
import { ElementRef, inject, InjectionToken } from '@angular/core';
import { useActiveElement } from '../use-active-element';

export function useFocus(): Observable<boolean> {
  const targetElement = inject(ElementRef).nativeElement as Element;

  return useActiveElement().pipe(map((element: Element | null) => element === targetElement));
}

export const IS_FOCUSED = new InjectionToken<Observable<boolean>>('Track the focus state of a DOM element.', {
  factory: useFocus
});
