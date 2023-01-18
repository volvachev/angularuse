# useMediaQuery

Reactive [Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Testing_media_queries).
Once you've created a MediaQueryList object, you can check the result of the query or receive notifications when the result changes.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { useMediaQuery } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public isLargeScreen$ = useMediaQuery('(min-width: 1024px)');
  public isPreferredDark$ = useMediaQuery('(prefers-color-scheme: dark)');
}
```

```html
<div> isLargeScreen {{ isLargeScreen$ | async }}</div>
<div> prefersDark {{ isPreferredDark$ | async }}</div>
```