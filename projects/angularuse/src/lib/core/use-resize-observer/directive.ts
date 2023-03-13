import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { UseResizeObserverOptions } from './internal';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { mergeMap } from 'rxjs';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useResizeObserver } from '.';

export interface ResizeObserverSettings {
  resizeSettings?: UseResizeObserverOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useResizeObserver]',
  standalone: true
})
export class UseResizeObserverDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useResizeObserverSettings: ResizeObserverSettings = {
    insideNgZone: true
  };

  @Output()
  public useResizeObserver = new EventEmitter<ResizeObserverEntry>();

  private get isInsideNgZone(): boolean {
    return this.useResizeObserverSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useResizeObserver(this.useResizeObserverSettings.resizeSettings)
        .pipe(
          this.zoneTrigger(this.isInsideNgZone),
          mergeMap((entry: ResizeObserverEntry[]) => entry),
          this.destroy()
        )
        .subscribe((entry: ResizeObserverEntry) => {
          this.useResizeObserver.emit(entry);
        });
    });
  }
}
