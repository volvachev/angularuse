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