import { distinctUntilChanged, filter, isObservable, map, Observable, of, tap } from 'rxjs';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isString } from '../../shared/utils/is-string';

export type IconType = string | null | undefined;

export interface UseFaviconOptions {
  baseUrl?: string;
  rel?: string;
}

export function favicon(
  document: Document,
  newIcon: IconType | Observable<IconType> = null,
  options: UseFaviconOptions = {}
): Observable<void> {
  const { baseUrl = '', rel = 'icon' } = options ?? {};

  const observableFavicon = isObservable(newIcon) ? newIcon : of(newIcon);

  const applyIcon = (icon: string): void => {
    document?.head.querySelectorAll<HTMLLinkElement>(`link[rel*="${rel}"]`).forEach(el => {
      el.href = `${baseUrl}${icon}`;
    });
  };

  return observableFavicon.pipe(
    filter(icon => isString(icon)),
    distinctUntilChanged(),
    tap(icon => {
      applyIcon(icon as unknown as string);
    }),
    map(() => void 0)
  );
}

/*
 * internal realisation for reuse inside directives
 */
export function _useFavicon() {
  const document: Document = inject(DOCUMENT);

  return (newIcon: IconType | Observable<IconType> = null, options: UseFaviconOptions) => {
    return favicon(document, newIcon, options);
  };
}
