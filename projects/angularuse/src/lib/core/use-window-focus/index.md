# useWindowFocus

Reactively track window focus with `window.onfocus` and `window.onblur` events.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { useWindowFocus, WINDOW_IS_FOCUSED } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public focus$ = useWindowFocus();
  public focusFromDI$ = inject(WINDOW_IS_FOCUSED);
}
```

```html
<div> focus from function: {{ focus$ | async }}</div>
<div> focus from DI: {{ focusFromDI$ | async }}</div>
```

### Directive example

Emits `boolean` when window focus changed.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseWindowFocusDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (useWindowFocus)="handler($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseWindowFocusDirective],
})
export class ExampleComponent {
  public handler(event: boolean): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `boolean` when window focus changed.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseWindowFocusDirective } from '@volvachev/angularuse';

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
      directive: UseWindowFocusDirective,
      inputs: ['useWindowFocusSettings'],
      outputs: ['useWindowFocus'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useWindowFocus', ['$event'])
  public listenUseWindowFocus(event: boolean) {
    console.log(event);
  }
}
```

```html
<app-example [useWindowFocusSettings]="{insideNgZone: false}" (useWindowFocus)="listenUseWindowFocus($event)"></app-example>
```