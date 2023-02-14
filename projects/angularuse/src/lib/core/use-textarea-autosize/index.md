# useTextareaAutosize

Automatically update the height of a textarea depending on the content.

## Usage

```ts
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';
import { useTextareaAutosize } from '@volvachev/angularuse';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
})
export class ExampleComponent implements OnInit {
  public contol = new FormControl<string>('');
  public textSisize$ = useTextareaAutosize({input: this.contol});

  public ngOnInit(): void {
    this.textSisize$.subscribe();
  }
}
```

```html
<textarea [formControl]="control"></textarea>
```

### Directive example

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UseTextareaAutosizeDirective } from '@volvachev/angularuse';

@Component({
  selector: 'app-example',
  template: `
     <textarea useTextareaAutosize [formControl]="text"></textarea>
	 <textarea useTextareaAutosize [(ngModel)]="text2"></textarea>
	 <textarea useTextareaAutosize [useTextareaAutosizeSettings]="{textareaAutosizeSettings: {input: text3}}" [formControl]="text3"></textarea>
  `,
  styles: [':host {display: flex; max-width: 310px; height: 310px; background: aquamarine;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UseTextareaAutosizeDirective],
})
export class ExampleComponent {
  public text = new FormControl<string>('');
  public text2 = '';
  public text3 = new FormControl<string>('', {nonNullable: true});
}
```
