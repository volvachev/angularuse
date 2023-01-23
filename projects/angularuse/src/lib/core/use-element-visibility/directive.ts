import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { _useElementVisibility, UseElementVisibilityOptions } from './internal';

export interface UseElementVisibilitySettings {
  visibilitySettings?: UseElementVisibilityOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useElementVisibility]',
  standalone: true
})
export class UseElementVisibilityDirective implements AfterViewInit {
  private readonly _useElementVisibility = _useElementVisibility();
  private readonly destroy$ = useUntilDestroy<boolean>();
  private readonly zoneTrigger = withZone<boolean>();

  @Input()
  public useElementVisibilitySettings: UseElementVisibilitySettings = {
    insideNgZone: true
  };

  @Output()
  public useElementVisibility = new EventEmitter<boolean>();

  private get isInsideNgZone(): boolean {
    return this.useElementVisibilitySettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this._useElementVisibility(this.useElementVisibilitySettings?.visibilitySettings)
      .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy$)
      .subscribe((isElementVisible: boolean) => {
        this.useElementVisibility.emit(isElementVisible);
      });
  }
}
