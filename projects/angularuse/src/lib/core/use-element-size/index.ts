import { ElementRef, inject, InjectionToken } from '@angular/core';
import { useResizeObserver } from '../use-resize-observer';
import { Observable } from 'rxjs';
import { elementSize } from './internal';

export interface ElementSize {
  width: number;
  height: number;
}

export function useElementSize(
  initialSize: ElementSize = { width: 0, height: 0 },
  options: ResizeObserverOptions = {}
): Observable<ElementSize> {
  const element = inject(ElementRef).nativeElement as HTMLElement;

  return elementSize(element, useResizeObserver, initialSize, options);
}

export const ELEMENT_SIZE = new InjectionToken<Observable<ElementSize>>('Reactive size of an HTML element', {
  factory: useElementSize
});
