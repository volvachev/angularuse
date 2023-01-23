import { ElementRef, inject, InjectionToken } from '@angular/core';
import { useResizeObserver } from '../use-resize-observer';
import { Observable } from 'rxjs';
import { ElementSize, elementSize } from './internal';
import { UseResizeObserverOptions } from '../use-resize-observer/internal';

export function useElementSize(
  initialSize: ElementSize = { width: 0, height: 0 },
  options: UseResizeObserverOptions = {}
): Observable<ElementSize> {
  const element = inject(ElementRef).nativeElement as HTMLElement;

  return elementSize(element, useResizeObserver, initialSize, options);
}

export const ELEMENT_SIZE = new InjectionToken<Observable<ElementSize>>('Reactive size of an HTML element', {
  factory: useElementSize
});

export { ElementSize } from './internal';
