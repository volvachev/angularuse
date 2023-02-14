import { AfterViewInit, Directive, Input } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { _useTextareaAutosize, UseTextareaAutosizeOptions } from './internal';

export interface UseTextareaAutosizeSettings {
  textareaAutosizeSettings?: UseTextareaAutosizeOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useTextareaAutosize]',
  standalone: true
})
export class UseTextareaAutosizeDirective implements AfterViewInit {
  private readonly _useTextareaAutosize = _useTextareaAutosize();
  private readonly destroy$ = useUntilDestroy<void>();
  private readonly zoneTrigger = withZone<void>();

  @Input()
  public useTextareaAutosizeSettings: UseTextareaAutosizeSettings = {
    insideNgZone: true
  };

  private get isInsideNgZone(): boolean {
    return this.useTextareaAutosizeSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this._useTextareaAutosize(this.useTextareaAutosizeSettings.textareaAutosizeSettings)
      .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy$)
      .subscribe();
  }
}
