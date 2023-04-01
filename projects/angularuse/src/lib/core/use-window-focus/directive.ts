import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useWindowFocus } from '.';

export interface UseWindowFocusSettings {
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useWindowFocus]',
  standalone: true
})
export class UseWindowFocusDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useWindowFocusSettings: UseWindowFocusSettings = {
    insideNgZone: true
  };

  @Output()
  public useWindowFocus = new EventEmitter<boolean>();

  private get isInsideNgZone(): boolean {
    return this.useWindowFocusSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useWindowFocus()
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((isFocused: boolean) => {
          this.useWindowFocus.emit(isFocused);
        });
    });
  }
}
