# useMutationObserver

Watch for changes being made to the DOM tree. [MutationObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject, HostBinding, OnInit } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { useMutationObserver, MUTATION_OBSERVER } from '@volvachev/angularuse';
import { tap } from 'rxjs';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
})
export class ExampleComponent implements OnInit {
  public mutationObserver$ = useMutationObserver().pipe(tap(console.log));
  public mutationObserverFromDI$ = inject(MUTATION_OBSERVER);

  @HostBinding('class.test')
  public test = false;

  public ngOnInit(): void {
    setTimeout(() => {
      this.test = true;
    }, 3000);

    setTimeout(() => {
      this.test = false;
    }, 6000);
  }
}
```

```html
<div> dom tree changes from function: {{ mutationObserver$ | async | json }}</div>
<div> dom tree changes from DI: {{ mutationObserverFromDI$ | async | json }}</div>
```

### Directive example

Emits `MutationRecord[]` when a dom child tree changes.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseMutationObserverDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div [class]="className" style="width: 300px;height: 300px;border: 1px solid black;"
          (click)="addClass()"
          [useMutationObserverSettings]="{mutationSettings: {attributes: true}}"
          (useMutationObserver)="handler($event)">
          test
     </div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseMutationObserverDirective],
})
export class ExampleComponent {
  public className = '';

  public handler(event: ResizeObserverEntry): void {
    console.log(event);
  }

  public addClass(): void {
    this.className = 'test';
  }
}
```

### Host directive example

Emits `MutationRecord[]` when a dom child tree changes.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseMutationObserverDirective } from '@volvachev/angularuse';

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
      directive: UseMutationObserverDirective,
      inputs: ['useMutationObserverSettings'],
      outputs: ['useMutationObserver'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useMutationObserver', ['$event'])
  public listenUseMutationObserver(event: MutationRecord[] | null) {
    console.log(event);
  }
}
```

```html
<app-example [useMutationObserverSettings]="{insideNgZone: false, mutationSettings: {attributes: true}}" (useMutationObserver)="listenUseMutationObserver($event)"></app-example>
```