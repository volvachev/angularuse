import { MonoTypeOperatorFunction, ReplaySubject, takeUntil } from 'rxjs';
import { ChangeDetectorRef, inject, InjectionToken, ViewRef } from '@angular/core';

export function useUntilDestroy<T>(): MonoTypeOperatorFunction<T> {
  const replaySubject = new ReplaySubject<null>();
  const viewRef = inject(ChangeDetectorRef) as ViewRef;

  // Fixing a problem when a hook onDestroy throws an error (https://github.com/angular/angular/issues/46119)
  queueMicrotask(() => {
    viewRef.onDestroy(() => {
      replaySubject.next(null);
      replaySubject.complete();
    });
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
