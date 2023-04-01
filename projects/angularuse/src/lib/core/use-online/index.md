# useOnline

Reactive online state. A wrapper of `useNetwork`.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { useOnline, ONLINE_STATUS } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public isOnline$ = useOnline();
  public isOnlineFromDI$ = inject(ONLINE_STATUS);
}
```

```html
<div> is online from function: {{ isOnline$ | async }}</div>
<div> is online from DI: {{ isOnlineFromDI$ | async }}</div>
```

### Directive example

Emits `boolean` when online status changed.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseOnlineDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (useOnline)="handler($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseOnlineDirective],
})
export class ExampleComponent {
  public handler(event: boolean): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `boolean` when online status changed.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseOnlineDirective } from '@volvachev/angularuse';

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
      directive: UseOnlineDirective,
      inputs: ['useOnlineSettings'],
      outputs: ['useOnline'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useOnline', ['$event'])
  public listenUseOnline(event: boolean) {
    console.log(event);
  }
}
```

```html
<app-example [useOnlineSettings]="{insideNgZone: false}" (useOnline)="listenUseOnline($event)"></app-example>
```