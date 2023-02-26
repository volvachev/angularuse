import { inject, SettableSignal, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { useOnDestroy } from '../use-until-destroy/internal';

export function useDocumentVisibilitySignal(): SettableSignal<DocumentVisibilityState> {
  const documentRef: Document = inject(DOCUMENT);
  const destroy = useOnDestroy();
  const documentSignal = signal<DocumentVisibilityState>('visible');

  if (!documentRef) {
    return documentSignal;
  }

  const getVisibilityState = () => {
    documentSignal.set(documentRef.visibilityState);
  };

  documentRef.addEventListener('visibilitychange', getVisibilityState, { passive: true });

  destroy(() => {
    documentRef.removeEventListener('visibilitychange', getVisibilityState);
  });

  getVisibilityState();

  return documentSignal;
}
