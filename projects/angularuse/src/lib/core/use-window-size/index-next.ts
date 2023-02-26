import { inject, SettableSignal, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UseWindowSizeOptions, WindowSize } from './index';
import { useOnDestroy } from '../use-until-destroy/internal';

const getWindowSizes = (includeScrollbar: boolean, window: Window & typeof globalThis) => (): WindowSize => {
  if (includeScrollbar) {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  return {
    width: window.document.documentElement.clientWidth,
    height: window.document.documentElement.clientHeight
  };
};

export function useWindowSizeSignal(options: UseWindowSizeOptions = {}): SettableSignal<Readonly<WindowSize>> {
  const {
    initialWidth = Infinity,
    initialHeight = Infinity,
    listenOrientation = true,
    includeScrollbar = true
  } = options;
  const windowRef: (Window & typeof globalThis) | null = inject(DOCUMENT).defaultView;
  const windowSizeSignal = signal({ width: initialWidth, height: initialHeight });
  const destroy = useOnDestroy();

  if (!windowRef) {
    return windowSizeSignal;
  }

  const getWindowSizesCurry = getWindowSizes(includeScrollbar, windowRef);
  windowSizeSignal.set(getWindowSizesCurry());

  windowRef.addEventListener('resize', getWindowSizesCurry, { passive: true });

  if (listenOrientation) {
    windowRef.addEventListener('orientationchange', getWindowSizesCurry, { passive: true });
  }

  destroy(() => {
    windowRef.removeEventListener('resize', getWindowSizesCurry);

    if (listenOrientation) {
      windowRef.removeEventListener('orientationchange', getWindowSizesCurry);
    }
  });

  return windowSizeSignal;
}
