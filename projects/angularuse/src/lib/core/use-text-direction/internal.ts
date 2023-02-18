import { ElementRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { consistentQueue } from '../../shared/utils/consistent-queue';
import { defer, EMPTY, iif, map, Observable } from 'rxjs';
import { isString } from '../../shared/utils/is-string';
import { _useMutationObserver } from '../use-mutation-observer/internal';

export type UseTextDirectionValue = 'ltr' | 'rtl' | 'auto';

export interface UseTextDirectionOptions {
  /**
   * CSS Selector for the target element applying to
   *
   * @default 'html'
   */
  selector?: string | HTMLElement;
  /**
   * Observe `document.querySelector(selector)` changes using MutationObserve
   *
   * @default false
   */
  observe?: boolean;
  /**
   * Initial value
   *
   * @default 'ltr'
   */
  initialValue?: UseTextDirectionValue;
}

export function getSelector(documentRef: Document, selector: UseTextDirectionOptions['selector']): Element | null {
  if (!selector) {
    return null;
  }

  if (isString(selector)) {
    return documentRef?.querySelector(selector);
  }

  return selector;
}

export function textDirection(
  document: Document,
  mutatation$: Observable<MutationRecord[] | null>,
  options: UseTextDirectionOptions = {}
): Observable<UseTextDirectionValue> {
  const { selector = 'html', observe = false, initialValue = 'ltr' } = options;

  function getValue() {
    return (getSelector(document, selector)?.getAttribute('dir') as UseTextDirectionValue) ?? initialValue;
  }

  return consistentQueue(
    () => null,
    defer(() => iif(() => Boolean(observe) && Boolean(document), mutatation$, EMPTY))
  ).pipe(map(() => getValue()));
}

/*
 * internal realisation for reuse inside directives
 */
export function _useTextDirection() {
  const document = inject(DOCUMENT);
  const element = inject(ElementRef, { optional: true });
  const mutation = _useMutationObserver();

  return (options: UseTextDirectionOptions = {}, self?: boolean) => {
    const selector = self && element ? element.nativeElement : options?.selector;
    const mutation$ = mutation({
      target: getSelector(document, selector) as HTMLElement,
      attributes: true
    });

    return textDirection(document, mutation$, {
      ...options,
      selector
    });
  };
}
