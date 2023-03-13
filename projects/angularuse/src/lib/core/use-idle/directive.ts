import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { UseIdleOptions, UseIdleReturn } from './internal';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useIdle } from '.';

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
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

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
    this.runInInjectContext(() => {
      useIdle(this.useIdleSettings.timeout, this.useIdleSettings.idleSettings)
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((entry: UseIdleReturn) => {
          this.useIdle.emit(entry);
        });
    });
  }
}
