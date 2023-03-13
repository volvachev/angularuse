import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { UseMouseInElementOptions, UseMouseInElementReturn } from './internal';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useMouseInElement } from '.';

export interface UseMouseInElementSettings {
  mouseSettings?: UseMouseInElementOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useMouseInElement]',
  standalone: true
})
export class UseMouseInElementDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

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
    this.runInInjectContext(() => {
      useMouseInElement(this.useMouseInElementSettings.mouseSettings)
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((entry: UseMouseInElementReturn) => {
          this.useMouseInElement.emit(entry);
        });
    });
  }
}
