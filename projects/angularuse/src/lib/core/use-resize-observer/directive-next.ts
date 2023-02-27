import { AfterViewInit, Directive, effect, EventEmitter, inject, Input, NgZone, Output } from '@angular/core';
import { _useResizeObserverNext, UseResizeObserverOptions } from './internal-next';

export interface ResizeObserverNextSettings {
  resizeSettings?: UseResizeObserverOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useResizeObserverNext]',
  standalone: true
})
export class UseResizeObserverNextDirective implements AfterViewInit {
  private readonly _useResizeObserver = _useResizeObserverNext();
  private readonly zone = inject(NgZone);

  @Input()
  public useResizeObserverNextSettings: ResizeObserverNextSettings = {
    insideNgZone: true
  };

  @Output()
  public useResizeObserverNext = new EventEmitter<ResizeObserverEntry>();

  private get isInsideNgZone(): boolean {
    return this.useResizeObserverNextSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    const resizeSignal = this._useResizeObserver(this.useResizeObserverNextSettings.resizeSettings);

    effect(() => {
      const callback = () => {
        resizeSignal().forEach(resize => {
          this.useResizeObserverNext.emit(resize);
        });
      };

      if (this.isInsideNgZone) {
        this.zone.run(callback);
      } else {
        callback();
      }
    });
  }
}
