import { concat, defer, Observable, of } from 'rxjs';

export function consistentQueue<T>(initialFunction: () => T, observable: Observable<T>): Observable<T> {
  return concat(
    defer(() => of(initialFunction())),
    observable
  );
}
