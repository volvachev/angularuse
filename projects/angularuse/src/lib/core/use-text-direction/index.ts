import { inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { UseTextDirectionValue, textDirection, UseTextDirectionOptions, getSelector } from './internal';
import { DOCUMENT } from '@angular/common';
import { useMutationObserver } from '../use-mutation-observer';

export function useTextDirection(options: UseTextDirectionOptions = {}): Observable<UseTextDirectionValue> {
  const documentRef = inject(DOCUMENT);
  const mutation$ = useMutationObserver({
    target: getSelector(documentRef, options?.selector) as HTMLElement,
    attributes: true
  });

  return textDirection(documentRef, mutation$, options);
}

export const TEXT_DIRECTION = new InjectionToken<Observable<UseTextDirectionValue>>(
  "Reactive dir of the element's text.",
  {
    factory: useTextDirection
  }
);

export { UseTextDirectionValue, UseTextDirectionOptions } from './internal';
