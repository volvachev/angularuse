import { AfterViewInit, Directive, Input } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { UseTextareaAutosizeOptions } from './internal';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useTextareaAutosize } from '.';

export interface UseTextareaAutosizeSettings {
  textareaAutosizeSettings?: UseTextareaAutosizeOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useTextareaAutosize]',
  standalone: true
})
export class UseTextareaAutosizeDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useTextareaAutosizeSettings: UseTextareaAutosizeSettings = {
    insideNgZone: true
  };

  private get isInsideNgZone(): boolean {
    return this.useTextareaAutosizeSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useTextareaAutosize(this.useTextareaAutosizeSettings.textareaAutosizeSettings)
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe();
    });
  }
}
