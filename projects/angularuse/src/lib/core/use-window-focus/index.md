# useWindowFocus

Reactively track window focus with `window.onfocus` and `window.onblur` events.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject, } from '@angular/core';
import { useWindowFocus, WINDOW_IS_FOCUSED } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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