# useElementHover

Reactive element's hover state.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { useElementHover } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public isHover$ = useElementHover({delayEnter: 300, delayLeave: 100});
}
```

```html
<div> is hover: {{ isHover$ | async }}</div>
```

### Directive example

Emits `boolean` when hovered on element.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseElementHoverDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (useElementHover)="handler($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseElementHoverDirective],
})
export class ExampleComponent {
  public handler(event: boolean): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `boolean` when hovered on element.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseElementHoverDirective } from '@volvachev/angularuse';

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
      directive: UseElementHoverDirective,
      inputs: ['useElementHoverSettings'],
      outputs: ['useElementHover'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useElementHover', ['$event'])
  public listenUseElementHover(event: boolean) {
    console.log(event);
  }
}
```

```html
<app-example [useElementHoverSettings]="{insideNgZone: false}" (useElementHover)="listenUseElementHover($event)"></app-example>
```