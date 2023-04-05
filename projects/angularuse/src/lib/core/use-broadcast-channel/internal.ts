import { WindowRef } from '../types';
import { signal, WritableSignal } from '@angular/core';
import { DestroyCallback } from '../../shared/utils/_on-destroy';

export interface UseBroadcastChannelOptions {
  /**
   * The name of the channel.
   */
  name: string;
}

export function broadcastChannel<D, P>(
  windowRef: WindowRef,
  destroyFn: DestroyCallback,
  options: UseBroadcastChannelOptions
): UseBroadcastChannelReturn<D, P> {
  const { name } = options;

  const isSupported = Boolean(windowRef && 'BroadcastChannel' in windowRef);
  const isClosed = signal(false);

  const channel = signal<BroadcastChannel | undefined>(undefined);
  const data = signal<D | null>(null);
  const error = signal<Event | null>(null);

  const post = (data: unknown) => {
    const channelValue = channel();
    if (channelValue) {
      channelValue.postMessage(data);
    }
  };

  const close = () => {
    const channelValue = channel();
    if (channelValue) {
      channelValue.close();
    }

    isClosed.set(true);
  };

  if (isSupported) {
    error.set(null);
    const broadcastChannel = new BroadcastChannel(name);
    channel.set(broadcastChannel);

    broadcastChannel.addEventListener(
      'message',
      (e: MessageEvent) => {
        data.set(e.data);
      },
      { passive: true }
    );

    broadcastChannel.addEventListener(
      'messageerror',
      (e: MessageEvent) => {
        error.set(e);
      },
      { passive: true }
    );

    broadcastChannel.addEventListener('close', () => {
      isClosed.set(true);
    });
  }

  destroyFn(() => {
    close();
  });

  return {
    isSupported,
    channel,
    data,
    post,
    close,
    error,
    isClosed
  };
}

export interface UseBroadcastChannelReturn<D, P> {
  isSupported: boolean;
  channel: WritableSignal<BroadcastChannel | undefined>;
  data: WritableSignal<D | null>;
  post: (data: P) => void;
  close: () => void;
  error: WritableSignal<Event | null>;
  isClosed: WritableSignal<boolean>;
}
