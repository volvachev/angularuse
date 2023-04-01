import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useOnline } from '.';

export interface UseOnlineSettings {
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useOnline]',
  standalone: true
})
export class UseOnlineDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useOnlineSettings: UseOnlineSettings = {
    insideNgZone: true
  };

  @Output()
  public useOnline = new EventEmitter<boolean>();

  private get isInsideNgZone(): boolean {
    return this.useOnlineSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useOnline()
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((isOnline: boolean) => {
          this.useOnline.emit(isOnline);
        });
    });
  }
}
