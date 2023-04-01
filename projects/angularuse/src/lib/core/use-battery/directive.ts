import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { BatteryData, useBattery } from '.';

export interface UseBatterySettings {
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useBattery]',
  standalone: true
})
export class UseBatteryDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useBatterySettings: UseBatterySettings = {
    insideNgZone: true
  };

  @Output()
  public useBattery = new EventEmitter<BatteryData>();

  private get isInsideNgZone(): boolean {
    return this.useBatterySettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useBattery()
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((batteryData: BatteryData) => {
          this.useBattery.emit(batteryData);
        });
    });
  }
}
