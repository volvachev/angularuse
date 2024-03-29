import { filter, fromEvent, map, Observable, switchMap } from 'rxjs';
import { consistentQueue } from '../../shared/utils/consistent-queue';
import { MouseSourceType, UseMouseFunction, UseMouseOptions } from '../use-mouse/internal';
import { WindowRef } from '../types';

export interface UseMouseInElementOptions extends UseMouseOptions {
  handleOutside?: boolean;
}

export interface MouseInElementParams {
  windowRef: WindowRef;
  documentRef: Document;
  targetRef: HTMLElement;
  useMouseFunction: UseMouseFunction;
}

export type UseMouseInElementReturn = {
  x: number;
  y: number;
  sourceType: MouseSourceType;
  elementX: number;
  elementY: number;
  elementPositionX: number;
  elementPositionY: number;
  elementHeight: number;
  elementWidth: number;
  isOutside: boolean;
};

export function mouseInElement(
  params: MouseInElementParams,
  options: UseMouseInElementOptions = {}
): Observable<UseMouseInElementReturn> {
  const { windowRef, documentRef, useMouseFunction, targetRef } = params;
  const { handleOutside = true } = options;
  const useMouse$ = useMouseFunction(options);

  if (!windowRef) {
    return useMouse$.pipe(
      map(mouseData => ({
        ...mouseData,
        ...{
          elementX: 0,
          elementY: 0,
          elementPositionX: 0,
          elementPositionY: 0,
          elementHeight: 0,
          elementWidth: 0,
          isOutside: true
        }
      }))
    );
  }

  return useMouse$
    .pipe(
      map(({ x, y, sourceType }) => {
        if (!targetRef) {
          return;
        }

        const { left, top, width, height } = targetRef.getBoundingClientRect();
        const elementPositionX = left + windowRef!.pageXOffset;
        const elementPositionY = top + windowRef!.pageYOffset;
        const elX = x - elementPositionX;
        const elY = y - elementPositionY;
        const isOutside = width === 0 || height === 0 || elX < 0 || elY < 0 || elX > width || elY > height;
        const elementX = handleOutside || !isOutside ? elX : 0;
        const elementY = handleOutside || !isOutside ? elY : 0;

        return {
          elementPositionX,
          elementPositionY,
          elementHeight: height,
          elementWidth: width,
          isOutside,
          elementX,
          elementY,
          sourceType,
          x,
          y
        };
      })
    )
    .pipe(
      filter(Boolean),
      switchMap(elementSizes =>
        consistentQueue(
          () => elementSizes,
          fromEvent(documentRef, 'mouseleave', { passive: true }).pipe(
            map(() => ({ ...elementSizes, isOutside: true }))
          )
        )
      )
    );
}
