import { DOCUMENT } from '@angular/common';
import { map, Observable, of, timer } from 'rxjs';
import { inject, InjectionToken } from '@angular/core';
import { WindowRef } from '../types';

export interface MemoryInfo {
  /**
   * The maximum size of the heap, in bytes, that is available to the context.
   */
  readonly jsHeapSizeLimit: number;
  /**
   *  The total allocated heap size, in bytes.
   */
  readonly totalJSHeapSize: number;
  /**
   * The currently active segment of JS heap, in bytes.
   */
  readonly usedJSHeapSize: number;

  [Symbol.toStringTag]: 'MemoryInfo';
}

export interface UseMemoryOptions {
  interval?: number;
}

type PerformanceMemory = Performance & {
  memory: MemoryInfo;
};

export function useMemory(options: UseMemoryOptions = {}): Observable<MemoryInfo | null> {
  const window: WindowRef = inject(DOCUMENT).defaultView;
  const performance = window?.performance;

  if (typeof performance === 'undefined' || !('memory' in performance)) {
    return of(null);
  }

  const interval = options.interval ?? 1000;

  return timer(0, interval).pipe(map(() => (performance as PerformanceMemory).memory));
}

export const MEMORY_INFO = new InjectionToken<Observable<MemoryInfo | null>>('Reactive Memory Info', {
  factory: useMemory
});
