import { AfterViewInit, Directive, Input } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { Subject } from 'rxjs';
import { _useFavicon, IconType, UseFaviconOptions } from './internal';

@Directive({
  selector: '[useFavicon]',
  standalone: true
})
export class UseFaviconDirective implements AfterViewInit {
  @Input()
  public set useFavicon(icon: IconType) {
    this.faviconStream.next(icon);
  }

  @Input()
  public useFaviconSettings!: UseFaviconOptions;

  private readonly faviconStream = new Subject<IconType>();
  private readonly useFaviconFunction = _useFavicon();
  private readonly destroy = useUntilDestroy();

  public ngAfterViewInit(): void {
    this.useFaviconFunction(this.faviconStream.asObservable(), this.useFaviconSettings)
      .pipe(this.destroy())
      .subscribe();
  }
}
