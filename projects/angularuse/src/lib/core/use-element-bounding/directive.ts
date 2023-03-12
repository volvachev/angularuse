import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { withZone } from '../../shared/utils/with-zone';
import { useUntilDestroy } from '../use-until-destroy';
import { UseElementBounding, UseElementBoundingOptions } from './internal';
import { useElementBounding } from '.';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';

export interface ElementBoundingSettings {
  boundingSettings?: UseElementBoundingOptions;
  insideNgZone?: boolean;
}

/*
 * experimental
 */
@Directive({
  selector: '[useElementBounding]',
  standalone: true
})
export class UseElementBoundingDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useElementBoundingSettings: ElementBoundingSettings = {
    insideNgZone: true
  };

  @Output()
  public readonly useElementBounding = new EventEmitter<UseElementBounding>();

  private get isInsideNgZone(): boolean {
    return this.useElementBoundingSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useElementBounding(this.useElementBoundingSettings.boundingSettings)
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((elementSize: UseElementBounding) => {
          this.useElementBounding.emit(elementSize);
        });
    });
  }
}
