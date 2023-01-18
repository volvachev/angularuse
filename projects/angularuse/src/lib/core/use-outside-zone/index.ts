import { Observable } from 'rxjs';
import { inject, InjectionToken, NgZone } from '@angular/core';

type OutsideZoneType<T> = (source: Observable<T>) => Observable<T>;
export function outsideZone<T>(zone: NgZone): OutsideZoneType<T> {
  return source => new Observable(subscriber => zone.runOutsideAngular(() => source.subscribe(subscriber)));
}

export function useOutsideZone<T>(): OutsideZoneType<T> {
  const zone: NgZone = inject(NgZone);
  return outsideZone(zone);
}

const unknownOutsideZone = useOutsideZone<unknown>;

/*
 * experimental
 */
export const OUTSIDE_ZONE = new InjectionToken<OutsideZoneType<unknown>>('use outside zone', {
  factory: unknownOutsideZone,
});
