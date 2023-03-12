# usePageLeave

Reactive state to show whether the mouse leaves the page.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { usePageLeave, PAGE_LEAVE } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public pageLeave$ = usePageLeave();
  public pageLeaveFromDI$ = inject(PAGE_LEAVE);
}
```

```html
<div> leave from page: {{ pageLeave$ | async }}</div>
<div> leave from page (from di): {{ pageLeaveFromDI$ | async }}</div>
```

### Directive example

Emits `boolean` whether the mouse leaves the page.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UsePageLeaveDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (usePageLeave)="handler($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UsePageLeaveDirective],
})
export class ExampleComponent {
  public handler(event: boolean): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `boolean` whether the mouse leaves the page.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UsePageLeaveDirective } from '@volvachev/angularuse';

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
      directive: UsePageLeaveDirective,
      inputs: ['usePageLeaveSettings'],
      outputs: ['usePageLeave'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('usePageLeave', ['$event'])
  public listenUsePageLeave(event: boolean) {
    console.log(event);
  }
}
```

```html
<app-example [usePageLeaveSettings]="{insideNgZone: false}" (usePageLeave)="listenUsePageLeave($event)"></app-example>
```