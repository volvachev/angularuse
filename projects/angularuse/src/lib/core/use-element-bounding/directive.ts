import { Attribute, Directive, Output } from '@angular/core';
import { useElementBounding, UseElementBoundingOptions } from '.';
import { skip } from 'rxjs';
import { isStringBooleanAttribute, StringBooleanAttribute } from '../../shared/utils/is-string-boolean-attribute';
import { withZone } from '../../shared/utils/with-zone';

/*
 * experimental
 */
@Directive({
  selector: '[useElementBounding]',
  standalone: true
})
export class UseElementBoundingDirective {
  @Output()
  public readonly useElementBounding = useElementBounding(this.prepareOptions()).pipe(
    withZone()(isStringBooleanAttribute(this.withNgZone)),
    skip(1)
  );

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
}
