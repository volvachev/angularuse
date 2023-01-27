# useActiveElement

Reactive `document.activeElement`

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { useActiveElement, ACTIVE_ELEMENT } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public activeElement$ = useActiveElement();
  public activeElementFromDI$ = inject(ACTIVE_ELEMENT);
}
```

```html
<div> activeElement from function: {{ (activeElement$ | async) | json }}</div>
<div> activeElement from DI: {{ (activeElementFromDI$ | async) | json }}</div>
```