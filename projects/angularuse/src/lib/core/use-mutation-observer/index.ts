import { ElementRef, inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { mutationObserver, UseMutationObserverOptions } from './internal';
import { DOCUMENT } from '@angular/common';

export function useMutationObserver(options: UseMutationObserverOptions = {}): Observable<MutationRecord[] | null> {
  const target = inject(ElementRef).nativeElement as HTMLElement;
  const windowRef = inject(DOCUMENT)?.defaultView;

  return mutationObserver(options?.target ?? target, windowRef, options);
}

export const MUTATION_OBSERVER = new InjectionToken<Observable<MutationRecord[] | null>>(
  'Watch for changes being made to the DOM tree.',
  {
    factory: useMutationObserver
  }
);

export { UseMutationObserverOptions } from './internal';
