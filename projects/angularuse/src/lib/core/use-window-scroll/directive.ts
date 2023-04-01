import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useWindowScroll } from '.';
import { Position } from '../types';

export interface UseWindowScrollSettings {
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useWindowScroll]',
  standalone: true
})
export class UseWindowScrollDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useWindowScrollSettings: UseWindowScrollSettings = {
    insideNgZone: true
  };

  @Output()
  public useWindowScroll = new EventEmitter<Position>();

  private get isInsideNgZone(): boolean {
    return this.useWindowScrollSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useWindowScroll()
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((position: Position) => {
          this.useWindowScroll.emit(position);
        });
    });
  }
}
