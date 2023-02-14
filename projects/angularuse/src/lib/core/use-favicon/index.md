# useFavicon

Reactive favicon.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { useFavicon, IconType, useUntilDestroy } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class ExampleComponent {
  private iconState = new Subject<IconType>();
  private destroy$ = useUntilDestroy<void>();
  private favicon$ = useFavicon(this.iconState.asObservable());

  public ngOnInit(): void {
    this.favicon$.pipe(this.destroy$).subscribe();

    this.iconState.next('https://angular.io/assets/images/favicons/favicon.ico');
  }
}
```

### Directive example

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseFaviconDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <div (click)="clickHandler" style="width: 300px;height: 300px;border: 1px solid black;" [useFaviconSettings]="{rel: 'icon'}" [useFavicon]="newIcon">test</div>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseFaviconDirective],
})
export class ExampleComponent {
  public newIcon = '';

  public clickHandler(): void {
    this.newIcon = 'https://angular.io/assets/images/favicons/favicon.ico';
  }
}
```

### Host directive example

```ts
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UseElementVisibilityDirective } from '@volvachev/angularuse';

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
      directive: UseFaviconDirective,
      inputs: ['useFavicon', 'useFaviconSettings'],
    },
  ]
})
export class ExampleComponent {
}
```

```html
<app-example [useFaviconSettings]="{baseUrl: 'https://angular.io/'}" [useFavicon]="'assets/images/favicons/favicon.ico'"></app-example>
```