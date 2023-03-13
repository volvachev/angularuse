import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { UseMouseOptions, UseMouseReturn } from './internal';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useMouse } from '.';

export interface UseMouseSettings {
  mouseSettings?: UseMouseOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useMouse]',
  standalone: true
})
export class UseMouseDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useMouseSettings: UseMouseSettings = {
    insideNgZone: true
  };

  @Output()
  public useMouse = new EventEmitter<UseMouseReturn>();

  private get isInsideNgZone(): boolean {
    return this.useMouseSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useMouse(this.useMouseSettings.mouseSettings)
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((entry: UseMouseReturn) => {
          this.useMouse.emit(entry);
        });
    });
  }
}
