import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { _useTextDirection, UseTextDirectionOptions, UseTextDirectionValue } from './internal';
import { useUntilDestroy } from '../use-until-destroy';

export interface UseTextDirectionSettings extends UseTextDirectionOptions {
  self: boolean;
}

@Directive({
  selector: '[useTextDirection]',
  standalone: true
})
export class UseTextDirectionDirective implements AfterViewInit {
  private readonly _useTextDirection = _useTextDirection();
  private readonly destroy$ = useUntilDestroy<UseTextDirectionValue>();

  @Input()
  public useTextDirectionSettings: UseTextDirectionSettings = {
    self: true
  };

  @Output()
  public useTextDirection = new EventEmitter<UseTextDirectionValue>();

  public ngAfterViewInit(): void {
    this._useTextDirection(this.useTextDirectionSettings, this.useTextDirectionSettings.self)
      .pipe(this.destroy$)
      .subscribe((textDirection: UseTextDirectionValue) => {
        this.useTextDirection.emit(textDirection);
      });
  }
}
