# useTextDirection

Reactive [dir](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir) of the element's text.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { useTextDirection } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  public textDirection$ = useTextDirection({selector: 'html', observe: true});
  public textDirection2$ = useTextDirection({selector: 'body', observe: true});
  
  public ngOnInit(): void {
    setTimeout(() => {
      document.querySelector('html')!.setAttribute('dir', 'rtl');
    }, 3000);
  }
}
```

```html
<div> text direction from html tag -  from function: {{ textDirection$ | async }}</div>
<div> text direction from body tag -  from function: {{ textDirection2$ | async }}</div>
```

### Directive example

Emits `UseTextDirectionValue` when `dir` attribute changed from `selector`.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseTextDirectionDirective, UseTextDirectionValue } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div style="width: 300px;height: 300px;border: 1px solid black;"
          [attr.dir]="dir"
          (click)="handle()"
          (useTextDirection)="handler($event)">
          test
     </div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseTextDirectionDirective],
})
export class ExampleComponent {
  public dir = 'rtl';

  public handle(): void {
    this.dir = 'ltr';
  }

  public handler(event: UseTextDirectionValue): void {
    console.log(event);
  }
}
```

### Host directive example

Emits `UseTextDirectionValue` when `dir` attribute changed from `selector`.

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseTextDirectionDirective, UseTextDirectionValue } from '@volvachev/angularuse';

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
      directive: UseTextDirectionDirective,
      inputs: ['useTextDirectionSettings'],
      outputs: ['useTextDirection'],
    }
  ]
})
export class ExampleComponent {
  @HostListener('useTextDirection', ['$event'])
  public listenUseTextDirection(event: UseTextDirectionValue): void {
    console.log(event);
  }
}
```

```html
<app-example [useTextDirectionSettings]="{self: false, selector: 'html'}" (useTextDirection)="listenUseTextDirection($event)"></app-example>
```