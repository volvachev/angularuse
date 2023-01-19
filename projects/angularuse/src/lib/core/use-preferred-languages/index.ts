import { fromEvent, map, Observable, of } from 'rxjs';
import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { consistentQueue } from '../../shared/utils/consistent-queue';

export function usePreferredLanguages(): Observable<ReadonlyArray<string>> {
  const window: (Window & typeof globalThis) | null = inject(DOCUMENT).defaultView;

  if (!window) {
    return of(['en']);
  }

  const navigator = window.navigator;
  const getLanguages = (): ReadonlyArray<string> => navigator.languages;

  return consistentQueue(getLanguages, fromEvent(window, 'languagechange').pipe(map(getLanguages)));
}

export const PREFERRED_LANGUAGES = new InjectionToken('Reactive Navigator Languages', {
  factory: usePreferredLanguages
});
