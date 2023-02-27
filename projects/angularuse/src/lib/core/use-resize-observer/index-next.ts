import { ElementRef, inject, InjectionToken, Signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { resizeObserverNext, UseResizeObserverOptions } from './internal-next';
import { useOnDestroy } from '../use-until-destroy/internal';

export function useResizeObserveNext(options: UseResizeObserverOptions = {}): Signal<ResizeObserverEntry[]> {
  const target = inject(ElementRef).nativeElement as HTMLElement;
  const windowRef: (Window & typeof globalThis) | null = inject(DOCUMENT).defaultView;
  const destroy = useOnDestroy();

  return resizeObserverNext(windowRef, target, destroy, options);
}

export const RESIZE_OBSERVER_NEXT = new InjectionToken<Signal<ResizeObserverEntry[]>>(
  'Reactive changes of dimensions the Element',
  {
    factory: useResizeObserveNext
  }
);

export { UseResizeObserverOptions } from './internal';
