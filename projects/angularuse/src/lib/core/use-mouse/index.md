# useMouse

Reactive mouse position.
Touch is enabled by default. To only detect mouse changes, set touch to false. The dragover event is used to track mouse position while dragging.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject, HostBinding } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { useMouse } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
})
export class ExampleComponent {
  public useMouse$ = useMouse();
}
```

```html
<div> mouse event from function: {{ useMouse$ | async | json }}</div>
```

### Directive example

Emits `UseMouseReturn` when mouse moved.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseMouseDirective, UseMouseReturn } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;"
          (useMouse)="handler($event)">
          test
     </div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseMouseDirective],
})
export class ExampleComponent {
  public handler(event: UseMouseReturn): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `UseMouseReturn` when mouse moved.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseMouseDirective, UseMouseReturn } from '@volvachev/angularuse';

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
      directive: UseMouseDirective,
      inputs: ['useMouseSettings'],
      outputs: ['useMouse'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useMouse', ['$event'])
  public listenUseMouse(event: UseMouseReturn) {
    console.log(event);
  }
}
```

```html
<app-example [useMouseSettings]="{insideNgZone: false}" (useMouse)="listenUseMouse($event)"></app-example>
```