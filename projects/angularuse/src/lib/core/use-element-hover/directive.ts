import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { UseElementHoverOptions } from './internal';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useElementHover } from '.';

export interface UseElementHoverSettings {
  elementHoverOptions?: UseElementHoverOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useElementHover]',
  standalone: true
})
export class UseElementHoverDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useElementHoverSettings: UseElementHoverSettings = {
    insideNgZone: true
  };

  @Output()
  public useElementHover = new EventEmitter<boolean>();

  private get isInsideNgZone(): boolean {
    return this.useElementHoverSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useElementHover(this.useElementHoverSettings.elementHoverOptions)
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((isHovered: boolean) => {
          this.useElementHover.emit(isHovered);
        });
    });
  }
}
