import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { ElementSize, useElementSize } from '.';
import { withZone } from '../../shared/utils/with-zone';
import { UseResizeObserverOptions } from '../use-resize-observer';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';

export interface ElementSizeSettings {
  resizeSettings?: UseResizeObserverOptions;
  initialSize?: ElementSize;
  insideNgZone?: boolean;
}

const getDefaultSize = (): ElementSize => ({
  width: 0,
  height: 0
});

@Directive({
  selector: '[useElementSize]',
  standalone: true
})
export class UseElementSizeDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useElementSizeSettings: ElementSizeSettings = {
    initialSize: getDefaultSize(),
    insideNgZone: true
  };

  @Output()
  public useElementSize = new EventEmitter<ElementSize>();

  private get isInsideNgZone(): boolean {
    return this.useElementSizeSettings?.insideNgZone ?? true;
  }

  private get initialSize(): ElementSize {
    return this.useElementSizeSettings?.initialSize ?? getDefaultSize();
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useElementSize(this.initialSize, this.useElementSizeSettings.resizeSettings)
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((elementSize: ElementSize) => {
          this.useElementSize.emit(elementSize);
        });
    });
  }
}
