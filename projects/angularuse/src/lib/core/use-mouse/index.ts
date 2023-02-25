import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { useMouseInternal, UseMouseOptions, UseMouseReturn } from './internal';
import { DOCUMENT } from '@angular/common';

export function useMouse(options: UseMouseOptions = {}): Observable<UseMouseReturn> {
  const windowRef = inject(DOCUMENT)?.defaultView;

  return useMouseInternal(windowRef, options);
}

export { UseMouseOptions, UseMouseReturn, MouseSourceType } from './internal';
