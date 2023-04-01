# useMediaQuery

Reactive [Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Testing_media_queries).
Once you've created a MediaQueryList object, you can check the result of the query or receive notifications when the result changes.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { useMediaQuery } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public isLargeScreen$ = useMediaQuery('(min-width: 1024px)');
  public isPreferredDark$ = useMediaQuery('(prefers-color-scheme: dark)');
}
```

```html
<div> isLargeScreen {{ isLargeScreen$ | async }}</div>
<div> prefersDark {{ isPreferredDark$ | async }}</div>
```

### Directive example

Emits `boolean` when media query matched.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseMediaQueryDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (useMediaQuery)="handler($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseMediaQueryDirective],
})
export class ExampleComponent {
  public handler(event: boolean): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `boolean` when media query matched.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseMediaQueryDirective } from '@volvachev/angularuse';

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
      directive: UseMediaQueryDirective,
      inputs: ['useMediaQuerySettings'],
      outputs: ['useMediaQuery'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useMediaQuerySettings', ['$event'])
  public listenUseMediaQuery(event: boolean) {
    console.log(event);
  }
}
```

```html
<app-example [useMediaQuerySettings]="{insideNgZone: false}" (useMediaQuery)="listenUseMediaQuery($event)"></app-example>
```