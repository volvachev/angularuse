import { ElementRef, inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { UseTextDirectionValue, textDirection, UseTextDirectionOptions, getSelector } from './internal';
import { DOCUMENT } from '@angular/common';
import { useMutationObserver } from '../use-mutation-observer';

export function useTextDirection(options: UseTextDirectionOptions = {}): Observable<UseTextDirectionValue> {
  const documentRef = inject(DOCUMENT);
  const element = inject(ElementRef, { optional: true });
  const isSelf = options?.selector === 'self';
  let selector = options?.selector;

  if (isSelf && element) {
    selector = element.nativeElement;
  } else if (isSelf && !element) {
    selector = 'html';
  }

  const mutation$ = useMutationObserver({
    target: getSelector(documentRef, selector) as HTMLElement,
    attributes: true
  });

  return textDirection(documentRef, mutation$, {
    ...options,
    selector
  });
}

export const TEXT_DIRECTION = new InjectionToken<Observable<UseTextDirectionValue>>(
  "Reactive dir of the element's text.",
  {
    factory: useTextDirection
  }
);

export { UseTextDirectionValue, UseTextDirectionOptions } from './internal';
