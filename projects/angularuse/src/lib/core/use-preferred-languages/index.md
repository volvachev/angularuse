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