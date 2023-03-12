import { defer, EMPTY, fromEvent, iif, map, merge, Observable, of } from 'rxjs';
import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { consistentQueue } from '../../shared/utils/consistent-queue';
import { WindowRef } from '../types';

interface HasEventTargetAddRemove<E> {
  addEventListener(
    type: string,
    listener: ((evt: E) => void) | null,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: ((evt: E) => void) | null,
    options?: EventListenerOptions | boolean
  ): void;
}

export interface NetworkInformation {
  isOnline: boolean;
  offlineAt?: number;
  onlineAt?: number;
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
  type?: string;
}

const generateDefaultNetworkInformation = (): NetworkInformation => {
  return {
    isOnline: true,
    saveData: false,
    offlineAt: undefined,
    onlineAt: undefined,
    downlink: undefined,
    downlinkMax: undefined,
    effectiveType: undefined,
    rtt: undefined,
    type: 'unknown'
  };
};

type NavigatorConnection = Navigator & {
  connection: Omit<NetworkInformation, 'offlineAt' | 'onlineAt'> & HasEventTargetAddRemove<unknown>;
};

export function useNetwork(): Observable<NetworkInformation> {
  const window: WindowRef = inject(DOCUMENT).defaultView;

  if (!window) {
    return of(generateDefaultNetworkInformation());
  }

  const connection = (window.navigator as NavigatorConnection)?.connection ?? ({} as NetworkInformation);

  function updateNetworkInformation(): NetworkInformation {
    if (!window?.navigator) {
      return generateDefaultNetworkInformation();
    }

    const isOnline = navigator.onLine;
    return {
      isOnline,
      offlineAt: isOnline ? undefined : Date.now(),
      onlineAt: isOnline ? Date.now() : undefined,
      downlink: connection?.downlink,
      downlinkMax: connection?.downlinkMax,
      effectiveType: connection?.effectiveType,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
      type: connection?.type
    };
  }

  return consistentQueue(
    updateNetworkInformation,
    merge(
      fromEvent(window, 'offline').pipe(
        map(() => ({
          ...updateNetworkInformation(),
          isOnline: false,
          offlineAt: Date.now()
        }))
      ),
      fromEvent(window, 'online').pipe(
        map(() => ({
          ...updateNetworkInformation(),
          isOnline: true,
          onlineAt: Date.now()
        }))
      ),
      defer(() =>
        iif(() => Boolean(connection), fromEvent(connection, 'change').pipe(map(updateNetworkInformation)), EMPTY)
      )
    )
  );
}

export const NETWORK_INFORMATION = new InjectionToken<Observable<NetworkInformation>>('Reactive Network status.', {
  factory: useNetwork
});
