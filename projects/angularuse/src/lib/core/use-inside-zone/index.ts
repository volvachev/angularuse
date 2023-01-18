import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { inject, InjectionToken, NgZone } from '@angular/core';

export function insideZone<T>(ngZone: NgZone): MonoTypeOperatorFunction<T> {
  return source =>
    new Observable(subscriber =>
      source.subscribe({
        next: value => ngZone.run(() => subscriber.next(value)),
        error: error => ngZone.run(() => subscriber.error(error)),
        complete: () => ngZone.run(() => subscriber.complete()),
      })
    );
}

export function useInsideZone<T>(): MonoTypeOperatorFunction<T> {
  const zone: NgZone = inject(NgZone);
  return insideZone(zone);
}

const unknownInsideZone = useInsideZone<unknown>;

/*
 * experimental
 */
export const INSIDE_ZONE = new InjectionToken<MonoTypeOperatorFunction<unknown>>('use inside zone', {
  factory: unknownInsideZone,
});
