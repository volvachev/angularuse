# usePreferredColorScheme

Reactive [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { usePreferredColorScheme, COLOR_SCHEMA } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public colorScheme$ = usePreferredColorScheme();
  public colorSchemeFromDI$ = inject(COLOR_SCHEMA);
}
```

```html
<div> color: {{ colorScheme$ | async }}</div>
<div> color from di: {{ colorSchemeFromDI$ | async }}</div>
```

### Directive example

Emits `ColorSchemeType` when triggered media query.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UsePreferredColorSchemeDirective, ColorSchemeType } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (usePreferredColorScheme)="handler($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UsePreferredColorSchemeDirective],
})
export class ExampleComponent {
  public handler(event: ColorSchemeType): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `ColorSchemeType` when triggered media query.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UsePreferredColorSchemeDirective, ColorSchemeType } from '@volvachev/angularuse';

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
      directive: UsePreferredColorSchemeDirective,
      inputs: ['usePreferredColorSchemeSettings'],
      outputs: ['usePreferredColorScheme'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('usePreferredColorScheme', ['$event'])
  public listenUsePreferredColorScheme(event: ColorSchemeType) {
    console.log(event);
  }
}
```

```html
<app-example [usePreferredColorSchemeSettings]="{insideNgZone: false}" (usePreferredColorScheme)="listenUsePreferredColorScheme($event)"></app-example>
```