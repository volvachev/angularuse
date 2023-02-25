import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { _useMouseInElement, UseMouseInElementOptions, UseMouseInElementReturn } from './internal';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';

export interface UseMouseInElementSettings {
  mouseSettings?: UseMouseInElementOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useMouseInElement]',
  standalone: true
})
export class UseMouseInElementDirective implements AfterViewInit {
  private readonly _useMouseInElementFunction = _useMouseInElement();
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();

  @Input()
  public useMouseInElementSettings: UseMouseInElementSettings = {
    insideNgZone: true
  };

  @Output()
  public useMouseInElement = new EventEmitter<UseMouseInElementReturn>();

  private get isInsideNgZone(): boolean {
    return this.useMouseInElementSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this._useMouseInElementFunction(this.useMouseInElementSettings.mouseSettings)
      .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
      .subscribe((entry: UseMouseInElementReturn) => {
        this.useMouseInElement.emit(entry);
      });
  }
}
