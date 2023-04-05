import { broadcastChannel, UseBroadcastChannelOptions, UseBroadcastChannelReturn } from './internal';
import { WindowRef } from '../types';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { _useOnDestroy } from '../../shared/utils/_on-destroy';

export function useBroadcastChannel<D, P>(options: UseBroadcastChannelOptions): UseBroadcastChannelReturn<D, P> {
  const windowRef: WindowRef = inject(DOCUMENT).defaultView;
  const destroy = _useOnDestroy();

  return broadcastChannel(windowRef, destroy, options);
}
