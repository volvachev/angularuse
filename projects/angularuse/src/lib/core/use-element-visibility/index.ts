import { ElementRef, inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { elementVisibility, UseElementVisibilityOptions } from './internal';
import { DOCUMENT } from '@angular/common';
import { WindowRef } from '../types';

export function useElementVisibility(options: UseElementVisibilityOptions = {}): Observable<boolean> {
  const document: Document = inject(DOCUMENT);
  const element = inject(ElementRef).nativeElement as HTMLElement;
  const window: WindowRef = document.defaultView;

  return elementVisibility(
    {
      element,
      window,
      document
    },
    options
  );
}

export const ELEMENT_VISIBILITY = new InjectionToken<Observable<boolean>>(
  'Tracks the visibility of an element within the viewport.',
  {
    factory: useElementVisibility
  }
);

export { UseElementVisibilityOptions } from './internal';
