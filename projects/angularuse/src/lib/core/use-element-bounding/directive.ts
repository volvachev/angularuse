import { Attribute, Directive, Output } from '@angular/core';
import { useElementBounding, UseElementBoundingOptions } from '.';
import { Observable, skip } from 'rxjs';
import { useOutsideZone } from '../use-outside-zone';
import { useInsideZone } from '../use-inside-zone';
import { isStringBooleanAttribute, StringBooleanAttribute } from '../../shared/utils/is-string-boolean-attribute';

/*
 * experimental
 */
@Directive({
  selector: '[useElementBounding]',
  standalone: true
})
export class UseElementBoundingDirective {
  @Output()
  public readonly useElementBounding = useElementBounding(this.prepareOptions()).pipe(this.withZone(), skip(1));

  constructor(
    @Attribute('withWindowResize') public withWindowResize: StringBooleanAttribute,
    @Attribute('withWindowScroll') public withWindowScroll: StringBooleanAttribute,
    @Attribute('withNgZone') public withNgZone: StringBooleanAttribute
  ) {}

  private prepareOptions(): UseElementBoundingOptions {
    return {
      windowScroll: isStringBooleanAttribute(this.withWindowScroll),
      windowResize: isStringBooleanAttribute(this.withWindowResize)
    };
  }

  private withZone<T>(): (source: Observable<T>) => Observable<T> {
    const outsideZone$ = useOutsideZone<T>();
    const insideZone$ = useInsideZone<T>();

    return source => {
      if (isStringBooleanAttribute(this.withNgZone)) {
        return source.pipe(insideZone$);
      }

      return source.pipe(outsideZone$);
    };
  }
}
