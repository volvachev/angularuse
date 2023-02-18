# useIntersectionObserver

Detects that a target element's visibility.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';
import { useIntersectionObserver, INTERSECTION_OBSERVER } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public intersectionObserver$ = useIntersectionObserver().pipe(
    map(entry => entry[0]),
  );
  public intersectionObserverFromDI$ = inject(INTERSECTION_OBSERVER).pipe(
    map(entry => entry[0]),
  );
}
```

```html
<div> is intersect from function: {{ (intersectionObserver$ | async)?.isIntersecting }}</div>
<div> is intersect from DI: {{ (intersectionObserverFromDI$ | async)?.isIntersecting }}</div>
```

### Directive example

Emits `IntersectionObserverEntry` when a intersection is detected for that element.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseIntersectionObserverDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (useIntersectionObserver)="handler($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseIntersectionObserverDirective],
})
export class ExampleComponent {
  public handler(event: IntersectionObserverEntry): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `IntersectionObserverEntry` when a intersection is detected for that element.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseIntersectionObserverDirective } from '@volvachev/angularuse';

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
      directive: UseIntersectionObserverDirective,
      inputs: ['useIntersectionObserverSettings'],
      outputs: ['useIntersectionObserver'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useIntersectionObserver', ['$event'])
  public listenUseIntersectionObserver(event: IntersectionObserverEntry) {
    console.log(event);
  }
}
```

```html
<app-example [useIntersectionObserverSettings]="{insideNgZone: false}" (useIntersectionObserver)="listenUseIntersectionObserver($event)"></app-example>
```