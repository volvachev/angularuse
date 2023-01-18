# useNetwork

Reactive [Network status](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API). The Network Information API provides information about the system's connection in terms of general connection type (e.g., 'wifi', 'cellular', etc.).
This can be used to select high definition content or low definition content based on the user's connection.
The entire API consists of the addition of the NetworkInformation interface and a single property to the Navigator interface: Navigator.connection.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { useNetwork, NETWORK_INFORMATION } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
})
export class ExampleComponent {
  public network$ = useNetwork();
  public networkFromDI$ = inject(NETWORK_INFORMATION);
}
```

```html
<div> network information from function: {{ network$ | async | json }}</div>
<div> network information from DI: {{ networkFromDI$ | async | json }}</div>
```