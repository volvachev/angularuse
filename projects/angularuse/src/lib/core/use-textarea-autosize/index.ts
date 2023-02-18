import { Observable } from 'rxjs';
import { ElementRef, inject, InjectionToken, Renderer2 } from '@angular/core';
import { textareaAutosize, UseTextareaAutosizeOptions } from './internal';
import { NgControl } from '@angular/forms';
import { useResizeObserver } from '../use-resize-observer';

export function useTextareaAutosize(
  options: UseTextareaAutosizeOptions = {},
): Observable<void> {
  const textarea: HTMLTextAreaElement = inject(ElementRef).nativeElement;
  const renderer = inject(Renderer2);
  const control = inject(NgControl, { optional: true });
  const resize$ = useResizeObserver();
  const inputControl = options?.input ?? control?.control ?? null;

  return textareaAutosize({textarea, resize$, renderer}, {
    ...options,
    input: inputControl
  });
}

export const TEXT_AREA_AUTO_SIZE = new InjectionToken<Observable<void>>(
  'Token for update the height of a textarea depending on the content.',
  {
    factory: useTextareaAutosize
  }
);

export { UseTextareaAutosizeOptions } from './internal';
