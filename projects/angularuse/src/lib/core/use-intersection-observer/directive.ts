import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { UseIntersectionObserverOptions } from './internal';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { mergeMap } from 'rxjs';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useIntersectionObserver } from '.';

export interface IntersectionObserverSettings {
  intersectionSettings?: UseIntersectionObserverOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useIntersectionObserver]',
  standalone: true
})
export class UseIntersectionObserverDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useIntersectionObserverSettings: IntersectionObserverSettings = {
    insideNgZone: true
  };

  @Output()
  public useIntersectionObserver = new EventEmitter<IntersectionObserverEntry>();

  private get isInsideNgZone(): boolean {
    return this.useIntersectionObserverSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useIntersectionObserver(this.useIntersectionObserverSettings.intersectionSettings)
        .pipe(
          this.zoneTrigger(this.isInsideNgZone),
          mergeMap((entry: IntersectionObserverEntry[]) => entry),
          this.destroy()
        )
        .subscribe((entry: IntersectionObserverEntry) => {
          this.useIntersectionObserver.emit(entry);
        });
    });
  }
}
