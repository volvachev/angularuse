import { MonoTypeOperatorFunction, ReplaySubject, takeUntil } from 'rxjs';
import { ViewRef } from '@angular/core';

export function untilDestroy<T>(viewRef: ViewRef): MonoTypeOperatorFunction<T> {
  const replaySubject = new ReplaySubject<null>();

  // Fixing a problem when a hook onDestroy throws an error (https://github.com/angular/angular/issues/46119)
  queueMicrotask(() => {
    viewRef.onDestroy(() => {
      replaySubject.next(null);
      replaySubject.complete();
    });
  });

  return takeUntil(replaySubject.asObservable());
}
