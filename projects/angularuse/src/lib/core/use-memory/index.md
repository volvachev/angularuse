# useMemory

Reactive Memory Info.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { useMemory, MEMORY_INFO } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public memoryInfo$ = useMemory();
  public memoryInfoFromDI$ = inject(MEMORY_INFO);

  public size(v: number): string {
    const kb = v / 1024 / 1024
    return `${kb.toFixed(2)} MB`
  }
}
```

```html
<ng-container *ngIf="(memoryInfo$ | async) as memory">
	<div> memoryInfo$ usedJSHeapSize {{ size(memory.usedJSHeapSize) }}</div>
	<div> memoryInfo$ totalJSHeapSize {{ size(memory.totalJSHeapSize) }}</div>
	<div> memoryInfo$ jsHeapSizeLimit {{ size(memory.jsHeapSizeLimit) }}</div>
</ng-container>

<ng-container *ngIf="(memoryInfoFromDI$ | async) as memory">
	<div> memoryInfoFromDI$ usedJSHeapSize {{ size(memory.usedJSHeapSize) }}</div>
	<div> memoryInfoFromDI$ totalJSHeapSize {{ size(memory.totalJSHeapSize) }}</div>
	<div> memoryInfoFromDI$ jsHeapSizeLimit {{ size(memory.jsHeapSizeLimit) }}</div>
</ng-container>
```