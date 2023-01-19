import { MonoTypeOperatorFunction, ReplaySubject, takeUntil } from 'rxjs';
import { ChangeDetectorRef, inject, InjectionToken, ViewRef } from '@angular/core';

export function useUntilDestroy<T>(): MonoTypeOperatorFunction<T> {
  const replaySubject = new ReplaySubject<null>();
  const viewRef = inject(ChangeDetectorRef) as ViewRef;

  viewRef.onDestroy(() => {
    replaySubject.next(null);
    replaySubject.complete();
  });

  return takeUntil(replaySubject.asObservable());
}

const unknownUntilDestroy = useUntilDestroy<unknown>;

/*
 * experimental
 */
export const UNTIL_DESTROY = new InjectionToken('use until destroy', {
  factory: unknownUntilDestroy
});
