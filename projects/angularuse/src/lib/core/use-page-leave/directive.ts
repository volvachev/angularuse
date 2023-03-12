import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { usePageLeave } from '.';

export interface UsePageLeaveSettings {
  insideNgZone?: boolean;
}

@Directive({
  selector: '[usePageLeave]',
  standalone: true
})
export class UsePageLeaveDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

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
    this.runInInjectContext(() => {
      usePageLeave()
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((isLeave: boolean) => {
          this.usePageLeave.emit(isLeave);
        });
    });
  }
}
