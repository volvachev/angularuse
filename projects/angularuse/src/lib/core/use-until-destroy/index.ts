import { MonoTypeOperatorFunction } from 'rxjs';
import { ChangeDetectorRef, inject, InjectOptions, InjectionToken, ViewRef } from '@angular/core';
import { untilDestroy } from './internal';

export function useUntilDestroy(options?: InjectOptions): <T>() => MonoTypeOperatorFunction<T> {
  const viewRef = (options ? inject(ChangeDetectorRef, options) : inject(ChangeDetectorRef)) as ViewRef;

  return <T>(): MonoTypeOperatorFunction<T> => untilDestroy<T>(viewRef);
}

/*
 * old realization @deprecated
 */
export function useUntilDestroyOld<T>(): MonoTypeOperatorFunction<T> {
  const viewRef = inject(ChangeDetectorRef) as ViewRef;

  return untilDestroy<T>(viewRef);
}

export const UNTIL_DESTROY = new InjectionToken('use until destroy', {
  factory: useUntilDestroy
});
