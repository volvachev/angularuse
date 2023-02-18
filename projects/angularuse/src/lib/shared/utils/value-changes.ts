import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { consistentQueue } from './consistent-queue';

export function valueChanges<T>(control: AbstractControl): Observable<T> {
  return consistentQueue<T>(() => control.value, control.valueChanges);
}
