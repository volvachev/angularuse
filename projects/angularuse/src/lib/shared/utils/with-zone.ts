import { Observable } from 'rxjs';
import { _useInsideZone } from '../../core/use-inside-zone';
import { _useOutsideZone } from '../../core/use-outside-zone';

type WithZoneInternalType<T> = (source: Observable<T>) => Observable<T>;
type WithZoneType = <T>(isInsideZone: boolean) => WithZoneInternalType<T>;

export const withZone = (): WithZoneType => {
  const outsideZone = _useOutsideZone();
  const insideZone = _useInsideZone();

  return <T>(isInsideZone: boolean): WithZoneInternalType<T> => {
    return (source: Observable<T>) => {
      if (isInsideZone) {
        return source.pipe(insideZone());
      }

      return source.pipe(outsideZone());
    };
  };
};
