import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useWindowSize, UseWindowSizeOptions, WindowSize } from '.';

export interface UseWindowSizeSettings {
  windowSizeOptions?: UseWindowSizeOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useWindowSize]',
  standalone: true
})
export class UseWindowSizeDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useWindowSizeSettings: UseWindowSizeSettings = {
    insideNgZone: true
  };

  @Output()
  public useWindowSize = new EventEmitter<Readonly<WindowSize>>();

  private get isInsideNgZone(): boolean {
    return this.useWindowSizeSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useWindowSize(this.useWindowSizeSettings.windowSizeOptions)
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((windowSize: Readonly<WindowSize>) => {
          this.useWindowSize.emit(windowSize);
        });
    });
  }
}
