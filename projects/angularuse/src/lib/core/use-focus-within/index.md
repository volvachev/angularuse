# useFocusWithin

Reactive utility to track if an element or one of its decendants has focus. It is meant to match the behavior of the `:focus-within` CSS pseudo-class.
A common use case would be on a form element to see if any of its inputs currently have focus.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { useFocusWithin, IS_FOCUS_WITHIN } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public focusWithin$ = useFocusWithin();
  public focusWithinFromDI$ = inject(IS_FOCUS_WITHIN);
}
```

```html
<div> isFocused from function: {{ (focusWithin$ | async) }}</div>
<div> isFocused from DI: {{ (focusWithinFromDI$ | async) }}</div>
```

### Directive example

Setting reactive value from the outside will trigger `focus` and `blur` events for `true` and `false` values respectively.
Emits `boolean` when the element is focused or not.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseFocusWithinDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <textarea (useFocusWithin)="listenUseFocusWithin($event)"></textarea>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseFocusWithinDirective],
})
export class ExampleComponent {
  public listenUseFocusWithin(event: boolean): void {
    console.log(event);
  }
}
```

### Host directive example

Setting reactive value from the outside will trigger `focus` and `blur` events for `true` and `false` values respectively.
Emits `boolean` when the element is focused or not.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseFocusWithinDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
      <div style="width: 300px;height: 300px;border: 1px solid black;">example</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  hostDirectives: [
    {
      directive: UseFocusWithinDirective,
      inputs: ['focused'],
      outputs: ['useFocusWithin'],
    },
  ]
})
export class ExampleComponent {
  @HostListener('useFocusWithin', ['$event'])
  public listenUseFocusWithin(isFocused: boolean) {
    console.log(isFocused);
  }
}
```

```html
<app-example [focused]="false" (useFocus)="listenUseFocusWithin($event)"></app-example>
```