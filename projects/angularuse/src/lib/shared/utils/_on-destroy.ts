import { DestroyRef, inject } from '@angular/core';

export type DestroyCallback = (cb: VoidFunction) => VoidFunction;

export function _useOnDestroy(): DestroyCallback {
  const destroyRef = inject(DestroyRef);

  return (cb: VoidFunction): VoidFunction => {
    return destroyRef.onDestroy(cb);
  };
}
