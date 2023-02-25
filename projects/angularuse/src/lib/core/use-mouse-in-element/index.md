# useMouseInElement

Reactive mouse position related to an element

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject, HostBinding } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { useMouseInElement } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
})
export class ExampleComponent {
  public useMouseInElement$ = useMouseInElement();
}
```

```html
<div> mouse event from function: {{ useMouseInElement$ | async | json }}</div>
```

### Directive example

Emits `UseMouseInElementReturn` when mouse moved.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseMouseInElementDirective, UseMouseReturn } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;"
          (useMouseInElement)="handler($event)">
          test
     </div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseMouseInElementDirective],
})
export class ExampleComponent {
  public handler(event: UseMouseInElementReturn): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `UseMouseInElementReturn` when mouse moved.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseMouseInElementDirective, UseMouseInElementReturn } from '@volvachev/angularuse';

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
      directive: UseMouseInElementDirective,
      inputs: ['useMouseInElementSettings'],
      outputs: ['useMouseInElement'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useMouseInElement', ['$event'])
  public listenUseMouseInElement(event: UseMouseInElementReturn) {
    console.log(event);
  }
}
```

```html
<app-example [useMouseInElementSettings]="{insideNgZone: false}" (useMouseInElement)="listenUseMouseInElement($event)"></app-example>
```