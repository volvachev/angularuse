import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { UseTextDirectionOptions, UseTextDirectionValue } from './internal';
import { useUntilDestroy } from '../use-until-destroy';
import { useRunInInjectContext } from '../../shared/utils/environment-injector';
import { useTextDirection } from '.';

@Directive({
  selector: '[useTextDirection]',
  standalone: true
})
export class UseTextDirectionDirective implements AfterViewInit {
  private readonly runInInjectContext = useRunInInjectContext();
  private readonly destroy = useUntilDestroy();

  @Input()
  public useTextDirectionSettings: UseTextDirectionOptions = {
    selector: 'self'
  };

  @Output()
  public useTextDirection = new EventEmitter<UseTextDirectionValue>();

  public ngAfterViewInit(): void {
    this.runInInjectContext(() => {
      useTextDirection(this.useTextDirectionSettings)
        .pipe(this.destroy())
        .subscribe((textDirection: UseTextDirectionValue) => {
          this.useTextDirection.emit(textDirection);
        });
    });
  }
}
