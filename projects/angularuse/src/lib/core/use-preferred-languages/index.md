# usePreferredLanguages

Reactive [Navigator Languages](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages). It provides web developers with information about the user's preferred languages.
For example, this may be useful to adjust the language of the user interface based on the user's preferred languages in order to provide better experience.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { usePreferredLanguages, PREFERRED_LANGUAGES } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public preferredLanguage$ = usePreferredLanguages();
  public preferredLanguageFromDI$ = inject(PREFERRED_LANGUAGES);
}
```

```html
<div> preferred language from function: {{ preferredLanguage$ | async }}</div>
<div> preferred language from DI: {{ preferredLanguageFromDI$ | async }}</div>
```

### Directive example

Emits `readonly string[]` when preferred language changed.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UsePreferredLanguagesDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (usePreferredLanguages)="handler($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UsePreferredLanguagesDirective],
})
export class ExampleComponent {
  public handler(event: ReadonlyArray<string>): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `readonly string[]` when preferred language changed.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UsePreferredLanguagesDirective } from '@volvachev/angularuse';

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
      directive: UsePreferredLanguagesDirective,
      inputs: ['usePreferredLanguagesSettings'],
      outputs: ['usePreferredLanguages'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('usePreferredLanguages', ['$event'])
  public listenUsePreferredLanguages(event: ReadonlyArray<string>) {
    console.log(event);
  }
}
```

```html
<app-example [usePreferredLanguagesSettings]="{insideNgZone: false}" (usePreferredLanguages)="listenUsePreferredLanguages($event)"></app-example>
```