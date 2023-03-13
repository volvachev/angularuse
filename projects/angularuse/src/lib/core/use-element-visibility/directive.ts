import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { UseElementVisibilityOptions } from './internal';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useElementVisibility } from '.';

export interface UseElementVisibilitySettings {
  visibilitySettings?: UseElementVisibilityOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useElementVisibility]',
  standalone: true
})
export class UseElementVisibilityDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useElementVisibilitySettings: UseElementVisibilitySettings = {
    insideNgZone: true
  };

  @Output()
  public useElementVisibility = new EventEmitter<boolean>();

  private get isInsideNgZone(): boolean {
    return this.useElementVisibilitySettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useElementVisibility(this.useElementVisibilitySettings?.visibilitySettings)
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((isElementVisible: boolean) => {
          this.useElementVisibility.emit(isElementVisible);
        });
    });
  }
}
