import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useDocumentVisibility } from '.';

export interface UseDocumentVisibilitySettings {
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useDocumentVisibility]',
  standalone: true
})
export class UseDocumentVisibilityDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useDocumentVisibilitySettings: UseDocumentVisibilitySettings = {
    insideNgZone: true
  };

  @Output()
  public useDocumentVisibility = new EventEmitter<DocumentVisibilityState>();

  private get isInsideNgZone(): boolean {
    return this.useDocumentVisibilitySettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useDocumentVisibility()
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((activeElement: DocumentVisibilityState) => {
          this.useDocumentVisibility.emit(activeElement);
        });
    });
  }
}
