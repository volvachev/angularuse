# useOutsideZone

RxJs operator, that run subscription function outside NgZone

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject, NgZone } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { useMemory, useOutsideZone, outsideZone } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public memoryInfoWithOutsideZone$ = useMemory().pipe(
    useOutsideZone()
  );
  public memoryInfoWithOutsideZoneFunction$ = useMemory().pipe(
    outsideZone(inject(NgZone))
  );

  public size(v: number): string {
    const kb = v / 1024 / 1024
    return `${kb.toFixed(2)} MB`
  }
}
```

```html
<ng-container *ngIf="(memoryInfoWithOutsideZone$ | async) as memory">
	<div> memoryInfoWithOutsideZone$ usedJSHeapSize {{ size(memory.usedJSHeapSize) }}</div>
	<div> memoryInfoWithOutsideZone$ totalJSHeapSize {{ size(memory.totalJSHeapSize) }}</div>
	<div> memoryInfoWithOutsideZone$ jsHeapSizeLimit {{ size(memory.jsHeapSizeLimit) }}</div>
</ng-container>

<ng-container *ngIf="(memoryInfoWithOutsideZoneFunction$ | async) as memory">
	<div> memoryInfoWithOutsideZoneFunction$ usedJSHeapSize {{ size(memory.usedJSHeapSize) }}</div>
	<div> memoryInfoWithOutsideZoneFunction$ totalJSHeapSize {{ size(memory.totalJSHeapSize) }}</div>
	<div> memoryInfoWithOutsideZoneFunction$ jsHeapSizeLimit {{ size(memory.jsHeapSizeLimit) }}</div>
</ng-container>
```