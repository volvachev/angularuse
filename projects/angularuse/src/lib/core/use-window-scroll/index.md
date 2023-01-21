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