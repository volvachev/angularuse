# useTextSelection

Reactively track user text selection based on [`Window.getSelection`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection).

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { useTextSelection, TEXT_SELECTION } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
})
export class ExampleComponent {
  public testSelection$ = useTextSelection();
  public testSelectionFromDI$ = inject(TEXT_SELECTION);
}
```

```html
<div> selected text from function: {{ testSelection$ | async | json }}</div>
<div> selected text from DI: {{ testSelectionFromDI$ | async | json }}</div>
```