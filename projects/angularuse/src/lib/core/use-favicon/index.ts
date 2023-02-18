import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { favicon, IconType, UseFaviconOptions } from './internal';

export function useFavicon(
  newIcon: IconType | Observable<IconType> = null,
  options: UseFaviconOptions = {}
): Observable<void> {
  const document: Document = inject(DOCUMENT);

  return favicon(document, newIcon, options);
}

export { UseFaviconOptions, IconType } from './internal';
