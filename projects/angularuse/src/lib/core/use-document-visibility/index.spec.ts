import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DOCUMENT_IS_VISIBLE, useDocumentVisibility } from './index';
import { Observable, first } from 'rxjs';

describe('useDocumentVisibility function', () => {
  let component: TestDocumentVisibleComponent;
  let fixture: ComponentFixture<TestDocumentVisibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestDocumentVisibleComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDocumentVisibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return visible document state', done => {
    component.documentVisible$.pipe(first()).subscribe(visibleState => {
      expect(visibleState).toBe('visible');
      done();
    });
  });
});

describe('DOCUMENT_IS_VISIBLE token', () => {
  it('should return observable with document state', done => {
    TestBed.configureTestingModule({});

    const documentIsVisible$: Observable<DocumentVisibilityState> = TestBed.inject(DOCUMENT_IS_VISIBLE);

    documentIsVisible$.pipe(first()).subscribe(state => {
      expect(state).toBe('visible');
      done();
    });
  });
});

@Component({
  selector: 'angularuse-component',
  template: ''
})
class TestDocumentVisibleComponent {
  public documentVisible$ = useDocumentVisibility();
}
