import { Observable, of, debounceTime as debounceTimeOperator } from 'rxjs';
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
