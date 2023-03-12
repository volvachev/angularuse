import { ElementRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, of } from 'rxjs';
import { debounceTime as debounceTimeOperator } from 'rxjs/internal/operators/debounceTime';
import { WindowRef } from '../types';

export interface UseMutationObserverOptions extends MutationObserverInit {
  target?: HTMLElement;
  debounceTime?: number;
}

export function mutationObserver(
  target: HTMLElement,
  windowRef: WindowRef,
  options: UseMutationObserverOptions = {}
): Observable<MutationRecord[] | null> {
  if (!windowRef || !('MutationObserver' in windowRef)) {
    return of(null);
  }

  return new Observable<MutationRecord[]>(subscriber => {
    const mutationObserver = new windowRef.MutationObserver(entries => {
      subscriber.next(entries);
    });

    mutationObserver.observe(target, options);

    return () => {
      mutationObserver.disconnect();
    };
  }).pipe(debounceTimeOperator(options?.debounceTime ?? 0));
}

/*
 * internal realisation for reuse inside directives
 */
export function _useMutationObserver() {
  const target = inject(ElementRef).nativeElement;
  const windowRef = inject(DOCUMENT)?.defaultView;

  return (options: UseMutationObserverOptions = {}): Observable<MutationRecord[] | null> => {
    return mutationObserver(options?.target ?? target, windowRef, options);
  };
}
