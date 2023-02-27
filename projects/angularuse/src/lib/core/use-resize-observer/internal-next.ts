import { computed, ElementRef, inject, Signal, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { useOnDestroy } from '../use-until-destroy/internal';

export interface UseResizeObserverOptions {
  resizeObserverOptions?: ResizeObserverOptions;
  debounceTime?: number;
}

// internal signal for sharing a single resizeObserver instance
const resizeSignal = signal<ResizeObserverEntry[]>([]);

let internalResizeObserver!: ResizeObserver;

function createResizeObserver(windowRef: Window & typeof globalThis): void {
  if (internalResizeObserver) {
    return;
  }

  internalResizeObserver = new windowRef.ResizeObserver(entries => {
    resizeSignal.set(entries);
  });
}

export function resizeObserverNext(
  windowRef: (Window & typeof globalThis) | null,
  target: HTMLElement,
  // eslint-disable-next-line @typescript-eslint/ban-types
  destroyHook: (cb: Function) => void,
  options: UseResizeObserverOptions = {}
): Signal<ResizeObserverEntry[]> {
  if (!windowRef || !('ResizeObserver' in windowRef)) {
    return signal<ResizeObserverEntry[]>([]);
  }

  createResizeObserver(windowRef);

  internalResizeObserver.observe(target, options?.resizeObserverOptions);

  const calculatedSignal = computed<ResizeObserverEntry[]>(() => {
    const resize = resizeSignal();

    return resize.filter(entry => entry.target === target);
  });

  destroyHook(() => {
    internalResizeObserver.unobserve(target);
  });

  return calculatedSignal;
}

/*
 * internal realisation for reuse inside directives
 */
export function _useResizeObserverNext() {
  const target = inject(ElementRef).nativeElement as HTMLElement;
  const windowRef: (Window & typeof globalThis) | null = inject(DOCUMENT).defaultView;
  const destroy = useOnDestroy();

  return function useResizeObserver(options: UseResizeObserverOptions = {}): Signal<ResizeObserverEntry[]> {
    return resizeObserverNext(windowRef, target, destroy, options);
  };
}
