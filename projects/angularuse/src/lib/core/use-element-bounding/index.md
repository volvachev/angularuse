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

The directive has 3 attributes for settings.

| State            | Type                             | Description                   | Default behavior |
|------------------|----------------------------------|-------------------------------|------------------|
| withWindowResize | `string` value `true` or `false` | Listen to window resize event | off              |
| withWindowScroll | `string` value `true` or `false` | Listen to window scroll event | off              |
| withNgZone       | `string` value `true` or `false` | Run listeners inside zone     | off              |


```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { UseElementBoundingDirective, UseElementBounding } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
      <div withNgZone="true" withWindowScroll withWindowResize="false" (useElementBounding)="boundingHandler($event)"></div>
  `,
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseElementBoundingDirective],
})
export class ExampleComponent {
  public boundingHandler(event: UseElementBounding): void {
    console.log('event', event);
  }
}
```