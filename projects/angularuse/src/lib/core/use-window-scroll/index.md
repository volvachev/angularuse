# useWindowScroll

Reactive window scroll

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { useWindowScroll, WINDOW_SCROLL } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
})
export class ExampleComponent {
  public windowScroll$ = useWindowScroll();
  public windowScrollFromDI$ = inject(WINDOW_SCROLL);
}
```

```html
<div> page position from function: {{ windowScroll$ | async | json }}</div>
<div> page position from DI: {{ windowScrollFromDI$ | async | json }}</div>
```

### Directive example

Emits `Position` when scroll changed.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseWindowScrollDirective, Position } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (useWindowScroll)="handler($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseWindowScrollDirective],
})
export class ExampleComponent {
  public handler(event: Position): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `Position` when scroll changed.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseWindowScrollDirective, Position } from '@volvachev/angularuse';

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
      directive: UseWindowScrollDirective,
      inputs: ['useWindowScrollSettings'],
      outputs: ['useWindowScroll'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useWindowScroll', ['$event'])
  public listenUseWindowScroll(event: Position) {
    console.log(event);
  }
}
```

```html
<app-example [useWindowScrollSettings]="{insideNgZone: false}" (useWindowScroll)="listenUseWindowScroll($event)"></app-example>
```