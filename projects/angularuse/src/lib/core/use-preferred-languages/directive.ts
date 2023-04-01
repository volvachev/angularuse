import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { usePreferredLanguages } from '.';

export interface UsePreferredLanguagesSettings {
  insideNgZone?: boolean;
}

@Directive({
  selector: '[usePreferredLanguages]',
  standalone: true
})
export class UsePreferredLanguagesDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public usePreferredLanguagesSettings: UsePreferredLanguagesSettings = {
    insideNgZone: true
  };

  @Output()
  public usePreferredLanguages = new EventEmitter<ReadonlyArray<string>>();

  private get isInsideNgZone(): boolean {
    return this.usePreferredLanguagesSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      usePreferredLanguages()
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((languages: ReadonlyArray<string>) => {
          this.usePreferredLanguages.emit(languages);
        });
    });
  }
}
