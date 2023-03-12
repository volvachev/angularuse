import { AfterViewInit, Directive, Input } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { Subject } from 'rxjs';
import { IconType, UseFaviconOptions } from './internal';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useFavicon } from '.';

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
  private readonly runInInjectContext = useRunInInjectContext();
  private readonly destroy = useUntilDestroy();

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useFavicon(this.faviconStream.asObservable(), this.useFaviconSettings).pipe(this.destroy()).subscribe();
    });
  }
}
