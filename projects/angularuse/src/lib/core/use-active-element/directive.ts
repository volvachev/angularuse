import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useActiveElement } from '.';

export interface UseActiveElementSettings {
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useActiveElement]',
  standalone: true
})
export class UseActiveElementDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useActiveElementSettings: UseActiveElementSettings = {
    insideNgZone: true
  };

  @Output()
  public useActiveElement = new EventEmitter<Element | null>();

  private get isInsideNgZone(): boolean {
    return this.useActiveElementSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useActiveElement()
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((activeElement: Element | null) => {
          this.useActiveElement.emit(activeElement);
        });
    });
  }
}
