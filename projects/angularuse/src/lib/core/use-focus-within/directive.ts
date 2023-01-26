import { AfterViewInit, Directive, ElementRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { useUntilDestroy } from '../use-until-destroy';
import { useFocusWithin } from '.';
import { MonoTypeOperatorFunction, Subject, withLatestFrom } from 'rxjs';

@Directive({
  selector: '[useFocusWithin]',
  standalone: true
})
export class UseFocusWithinDirective implements AfterViewInit {
  private readonly isFocused$ = useFocusWithin();
  private readonly element: HTMLElement = inject(ElementRef).nativeElement;
  private readonly destroy$ = useUntilDestroy<boolean>();
  private readonly focusCommand = new Subject<boolean>();

  /**
   * If read as true, then the element has focus. If read as false, then the element does not have focus
   * If set to true, then the element will be focused. If set to false, the element will be blurred.
   */
  @Input()
  public set focused(value: boolean) {
    this.focusCommand.next(value);
  }

  @Output()
  public useFocusWithin = new EventEmitter<boolean>();

  public ngAfterViewInit(): void {
    this.isFocused$.pipe(this.destroy$).subscribe((isFocused: boolean) => {
      this.useFocusWithin.emit(isFocused);
    });

    this.focusCommand
      .asObservable()
      .pipe(withLatestFrom(this.isFocused$), this.destroy$ as unknown as MonoTypeOperatorFunction<[boolean, boolean]>)
      .subscribe(([focusCommand, isFocused]) => {
        if (!focusCommand && isFocused) {
          this.element.blur();
        }

        if (focusCommand && !isFocused) {
          this.element.focus();
        }
      });
  }
}
