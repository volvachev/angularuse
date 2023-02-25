import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { _useMouse, UseMouseOptions, UseMouseReturn } from './internal';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';

export interface UseMouseSettings {
  mouseSettings?: UseMouseOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useMouse]',
  standalone: true
})
export class UseMouseDirective implements AfterViewInit {
  private readonly _useMouseFunction = _useMouse();
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();

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
    this._useMouseFunction(this.useMouseSettings.mouseSettings)
      .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
      .subscribe((entry: UseMouseReturn) => {
        this.useMouse.emit(entry);
      });
  }
}
