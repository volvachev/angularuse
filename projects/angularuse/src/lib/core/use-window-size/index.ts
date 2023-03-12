import { defer, EMPTY, fromEvent, iif, map, merge, Observable, of } from 'rxjs';
import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { consistentQueue } from '../../shared/utils/consistent-queue';
import { WindowRef } from '../types';

export interface UseWindowSizeOptions {
  initialWidth?: number;
  initialHeight?: number;
  /**
   * Listen to window `orientationchange` event
   *
   * @default true
   */
  listenOrientation?: boolean;

  /**
   * Whether the scrollbar should be included in the width and height
   * @default true
   */
  includeScrollbar?: boolean;
}

export interface WindowSize {
  width: number;
  height: number;
}

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

const pipeableGetWindowSizes = (includeScrollbar: boolean, window: Window & typeof globalThis) =>
  map(getWindowSizes(includeScrollbar, window));

export function useWindowSize(options: UseWindowSizeOptions = {}): Observable<Readonly<WindowSize>> {
  const {
    initialWidth = Infinity,
    initialHeight = Infinity,
    listenOrientation = true,
    includeScrollbar = true
  } = options;
  const window: WindowRef = inject(DOCUMENT).defaultView;

  if (!window) {
    return of({ width: initialWidth, height: initialHeight });
  }

  return consistentQueue<Event | null>(
    () => null,
    merge(
      fromEvent(window, 'resize', { passive: true }),
      defer(() => iif(() => listenOrientation, fromEvent(window, 'orientationchange', { passive: true }), EMPTY))
    )
  ).pipe(pipeableGetWindowSizes(includeScrollbar, window));
}

export const WINDOW_SIZE = new InjectionToken<Observable<Readonly<WindowSize>>>('Reactive window size', {
  factory: useWindowSize
});
