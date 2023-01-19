import { concatMap, defer, from, fromEvent, iif, map, merge, Observable, of } from 'rxjs';
import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { consistentQueue } from '../../shared/utils/consistent-queue';

export interface BatteryData {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

export interface BatteryManager extends BatteryData, EventTarget {}

type NavigatorWithBattery = Navigator & {
  getBattery: () => Promise<BatteryManager>;
};

const BATTERY_EVENTS = ['chargingchange', 'chargingtimechange', 'dischargingtimechange', 'levelchange'];

const getDefaultBatteryInfo = (): BatteryData => ({
  charging: false,
  chargingTime: 0,
  dischargingTime: 0,
  level: 1
});

const updateBatteryInfo = (obj: BatteryManager): BatteryData => ({
  charging: obj.charging,
  chargingTime: obj.chargingTime || 0,
  dischargingTime: obj.dischargingTime || 0,
  level: obj.level
});

const getAllEventsFromBattery = (battery: BatteryManager): Observable<BatteryData> =>
  merge(
    ...BATTERY_EVENTS.map(eventName =>
      fromEvent(battery, eventName, { passive: true }).pipe(
        map(({ target }) => updateBatteryInfo(target as unknown as BatteryManager))
      )
    )
  );

export function useBattery(): Observable<BatteryData> {
  const window: (Window & typeof globalThis) | null = inject(DOCUMENT).defaultView;

  if (!window) {
    return of(getDefaultBatteryInfo());
  }

  const navigator = window.navigator as NavigatorWithBattery;

  return defer(() =>
    iif(
      () => Boolean(navigator && 'getBattery' in navigator),
      from(navigator.getBattery()).pipe(
        concatMap(battery => consistentQueue(() => updateBatteryInfo(battery), getAllEventsFromBattery(battery)))
      ),
      of(getDefaultBatteryInfo())
    )
  );
}

export const BATTERY_INFO = new InjectionToken<Observable<BatteryData>>('Reactive Battery Status API', {
  factory: useBattery
});
