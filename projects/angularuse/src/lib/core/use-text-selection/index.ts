import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, map, Observable, of } from 'rxjs';
import { consistentQueue } from '../../shared/utils/consistent-queue';

export interface UseTextSelection {
  selection: Selection | null;
  text: string;
  ranges: Range[];
  rects: DOMRect[];
}

function getRangesFromSelection(selection: Selection): Range[] {
  const rangeCount = selection.rangeCount ?? 0;
  const ranges = Array.from<Range>({ length: rangeCount });

  for (let i = 0; i < rangeCount; i++) {
    ranges[i] = selection.getRangeAt(i);
  }

  return ranges;
}

const defaultSelection = (): UseTextSelection => ({
  selection: null,
  text: '',
  ranges: [],
  rects: []
});

const getTextSelectionInformation = (window: Window & typeof globalThis) => (): UseTextSelection => {
  const selection = window.getSelection();
  const text = selection?.toString() ?? '';
  const ranges = selection ? getRangesFromSelection(selection) : [];
  const rects = ranges.map(range => range.getBoundingClientRect());

  return {
    selection,
    text,
    ranges,
    rects
  };
};

export function useTextSelection(): Observable<UseTextSelection> {
  const document: Document = inject(DOCUMENT);
  const window: (Window & typeof globalThis) | null = document.defaultView;

  if (!window) {
    return of(defaultSelection());
  }

  const getTextSelection = getTextSelectionInformation(window);

  return consistentQueue(
    getTextSelection,
    fromEvent(document, 'selectionchange', { passive: true }).pipe(map(getTextSelection))
  );
}

export const TEXT_SELECTION = new InjectionToken<Observable<UseTextSelection>>(
  'Reactively track user text selection based on `Window.getSelection`',
  {
    factory: useTextSelection
  }
);
