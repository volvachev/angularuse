import { ElementRef, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { elementHover, UseElementHoverOptions } from './internal';
import { DOCUMENT } from '@angular/common';

export function useElementHover(options: UseElementHoverOptions = {}): Observable<boolean> {
  const element = inject(ElementRef).nativeElement as HTMLElement;
  const windowRef = inject(DOCUMENT).defaultView;

  return elementHover(element, windowRef, options);
}

export { UseElementHoverOptions } from './internal';
