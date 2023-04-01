# useDocumentVisibility

Reactively track document.visibilityState

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { useDocumentVisibility, DOCUMENT_IS_VISIBLE } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public documentVisible$ = useDocumentVisibility();
  public documentVisibleFromDI$ = inject(DOCUMENT_IS_VISIBLE);
}
```

```html
<div> document visible from function: {{ documentVisible$ | async }}</div>
<div> document visible from DI: {{ documentVisibleFromDI$ | async }}</div>
```

### Directive example

Emits `DocumentVisibilityState` when `document.visibilityState` changed.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseDocumentVisibilityDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (useDocumentVisibility)="handler($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseDocumentVisibilityDirective],
})
export class ExampleComponent {
  public handler(event: DocumentVisibilityState): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `DocumentVisibilityState` when `document.visibilityState` changed.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseDocumentVisibilityDirective } from '@volvachev/angularuse';

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
      directive: UseDocumentVisibilityDirective,
      inputs: ['useDocumentVisibilitySettings'],
      outputs: ['useDocumentVisibility'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useDocumentVisibility', ['$event'])
  public listenUseDocumentVisibility(event: DocumentVisibilityState) {
    console.log(event);
  }
}
```

```html
<app-example [useDocumentVisibilitySettings]="{insideNgZone: false}" (useDocumentVisibility)="listenUseDocumentVisibility($event)"></app-example>
```