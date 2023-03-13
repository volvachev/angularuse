import { ChangeDetectorRef, inject, ViewRef } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/ban-types
export function _useOnDestroy(): (cb: Function) => void {
  const viewRef = inject(ChangeDetectorRef) as ViewRef;

  // eslint-disable-next-line @typescript-eslint/ban-types
  return (cb: Function): void => {
    queueMicrotask(() => {
      viewRef.onDestroy(cb);
    });
  };
}
