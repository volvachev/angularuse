import { WindowRef } from '../types';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { _useOnDestroy } from '../../shared/utils/_on-destroy';
import { performanceObserver, UsePerformanceObserverOptions } from './internal';

export function usePerformanceObserver(options: UsePerformanceObserverOptions) {
  const windowRef: WindowRef = inject(DOCUMENT).defaultView;
  const destroy = _useOnDestroy();

  return performanceObserver(windowRef, destroy, options);
}
