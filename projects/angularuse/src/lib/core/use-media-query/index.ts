import { fromEvent, map, Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { consistentQueue } from '../../shared/utils/consistent-queue';

const getMatches = (mediaQuery: Pick<MediaQueryList, 'matches'>): boolean => mediaQuery.matches;
const getMediaQuery = (mediaQuery: MediaQueryList) => (): boolean => getMatches(mediaQuery);

export function useMediaQuery(query: string): Observable<boolean> {
  const window: (Window & typeof globalThis) | null = inject(DOCUMENT).defaultView;

  if (!window || !('matchMedia' in window) || typeof window.matchMedia !== 'function') {
    return of(false);
  }

  const mediaQuery = window!.matchMedia(query);

  return consistentQueue(
    getMediaQuery(mediaQuery),
    fromEvent(mediaQuery, 'change').pipe(map(event => getMatches(event as MediaQueryListEvent)))
  );
}
