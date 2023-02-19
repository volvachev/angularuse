import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { _useIntersectionObserver, UseIntersectionObserverOptions } from './internal';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { mergeMap } from 'rxjs';

export interface IntersectionObserverSettings {
  intersectionSettings?: UseIntersectionObserverOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useIntersectionObserver]',
  standalone: true
})
export class UseIntersectionObserverDirective implements AfterViewInit {
  private readonly _useIntersectionObserver = _useIntersectionObserver();
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();

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
    this._useIntersectionObserver(this.useIntersectionObserverSettings.intersectionSettings)
      .pipe(
        this.zoneTrigger(this.isInsideNgZone),
        mergeMap((entry: IntersectionObserverEntry[]) => entry),
        this.destroy()
      )
      .subscribe((entry: IntersectionObserverEntry) => {
        this.useIntersectionObserver.emit(entry);
      });
  }
}
