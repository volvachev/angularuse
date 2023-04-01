import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { withZone } from '../../shared/utils/with-zone';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { MemoryInfo, useMemory, UseMemoryOptions } from '.';

export interface UseMemorySettings {
  memoryOptions?: UseMemoryOptions;
  insideNgZone?: boolean;
}

@Directive({
  selector: '[useMemory]',
  standalone: true
})
export class UseMemoryDirective implements AfterViewInit {
  private readonly destroy = useUntilDestroy();
  private readonly zoneTrigger = withZone();
  private readonly runInInjectContext = useRunInInjectContext();

  @Input()
  public useMemorySettings: UseMemorySettings = {
    insideNgZone: true
  };

  @Output()
  public useMemory = new EventEmitter<MemoryInfo | null>();

  private get isInsideNgZone(): boolean {
    return this.useMemorySettings?.insideNgZone ?? true;
  }

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useMemory(this.useMemorySettings.memoryOptions)
        .pipe(this.zoneTrigger(this.isInsideNgZone), this.destroy())
        .subscribe((activeElement: MemoryInfo | null) => {
          this.useMemory.emit(activeElement);
        });
    });
  }
}
