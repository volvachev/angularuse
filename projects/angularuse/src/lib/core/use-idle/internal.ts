import {
  defer,
  EMPTY,
  fromEvent,
  iif,
  Observable,
  merge,
  throttleTime,
  map,
  filter,
  timer,
  switchMap,
  startWith,
  shareReplay
} from 'rxjs';
import { timestamp } from '../../shared/utils/timestamp';
import { consistentQueue } from '../../shared/utils/consistent-queue';
import { WindowRef } from '../types';

export type WindowEventName = keyof WindowEventMap;

const defaultEvents: WindowEventName[] = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel'];
const oneMinute = 60_000;

export interface UseIdleOptions {
  /**
   * Event names that listen to for detected user activity
   *
   * @default ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
   */
  events?: WindowEventName[];
  /**
   * Listen for document visibility change
   *
   * @default true
   */
  listenForVisibilityChange?: boolean;
  /**
   * Initial state of the ref idle
   *
   * @default false
   */
  initialState?: boolean;
  throttleTime?: number;
}

export interface UseIdleReturn {
  idle: boolean;
  lastActive: number;
}

function listenBrowserEvents(
  windowRef: Window & typeof globalThis,
  documentRef: Document,
  listenForVisibilityChange: boolean,
  events: WindowEventName[]
): Observable<Event> {
  return merge(
    ...events.map(event => fromEvent(windowRef!, event, { passive: true })),
    defer(() =>
      iif(
        () => listenForVisibilityChange,
        fromEvent(documentRef, 'visibilitychange', { passive: true }).pipe(filter(() => !documentRef.hidden)),
        EMPTY
      )
    )
  );
}

export function idle(
  windowRef: WindowRef,
  documentRef: Document,
  timeout: number = oneMinute,
  options: UseIdleOptions = {}
): Observable<UseIdleReturn> {
  const { initialState = false, listenForVisibilityChange = true, events = defaultEvents } = options;
  const initialLastActive = timestamp();
  const initialIdle: UseIdleReturn = { lastActive: initialLastActive, idle: initialState };

  const userEvents$ = defer(() =>
    iif(
      () => Boolean(windowRef),
      listenBrowserEvents(windowRef!, documentRef, listenForVisibilityChange, events).pipe(
        throttleTime(options?.throttleTime ?? 50),
        map(() => ({ idle: false, lastActive: timestamp() }))
      ),
      EMPTY
    )
  ).pipe(shareReplay({ refCount: true, bufferSize: 1 }));

  return consistentQueue(
    () => initialIdle,
    merge(
      userEvents$,
      userEvents$.pipe(
        startWith(initialIdle),
        switchMap((idleData: UseIdleReturn) => timer(timeout).pipe(map(() => idleData))),
        map(({ lastActive }) => ({ idle: true, lastActive }))
      )
    )
  );
}
