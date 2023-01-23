import { Observable } from 'rxjs';
import { useOutsideZone } from '../../core/use-outside-zone';
import { useInsideZone } from '../../core/use-inside-zone';

type WithZoneInternalType<T> = (source: Observable<T>) => Observable<T>;
type WithZoneType<T> = (isInsideZone: boolean) => WithZoneInternalType<T>;

export const withZone = <T>(): WithZoneType<T> => {
  const outsideZone$ = useOutsideZone<T>();
  const insideZone$ = useInsideZone<T>();

  return (isInsideZone: boolean): WithZoneInternalType<T> => {
    return (source: Observable<T>) => {
      if (isInsideZone) {
        return source.pipe(insideZone$);
      }

      return source.pipe(outsideZone$);
    };
  };
};
