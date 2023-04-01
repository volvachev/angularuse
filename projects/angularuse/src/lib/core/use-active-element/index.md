# useActiveElement

Reactive `document.activeElement`

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { useActiveElement, ACTIVE_ELEMENT } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public activeElement$ = useActiveElement();
  public activeElementFromDI$ = inject(ACTIVE_ELEMENT);
}
```

```html
<div> activeElement from function: {{ (activeElement$ | async) | json }}</div>
<div> activeElement from DI: {{ (activeElementFromDI$ | async) | json }}</div>
```

### Directive example

Emits `Element` or `null` when active element changed.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseActiveElementDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (useActiveElement)="handler($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseActiveElementDirective],
})
export class ExampleComponent {
  public handler(event: Element | null): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `Element` or `null` when active element changed.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseActiveElementDirective } from '@volvachev/angularuse';

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
      directive: UseActiveElementDirective,
      inputs: ['useActiveElementSettings'],
      outputs: ['useActiveElement'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useActiveElement', ['$event'])
  public listenUseActiveElement(event: Element | null) {
    console.log(event);
  }
}
```

```html
<app-example [useActiveElementSettings]="{insideNgZone: false}" (useActiveElement)="listenUseActiveElement($event)"></app-example>
```