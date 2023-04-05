import { MonoTypeOperatorFunction } from 'rxjs';
import { inject, InjectOptions, InjectionToken, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export function useUntilDestroy(options?: InjectOptions): <T>() => MonoTypeOperatorFunction<T> {
  const destroyRef = options ? inject(DestroyRef, options) : inject(DestroyRef);

  return <T>(): MonoTypeOperatorFunction<T> => takeUntilDestroyed<T>(destroyRef!);
}

export const UNTIL_DESTROY = new InjectionToken('use until destroy', {
  factory: useUntilDestroy
});
