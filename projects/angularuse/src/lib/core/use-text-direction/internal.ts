import { consistentQueue } from '../../shared/utils/consistent-queue';
import { defer, EMPTY, iif, map, Observable } from 'rxjs';
import { isString } from '../../shared/utils/is-string';

export type UseTextDirectionValue = 'ltr' | 'rtl' | 'auto';

export interface UseTextDirectionOptions {
  /**
   * CSS Selector for the target element applying to
   *
   * @default 'html'
   */
  selector?: string | HTMLElement | 'self';
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
  if (!selector || selector === 'self') {
    return null;
  }

  if (isString(selector)) {
    return documentRef?.querySelector(selector);
  }

  return selector;
}

export function textDirection(
  document: Document,
  mutation$: Observable<MutationRecord[] | null>,
  options: UseTextDirectionOptions = {}
): Observable<UseTextDirectionValue> {
  const { selector = 'html', observe = false, initialValue = 'ltr' } = options;

  function getValue() {
    return (getSelector(document, selector)?.getAttribute('dir') as UseTextDirectionValue) ?? initialValue;
  }

  return consistentQueue(
    () => null,
    defer(() => iif(() => Boolean(observe) && Boolean(document), mutation$, EMPTY))
  ).pipe(map(() => getValue()));
}
