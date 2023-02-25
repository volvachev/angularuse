import { ElementRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { mousePressed, UseMousePressedOptions, UseMousePressedReturn } from './internal';
import { Observable } from 'rxjs';

export function useMousePressed(options: UseMousePressedOptions = {}): Observable<UseMousePressedReturn> {
  const element = inject(ElementRef, { optional: true });
  const windowRef = inject(DOCUMENT).defaultView;

  const targetRef = element?.nativeElement ?? windowRef;
  return mousePressed({ windowRef, targetRef }, options);
}

export { UseMousePressedOptions, UseMousePressedReturn } from './internal';
