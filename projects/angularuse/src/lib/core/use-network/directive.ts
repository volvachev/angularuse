import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { NetworkInformation, useNetwork } from '.';

export interface UseNetworkSettings {
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useNetwork]',
  standalone: true
})
export class UseNetworkDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useNetworkSettings: UseNetworkSettings = {
    insideNgZone: true
  };

  @Output()
  public useNetwork = new EventEmitter<NetworkInformation>();

  private get isInsideNgZone(): boolean {
    return this.useNetworkSettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useNetwork()
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((networkInformation: NetworkInformation) => {
          this.useNetwork.emit(networkInformation);
        });
    });
  }
}
