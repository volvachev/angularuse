import { WindowRef } from '../types';
import { DestroyCallback } from '../../shared/utils/_on-destroy';
import { signal } from '@angular/core';

export type UsePerformanceObserverOptions = PerformanceObserverInit & {
  /**
   * Start the observer immediate.
   *
   * @default true
   */
  immediate?: boolean;
};

export interface PerformanceSignalType {
  entries: PerformanceObserverEntryList;
  observer: PerformanceObserver;
}

export type PerformanceSignal = PerformanceSignalType | null;

export function performanceObserver(
  windowRef: WindowRef,
  destroyFn: DestroyCallback,
  options: UsePerformanceObserverOptions
) {
  const { immediate = true, ...performanceOptions } = options;

  const isSupported = Boolean(windowRef && 'PerformanceObserver' in windowRef);

  let observer: PerformanceObserver | undefined;

  const performanceSignal = signal<PerformanceSignal>(null);

  const stop = () => {
    observer?.disconnect();
  };

  const start = () => {
    if (!isSupported) {
      return;
    }

    stop();
    observer = new PerformanceObserver((entries: PerformanceObserverEntryList, observer: PerformanceObserver) => {
      performanceSignal.set({ entries, observer });
    });
    observer.observe(performanceOptions);
  };

  destroyFn(stop);

  if (immediate) {
    start();
  }

  return {
    isSupported,
    performanceSignal,
    start,
    stop
  };
}
