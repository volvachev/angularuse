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