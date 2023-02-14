import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { _useIdle, UseIdleOptions, UseIdleReturn } from './internal';

export interface IdleSettings {
  idleSettings?: UseIdleOptions;
  timeout?: number;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useIdle]',
  standalone: true
})
export class UseIdleDirective implements AfterViewInit {
  private readonly _useIdle = _useIdle();
  private readonly destroy$ = useUntilDestroy<UseIdleReturn>();
  private readonly zoneTrigger = withZone<UseIdleReturn>();

  @Input()
  public useIdleSettings: IdleSettings = {
    insideNgZone: true
  };

  @Output()
  public useIdle = new EventEmitter<UseIdleReturn>();

  private get isInsideNgZone(): boolean {
    return this.useIdleSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this._useIdle(this.useIdleSettings.timeout, this.useIdleSettings.idleSettings)
      .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy$)
      .subscribe((entry: UseIdleReturn) => {
        this.useIdle.emit(entry);
      });
  }
}
