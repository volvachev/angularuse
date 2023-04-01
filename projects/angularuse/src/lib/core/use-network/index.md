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

### Directive example

Emits `NetworkInformation` when connection status changed.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseNetworkDirective, NetworkInformation } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;" (useNetwork)="handler($event)">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseNetworkDirective],
})
export class ExampleComponent {
  public handler(event: NetworkInformation): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `NetworkInformation` when connection status changed.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseNetworkDirective, NetworkInformation } from '@volvachev/angularuse';

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
      directive: UseNetworkDirective,
      inputs: ['useNetworkSettings'],
      outputs: ['useNetwork'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useNetwork', ['$event'])
  public listenUseNetwork(event: NetworkInformation) {
    console.log(event);
  }
}
```

```html
<app-example [useNetworkSettings]="{insideNgZone: false}" (useNetwork)="listenUseNetwork($event)"></app-example>
```