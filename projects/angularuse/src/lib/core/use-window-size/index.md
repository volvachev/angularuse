# useWindowSize

Reactive window size

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { useWindowSize, WINDOW_SIZE } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
})
export class ExampleComponent {
  public windowSize$ = useWindowSize();
  public windowSizeFromDI$ = inject(WINDOW_SIZE);
}
```

```html
<div> window size from function: {{ windowSize$ | async | json }}</div>
<div> window size from DI: {{ windowSizeFromDI$ | async | json }}</div>
```

### Directive example

Emits `WindowSize` when window size changed.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseWindowSizeDirective, WindowSize } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (useWindowSize)="handler($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseWindowSizeDirective],
})
export class ExampleComponent {
  public handler(event: WindowSize): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `WindowSize` when window size changed.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseWindowSizeDirective, WindowSize } from '@volvachev/angularuse';

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
      directive: UseWindowSizeDirective,
      inputs: ['useWindowSizeSettings'],
      outputs: ['useWindowSize'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useWindowSize', ['$event'])
  public listenUseWindowSize(event: WindowSize) {
    console.log(event);
  }
}
```

```html
<app-example [useWindowSizeSettings]="{insideNgZone: false}" (useWindowSize)="listenUseWindowSize($event)"></app-example>
```