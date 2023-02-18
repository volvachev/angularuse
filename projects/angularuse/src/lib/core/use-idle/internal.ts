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
  Subject,
  tap,
  switchMap,
  startWith
} from 'rxjs';
import { timestamp } from '../../shared/utils/timestamp';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { consistentQueue } from '../../shared/utils/consistent-queue';

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
  windowRef: (Window & typeof globalThis) | null,
  documentRef: Document,
  timeout: number = oneMinute,
  options: UseIdleOptions = {}
): Observable<UseIdleReturn> {
  const timeout$ = new Subject<void>();

  const { initialState = false, listenForVisibilityChange = true, events = defaultEvents } = options;

  let lastActive = timestamp();

  return consistentQueue(
    () => ({ lastActive: lastActive, idle: initialState }),
    merge(
      defer(() =>
        iif(
          () => Boolean(windowRef),
          listenBrowserEvents(windowRef!, documentRef, listenForVisibilityChange, events).pipe(
            throttleTime(50),
            // TODO: refactor to Rx way
            tap(() => {
              lastActive = timestamp();
              timeout$.next();
            }),
            map(() => ({ idle: false, lastActive }))
          ),
          EMPTY
        )
      ),
      timeout$.asObservable().pipe(
        startWith(undefined),
        switchMap(() => timer(timeout)),
        map(() => ({ idle: true, lastActive }))
      )
    )
  );
}

/*
 * internal realisation for reuse inside directives
 */
export function _useIdle() {
  const document = inject(DOCUMENT);
  const windowRef = inject(DOCUMENT).defaultView;

  return (timeout: number = oneMinute, options: UseIdleOptions = {}): Observable<UseIdleReturn> => {
    return idle(windowRef, document, timeout, options);
  };
}
