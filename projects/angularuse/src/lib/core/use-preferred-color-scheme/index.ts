import { useMediaQuery } from '../use-media-query';
import { combineLatest, map, Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export type ColorSchemeType = 'dark' | 'light' | 'no-preference';

export function usePreferredColorScheme(): Observable<ColorSchemeType> {
  return combineLatest([
    useMediaQuery('(prefers-color-scheme: light)'),
    useMediaQuery('(prefers-color-scheme: dark)')
  ]).pipe(
    map(([isLight, isDark]) => {
      if (isDark) {
        return 'dark';
      }

      if (isLight) {
        return 'light';
      }

      return 'no-preference';
    })
  );
}

export const COLOR_SCHEMA = new InjectionToken<Observable<ColorSchemeType>>(
  'Reactive prefers-color-scheme media query.',
  {
    factory: usePreferredColorScheme
  }
);
