import { concat, defer, fromEvent, map, Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export function useMediaQuery(query: string): Observable<boolean> {
  const window: (Window & typeof globalThis) | null = inject(DOCUMENT).defaultView;

  if (!window || !('matchMedia' in window) || typeof window.matchMedia !== 'function') {
    return of(false);
  }

  const mediaQuery = window!.matchMedia(query);

  return concat(
    defer(() => of(mediaQuery.matches)),
    fromEvent(mediaQuery, 'change').pipe(map(event => (event as MediaQueryListEvent).matches))
  );
}
