# useDocumentVisibility

Reactively track document.visibilityState

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { useDocumentVisibility, DOCUMENT_IS_VISIBLE } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public documentVisible$ = useDocumentVisibility();
  public documentVisibleFromDI$ = inject(DOCUMENT_IS_VISIBLE);
}
```

```html
<div> document visible from function: {{ documentVisible$ | async }}</div>
<div> document visible from DI: {{ documentVisibleFromDI$ | async }}</div>
```