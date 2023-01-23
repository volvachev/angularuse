# useElementVisibility

Tracks the visibility of an element within the viewport.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { useElementVisibility, ELEMENT_VISIBILITY } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public isElementVisible$ = useElementVisibility();
  public isElementVisibleFromDI$ = inject(ELEMENT_VISIBILITY);
}
```

```html
<div> is element visible from function: {{ (isElementVisible$ | async)}}</div>
<div> is element visible from DI: {{ (isElementVisibleFromDI$ | async) }}</div>
```

### Directive example

Emits `boolean` when the element is visible or not.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseElementVisibilityDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" [useElementVisibilitySettings]="{insideNgZone: false}" (useElementVisibility)="listenUseElementVisibility($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseElementVisibilityDirective],
})
export class ExampleComponent {
  public listenUseElementVisibility(event: boolean): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `boolean` when the element is visible or not.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseElementVisibilityDirective } from '@volvachev/angularuse';

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
      directive: UseElementVisibilityDirective,
      inputs: ['useElementVisibilitySettings'],
      outputs: ['useElementVisibility'],
    },
  ]
})
export class ExampleComponent {
  @HostListener('useElementVisibility', ['$event'])
  public listenUseElementVisibility(event: boolean) {
    console.log(event);
  }
}
```

```html
<app-example [useElementVisibilitySettings]="{insideNgZone: false, visibilitySettings: {debounceTime: 100, scrollTarget: htmlRef}}" (useElementVisibility)="listenUseElementVisibility($event)"></app-example>

<div #htmlRef style="width: 700px;height: 400px;border: 1px solid black; overflow: scroll">
	<div style="width: 700px;height: 4000px;border: 1px solid red;"> scroll example</div>
</div>
```