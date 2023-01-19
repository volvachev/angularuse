# useBattery

Reactive [Battery Status API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API), more often referred to as the Battery API, provides information about the system's battery charge level and lets you be notified by events that are sent when the battery level or charging status change.
This can be used to adjust your app's resource usage to reduce battery drain when the battery is low, or to save changes before the battery runs out in order to prevent data loss.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { useBattery, BATTERY_INFO } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [ './example.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
})
export class ExampleComponent {
  public batteryInfo$ = useBattery();
  public batteryInfoFromDI$ = inject(BATTERY_INFO);
}
```

```html
<div> battery info from function: {{ batteryInfo$ | async | json}}</div>
<div> battery info from DI: {{ batteryInfoFromDI$ | async | json}}</div>
```


| State           | Type      | Description                                                       |
| --------------- | --------- | ----------------------------------------------------------------- |
| charging        | `Boolean` | If the device is currently charging.                              |
| chargingTime    | `Number`  | The number of seconds until the device becomes fully charged.     |
| dischargingTime | `Number`  | The number of seconds before the device becomes fully discharged. |
| level           | `Number`  | A number between 0 and 1 representing the current charge level.   |
