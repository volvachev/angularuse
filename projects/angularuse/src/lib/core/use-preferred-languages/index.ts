import { concat, defer, fromEvent, map, Observable, of } from 'rxjs';
import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export function usePreferredLanguages(): Observable<ReadonlyArray<string>> {
  const window: (Window & typeof globalThis) | null = inject(DOCUMENT).defaultView;

  if (!window) {
    return of(['en']);
  }

  const navigator = window.navigator;

  return concat(
    defer(() => of(navigator.languages)),
    fromEvent(window, 'languagechange').pipe(map(() => navigator.languages))
  );
}

export const PREFERRED_LANGUAGES = new InjectionToken('Reactive Navigator Languages', {
  factory: usePreferredLanguages
});
