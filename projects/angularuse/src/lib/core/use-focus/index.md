# useFocus

Reactive utility to track the focus state of a DOM element. State changes to reflect whether the target element is the focused element.


## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { useFocus, IS_FOCUSED } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public focus$ = useFocus();
  public focusFromDI$ = inject(IS_FOCUSED);
}
```

```html
<div> isFocused from function: {{ (focus$ | async) }}</div>
<div> isFocused from DI: {{ (focusFromDI$ | async) }}</div>
```

### Directive example

Setting reactive value from the outside will trigger `focus` and `blur` events for `true` and `false` values respectively.
Emits `boolean` when the element is focused or not.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseFocusDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <textarea (listenUseFocus)="listenUseFocus($event)"></textarea>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseFocusDirective],
})
export class ExampleComponent {
  public listenUseFocus(event: boolean): void {
    console.log(event);
  }
}
```

### Host directive example

Setting reactive value from the outside will trigger `focus` and `blur` events for `true` and `false` values respectively.
Emits `boolean` when the element is focused or not.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseFocusDirective } from '@volvachev/angularuse';

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
      directive: UseFocusDirective,
      inputs: ['focused'],
      outputs: ['useFocus'],
    },
  ]
})
export class ExampleComponent {
  @HostListener('useFocus', ['$event'])
  public listenUseFocus(isFocused: boolean) {
    console.log(isFocused);
  }
}
```

```html
<app-example [focused]="false" (useFocus)="listenUseFocus($event)"></app-example>
```