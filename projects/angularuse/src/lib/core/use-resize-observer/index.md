# useResizeObserver

Reports changes to the dimensions of an Element's content or the border-box

Careful, you should use `detectChanges` or `useInsideZone`, for changes runtime inside the template.

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
  public resizeObserver$ = useResizeObserver().pipe(
    map(entry => entry[0]),
    useInsideZone(),
  );
  public resizeObserverFromDI$ = inject(RESIZE_OBSERVER).pipe(
    map(entry => entry[0]),
    useInsideZone(),
  );
}
```

```html
<div> resize changes from function: {{ (resizeObserver$ | async)?.contentRect?.width }}</div>
<div> resize changes from DI: {{ (resizeObserverFromDI$ | async)?.contentRect?.width }}</div>
```

### Directive example

Emits `ResizeObserverEntry` when a resize is detected for that element.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseResizeObserverDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (useResizeObserver)="resizeHandler($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseResizeObserverDirective],
})
export class ExampleComponent {
  public resizeHandler(event: ResizeObserverEntry): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `ResizeObserverEntry` when a resize is detected for that element.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseResizeObserverDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
      <div style="width: 300px;height: 300px;border: 1px solid black;">example</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  hostDirectives: [
    {
      directive: UseResizeObserverDirective,
      inputs: ['useResizeObserverSettings'],
      outputs: ['useResizeObserver'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useResizeObserver', ['$event'])
  public listenUseResizeObserver(event: ResizeObserverEntry) {
    console.log(event);
  }
}
```

```html
<app-example [useResizeObserverSettings]="{insideNgZone: false}" (useResizeObserver)="resizeHandler($event)"></app-example>
```