# useInsideZone

RxJs operator, that run subscription function inside NgZone

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';
import { useResizeObserver, useInsideZone, RESIZE_OBSERVER } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public elementSizes$ = useResizeObserver().pipe(
    map(entry => entry[0]),
    useInsideZone(),
  );
  public elementSizesFromDI$ = inject(RESIZE_OBSERVER).pipe(
    map(entry => entry[0]),
    useInsideZone(),
  );
}
```

```html
<div> element size from function: {{ (resizeObserver$ | async)?.contentRect?.width }}</div>
<div> element size from DI: {{ (resizeObserver$ | async)?.contentRect?.width }}</div>
```