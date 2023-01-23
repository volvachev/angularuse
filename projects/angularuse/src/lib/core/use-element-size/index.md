# useElementSize

Reactive size of an HTML element. [ResizeObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { useElementSize, ELEMENT_SIZE, useInsideZone } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
})
export class ExampleComponent {
  public elementSize$ = useElementSize().pipe(
    useInsideZone(),
  );
  public elementSizeFromDI$ = inject(ELEMENT_SIZE).pipe(
    useInsideZone(),
  );
}
```

```html
<div> element size changes from function: {{ (elementSize$ | async) | json}}</div>
<div> element size from DI: {{ (elementSizeFromDI$ | async) | json }}</div>
```

### Directive example

Emits `width` and `height` when a resize is detected for that element.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseElementSizeDirective, ElementSize } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (useElementSize)="listenUseElementSize($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseElementSizeDirective],
})
export class ExampleComponent {
  public listenUseElementSize(event: ElementSize): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `width` and `height` when a resize is detected for that element.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseElementSizeDirective, ElementSize } from '@volvachev/angularuse';

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
      directive: UseElementSizeDirective,
      inputs: ['useElementSizeSettings'],
      outputs: ['useElementSize'],
    },
  ]
})
export class ExampleComponent {
  @HostListener('useElementSize', ['$event'])
  public listenUseElementSize(event: ElementSize) {
    console.log(event);
  }
}
```

```html
<app-example [useElementSizeSettings]="{insideNgZone: false}" (useElementSize)="listenUseElementSize($event)"></app-example>
```