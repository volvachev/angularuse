# useIdle

Tracks whether the user is being inactive.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { useIdle, USE_IDLE } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public idle$ = useIdle();
  public idleFromDI$ = inject(USE_IDLE);
}
```

```html
<div> user idle from function: {{ (idle$ | async)?.idle }}</div>
<div> user idle from DI: {{ (idleFromDI$ | async)?.idle }}</div>
```

### Directive example

Emits `UseIdleReturn` when user does something on the page.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseIdleDirective, UseIdleReturn } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (useIdle)="handler($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseIdleDirective],
})
export class ExampleComponent {
  public handler(event: UseIdleReturn): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `UseIdleReturn` when user does something on the page.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseIdleDirective, UseIdleReturn } from '@volvachev/angularuse';

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
      directive: UseIdleDirective,
      inputs: ['useIdleSettings'],
      outputs: ['useIdle'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useIdle', ['$event'])
  public listenUseIdle(event: UseIdleReturn) {
    console.log(event);
  }
}
```

```html
<app-example [useIdleSettings]="{insideNgZone: false}" (useIdle)="listenUseIdle($event)"></app-example>
```