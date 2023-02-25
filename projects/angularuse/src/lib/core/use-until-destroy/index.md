# useUntilDestroy

RxJs operator, which automatically unsubscribes from the `Observable` on hook `OnDestroy`.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { interval, map } from 'rxjs';
import { useUntilDestroy, useResizeObserver } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent implements OnInit {
  public destroy = useUntilDestroy();
  public elementSizes$ = useResizeObserver().pipe(
    map(entry => entry[0]),
    this.destroy(),
  );

  public ngOnInit(): void {
    this.elementSizes$
      .subscribe((entry) => {
        console.log(entry);
      });

    interval(1000).pipe(
      this.destroy()
    ).subscribe((value) => {
      console.log(value);
    });
  }
}
```