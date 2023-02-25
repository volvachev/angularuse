import { ElementRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { mouseInElement, UseMouseInElementOptions, UseMouseInElementReturn } from './internal';
import { useMouse } from '../use-mouse';
import { Observable } from 'rxjs';

export function useMouseInElement(options: UseMouseInElementOptions = {}): Observable<UseMouseInElementReturn> {
  const target = inject(ElementRef, { optional: true });
  const documentRef = inject(DOCUMENT);
  const windowRef = documentRef.defaultView;
  const targetRef = target?.nativeElement ?? document.body;

  return mouseInElement({ windowRef, targetRef, documentRef, useMouseFunction: useMouse }, options);
}

export { UseMouseInElementReturn, UseMouseInElementOptions } from './internal';
