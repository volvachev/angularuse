import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useMediaQuery } from '.';

export interface UseMediaQuerySettings {
  mediaQuery: string;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useMediaQuery]',
  standalone: true
})
export class UseMediaQueryDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useMediaQuerySettings!: UseMediaQuerySettings;

  @Output()
  public useMediaQuery = new EventEmitter<boolean>();

  private get isInsideNgZone(): boolean {
    return this.useMediaQuerySettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    if (!this.useMediaQuerySettings?.mediaQuery) {
      return;
    }

    this.runInInjectContext(() => {
      useMediaQuery(this.useMediaQuerySettings.mediaQuery)
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((isMatched: boolean) => {
          this.useMediaQuery.emit(isMatched);
        });
    });
  }
}
