# useMousePressed

Reactive mouse pressing state. Triggered by `mousedown` `touchstart` on target element and released by `mouseup` `mouseleave` `touchend` `touchcancel` on window.

To only capture `mousedown` and `touchstart` on specific element, you can specify `target` by passing a ref of the element.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject, HostBinding } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { useMousePressed } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
})
export class ExampleComponent {
  public useMousePressed$ = useMousePressed();
}
```

```html
<div> mouse clicked from function: {{ useMousePressed$ | async | json }}</div>
```

### Directive example

Emits `UseMousePressedReturn` when mouse pressed.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseMousePressedDirective, UseMousePressedReturn } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;"
          (useMousePressed)="handler($event)">
          test
     </div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseMousePressedDirective],
})
export class ExampleComponent {
  public handler(event: UseMousePressedReturn): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `UseMousePressedReturn` when mouse pressed.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseMousePressedDirective, UseMousePressedReturn } from '@volvachev/angularuse';

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
      directive: UseMousePressedDirective,
      inputs: ['useMousePressedSettings'],
      outputs: ['useMousePressed'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useMousePressed', ['$event'])
  public listenUseMousePressed(event: UseMousePressedReturn) {
    console.log(event);
  }
}
```

```html
<app-example [useMousePressedSettings]="{insideNgZone: false}" (useMousePressed)="listenUseMousePressed($event)"></app-example>
```