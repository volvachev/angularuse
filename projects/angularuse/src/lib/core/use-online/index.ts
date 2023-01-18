import { map, Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { useNetwork } from '../use-network';

export function useOnline(): Observable<boolean> {
  return useNetwork().pipe(map(({ isOnline }) => isOnline));
}

export const ONLINE_STATUS = new InjectionToken<Observable<boolean>>('Reactive online state.', {
  factory: useOnline
});
