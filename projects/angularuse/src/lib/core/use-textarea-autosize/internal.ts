import { AbstractControl } from '@angular/forms';
import { Renderer2 } from '@angular/core';
import { EMPTY, map, merge, Observable, tap } from 'rxjs';
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
