import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { UseMutationObserverOptions } from './internal';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useMutationObserver } from '.';

export interface MutationObserverSettings {
  mutationSettings?: UseMutationObserverOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useMutationObserver]',
  standalone: true
})
export class UseMutationObserverDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useMutationObserverSettings: MutationObserverSettings = {
    insideNgZone: true
  };

  @Output()
  public useMutationObserver = new EventEmitter<MutationRecord[] | null>();

  private get isInsideNgZone(): boolean {
    return this.useMutationObserverSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useMutationObserver(this.useMutationObserverSettings.mutationSettings)
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((entry: MutationRecord[] | null) => {
          this.useMutationObserver.emit(entry);
        });
    });
  }
}
