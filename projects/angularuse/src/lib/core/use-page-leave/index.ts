import { inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { pageLeave } from './internal';
import { DOCUMENT } from '@angular/common';

export function usePageLeave(): Observable<boolean> {
  const documentRef = inject(DOCUMENT);
  const windowRef = documentRef.defaultView;

  return pageLeave(windowRef, documentRef);
}

export const PAGE_LEAVE = new InjectionToken<Observable<boolean>>(
  'Reactive state to show whether the mouse leaves the page.',
  {
    factory: usePageLeave
  }
);
