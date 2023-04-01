import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { UseTextSelection, useTextSelection } from '.';

export interface UseTextSelectionSettings {
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useTextSelection]',
  standalone: true
})
export class UseTextSelectionDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useTextSelectionSettings: UseTextSelectionSettings = {
    insideNgZone: true
  };

  @Output()
  public useTextSelection = new EventEmitter<UseTextSelection>();

  private get isInsideNgZone(): boolean {
    return this.useTextSelectionSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useTextSelection()
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((textSelection: UseTextSelection) => {
          this.useTextSelection.emit(textSelection);
        });
    });
  }
}
