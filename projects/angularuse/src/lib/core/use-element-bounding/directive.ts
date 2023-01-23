import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { withZone } from '../../shared/utils/with-zone';
import { useUntilDestroy } from '../use-until-destroy';
import { _useElementBounding, UseElementBounding, UseElementBoundingOptions } from './internal';

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
  private readonly _useElementBounding = _useElementBounding();
  private readonly destroy$ = useUntilDestroy<UseElementBounding>();
  private readonly zoneTrigger = withZone<UseElementBounding>();

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
    this._useElementBounding(this.useElementBoundingSettings.boundingSettings)
      .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy$)
      .subscribe((elementSize: UseElementBounding) => {
        this.useElementBounding.emit(elementSize);
      });
  }
}
