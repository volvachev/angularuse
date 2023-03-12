import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { _usePageLeave } from './internal';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';

export interface UsePageLeaveSettings {
  insideNgZone?: boolean;
}

@Directive({
  selector: '[usePageLeave]',
  standalone: true
})
export class UsePageLeaveDirective implements AfterViewInit {
  private readonly _usePageLeave = _usePageLeave();
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();

  @Input()
  public usePageLeaveSettings: UsePageLeaveSettings = {
    insideNgZone: true
  };

  @Output()
  public usePageLeave = new EventEmitter<boolean>();

  private get isInsideNgZone(): boolean {
    return this.usePageLeaveSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this._usePageLeave()
      .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
      .subscribe((isLeave: boolean) => {
        this.usePageLeave.emit(isLeave);
      });
  }
}
