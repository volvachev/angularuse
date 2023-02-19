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

/*
 * experimental realization
 */
export function _useOutsideZone() {
  const zone: NgZone = inject(NgZone);
  return <T>(): OutsideZoneType<T> => outsideZone<T>(zone);
}

/*
 * experimental
 */
export const OUTSIDE_ZONE = new InjectionToken<<T>() => OutsideZoneType<T>>('use outside zone', {
  factory: _useOutsideZone
});
