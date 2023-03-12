import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { UseMousePressedReturn, UseMousePressedOptions } from './internal';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useMousePressed } from '.';

export interface UseMousePressedSettings {
  mouseSettings?: UseMousePressedOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useMousePressed]',
  standalone: true
})
export class UseMousePressedDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useMousePressedSettings: UseMousePressedSettings = {
    insideNgZone: true
  };

  @Output()
  public useMousePressed = new EventEmitter<UseMousePressedReturn>();

  private get isInsideNgZone(): boolean {
    return this.useMousePressedSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useMousePressed(this.useMousePressedSettings.mouseSettings)
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((entry: UseMousePressedReturn) => {
          this.useMousePressed.emit(entry);
        });
    });
  }
}
