import { AbstractControl, NgControl } from '@angular/forms';
import { ElementRef, inject, Renderer2 } from '@angular/core';
import { EMPTY, map, merge, Observable, tap } from 'rxjs';
import { useResizeObserver } from '../use-resize-observer';
import { valueChanges } from '../../shared/utils/value-changes';

export interface UseTextareaAutosizeOptions {
  /** Textarea content. */
  input?: AbstractControl<string | null> | null;
}

interface TextAreaAutoSizeParams {
  textarea: HTMLTextAreaElement;
  renderer: Renderer2;
  resize$: Observable<ResizeObserverEntry[]>;
}

export function textareaAutosize(
  { textarea, renderer, resize$ }: TextAreaAutoSizeParams,
  options?: UseTextareaAutosizeOptions
): Observable<void> {
  function triggerResize() {
    if (!textarea) {
      return;
    }

    renderer.setStyle(textarea, 'height', '1px');
    renderer.setStyle(textarea, 'height', `${textarea?.scrollHeight}px`);
  }

  const controlValue$ = options?.input ? valueChanges(options?.input) : EMPTY;

  return merge(controlValue$, resize$).pipe(
    tap(() => triggerResize()),
    map(() => void 0)
  );
}

/*
 * internal realisation for reuse inside directives
 */
export function _useTextareaAutosize() {
  const textarea: HTMLTextAreaElement = inject(ElementRef).nativeElement;
  const renderer = inject(Renderer2);
  const control = inject(NgControl, { optional: true });
  const resize$ = useResizeObserver();

  return (options: UseTextareaAutosizeOptions = {}) => {
    const inputControl = options?.input ?? control?.control ?? null;

    return textareaAutosize(
      { textarea, renderer, resize$ },
      {
        ...options,
        input: inputControl
      }
    );
  };
}
