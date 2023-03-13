import { debounceTime as debounceTimeOperator, fromEvent, map, Observable, of } from 'rxjs';
import { consistentQueue } from '../../shared/utils/consistent-queue';
import { WindowRef } from '../types';

export interface UseElementVisibilityOptions {
  scrollTarget?: HTMLElement | null;
  debounceTime?: number;
}

interface ElementVisibilitySettings {
  element: HTMLElement;
  document: Document;
  window: WindowRef;
}

const testBounding = (settings: ElementVisibilitySettings) => (): boolean => {
  const { element, document, window } = settings;

  if (!element || !window) {
    return false;
  }

  const { documentElement } = document;

  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || documentElement.clientHeight) &&
    rect.left <= (window.innerWidth || documentElement.clientWidth) &&
    rect.bottom >= 0 &&
    rect.right >= 0
  );
};

export function elementVisibility(
  settings: ElementVisibilitySettings,
  { scrollTarget, debounceTime }: UseElementVisibilityOptions = {}
): Observable<boolean> {
  const { window } = settings;

  if (!window) {
    return of(false);
  }

  const testElementBounding = testBounding(settings);

  return consistentQueue(
    testElementBounding,
    fromEvent(scrollTarget || window, 'scroll', {
      capture: false,
      passive: true
    }).pipe(map(testElementBounding), debounceTimeOperator(debounceTime ?? 0))
  );
}
