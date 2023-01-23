# UseElementBounding

Reactive [bounding box](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) of an HTML element

## Usage

### inject function example

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { useElementBounding, ELEMENT_BOUNDING } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
})
export class ExampleComponent {
  public elementBounding$ = useElementBounding();
  public elementBoundingFromDI$ = inject(ELEMENT_BOUNDING);
}
```

```html
<div> box position from function: {{ elementBounding$ | async | json }}</div>
<div> box position from DI: {{ elementBoundingFromDI$ | async | json }}</div>
```

### Directive example

Emits `DOMRect` object.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseElementBoundingDirective, UseElementBounding } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" [useElementBoundingSettings]="{insideNgZone: false}" (useElementBounding)="listenUseElementBounding($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseElementBoundingDirective],
})
export class ExampleComponent {
  public listenUseElementBounding(event: UseElementBounding): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `DOMRect` object.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseElementBoundingDirective, UseElementBounding } from '@volvachev/angularuse';

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
      directive: UseElementBoundingDirective,
      inputs: ['useElementBoundingSettings'],
      outputs: ['useElementBounding'],
    },
  ]
})
export class ExampleComponent {
  @HostListener('useElementBounding', ['$event'])
  public listenUseElementBounding(event: UseElementBounding) {
    console.log(event);
  }
}
```

```html
<app-example [useElementBoundingSettings]="{insideNgZone: false}" (useElementBounding)="listenUseElementSize($event)"></app-example>
```