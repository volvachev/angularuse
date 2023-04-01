# useTextSelection

Reactively track user text selection based on [`Window.getSelection`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection).

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { useTextSelection, TEXT_SELECTION } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
})
export class ExampleComponent {
  public testSelection$ = useTextSelection();
  public testSelectionFromDI$ = inject(TEXT_SELECTION);
}
```

```html
<div> selected text from function: {{ testSelection$ | async | json }}</div>
<div> selected text from DI: {{ testSelectionFromDI$ | async | json }}</div>
```

### Directive example

Emits `UseTextSelection` when `selectionchange` triggered.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseTextSelectionDirective, UseTextSelection } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (useTextSelection)="handler($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseTextSelectionDirective],
})
export class ExampleComponent {
  public handler(event: UseTextSelection): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `UseTextSelection` when `selectionchange` triggered.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseTextSelectionDirective, UseTextSelection } from '@volvachev/angularuse';

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
      directive: UseTextSelectionDirective,
      inputs: ['useTextSelectionSettings'],
      outputs: ['useTextSelection'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useTextSelection', ['$event'])
  public listenUseTextSelection(event: UseTextSelection) {
    console.log(event);
  }
}
```

```html
<app-example [useTextSelectionSettings]="{insideNgZone: false}" (useTextSelection)="listenUseTextSelection($event)"></app-example>
```