import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { _useMutationObserver, UseMutationObserverOptions } from './internal';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';

export interface MutationObserverSettings {
  mutationSettings?: UseMutationObserverOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useMutationObserver]',
  standalone: true
})
export class UseMutationObserverDirective implements AfterViewInit {
  private readonly _useMutationObserver = _useMutationObserver();
  private readonly destroy$ = useUntilDestroy<MutationRecord[] | null>();
  private readonly zoneTrigger = withZone<MutationRecord[] | null>();

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
    this._useMutationObserver(this.useMutationObserverSettings.mutationSettings)
      .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy$)
      .subscribe((entry: MutationRecord[] | null) => {
        this.useMutationObserver.emit(entry);
      });
  }
}
