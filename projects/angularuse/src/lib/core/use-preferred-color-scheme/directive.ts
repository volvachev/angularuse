import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { ColorSchemeType, usePreferredColorScheme } from '.';

export interface UsePreferredColorSchemeSettings {
  insideNgZone?: boolean;
}

@Directive({
  selector: '[usePreferredColorScheme]',
  standalone: true
})
export class UsePreferredColorSchemeDirective implements AfterViewInit {
  private readonly colorScheme$ = usePreferredColorScheme();
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();

  @Input()
  public usePreferredColorSchemeSettings: UsePreferredColorSchemeSettings = {
    insideNgZone: true
  };

  @Output()
  public usePreferredColorScheme = new EventEmitter<ColorSchemeType>();

  private get isInsideNgZone(): boolean {
    return this.usePreferredColorSchemeSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.colorScheme$
      .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
      .subscribe((colorSchema: ColorSchemeType) => {
        this.usePreferredColorScheme.emit(colorSchema);
      });
  }
}
