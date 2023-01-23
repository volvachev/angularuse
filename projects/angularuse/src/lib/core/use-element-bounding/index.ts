import { ElementRef, inject, InjectionToken } from '@angular/core';
import { useResizeObserver } from '../use-resize-observer';
import { Observable } from 'rxjs';
import { elementBounding, UseElementBounding, UseElementBoundingOptions } from './internal';

export function useElementBounding(options: UseElementBoundingOptions = {}): Observable<UseElementBounding> {
  const element = inject(ElementRef).nativeElement as HTMLElement;

  return elementBounding(element, useResizeObserver, options);
}

export const ELEMENT_BOUNDING = new InjectionToken<Observable<UseElementBounding>>(
  'Reactive bounding box of an HTML element',
  {
    factory: useElementBounding
  }
);

export { UseElementBounding } from './internal';
export { UseElementBoundingOptions } from './internal';
