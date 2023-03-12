export interface Position {
  x: number;
  y: number;
}

export type WindowRef = (Window & typeof globalThis) | null;
