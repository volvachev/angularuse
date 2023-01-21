import { first, Observable, Subject } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NgZone } from '@angular/core';
import { tap } from 'rxjs/operators';
import { outsideZone, useOutsideZone } from '../use-outside-zone';
import { insideZone, useInsideZone } from './index';

describe('InsideZone operator function', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call all operators and subscribe in stream inside zone for next methods', done => {
    component
      .testSubs()
      .pipe(
        outsideZone(component.ngZone),
        insideZone(component.ngZone),
        tap(() => {
          expect(NgZone.isInAngularZone()).toBe(true);
        }),
        first()
      )
      .subscribe(() => {
        expect(NgZone.isInAngularZone()).toBe(true);
        done();
      });

    component.stream$.next(undefined);
  });

  it('should call all operators and subscribe in stream inside zone for error methods', done => {
    component
      .testSubs()
      .pipe(
        outsideZone(component.ngZone),
        insideZone(component.ngZone),
        tap({
          error: () => {
            expect(NgZone.isInAngularZone()).toBe(true);
          }
        }),
        first()
      )
      .subscribe({
        error: () => {
          expect(NgZone.isInAngularZone()).toBe(true);
          done();
        }
      });

    component.stream$.error(undefined);
  });

  it('should call all operators and subscribe in stream inside zone for complete methods', done => {
    component
      .testSubs()
      .pipe(
        outsideZone(component.ngZone),
        insideZone(component.ngZone),
        tap({
          complete: () => {
            expect(NgZone.isInAngularZone()).toBe(true);
          }
        })
      )
      .subscribe({
        complete: () => {
          expect(NgZone.isInAngularZone()).toBe(true);
          done();
        }
      });

    component.stream$.complete();
  });
});

describe('useInsideZone function', () => {
  let component: TestUseInsideZoneComponent;
  let fixture: ComponentFixture<TestUseInsideZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestUseInsideZoneComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestUseInsideZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call all operators and subscribe in stream inside zone for next methods', done => {
    component.testSubs
      .pipe(
        tap(() => {
          expect(NgZone.isInAngularZone()).toBe(true);
        }),
        first()
      )
      .subscribe(() => {
        expect(NgZone.isInAngularZone()).toBe(true);
        done();
      });

    component.stream$.next(undefined);
  });

  it('should call all operators and subscribe in stream inside zone for error methods', done => {
    component.testSubs
      .pipe(
        tap({
          error: () => {
            expect(NgZone.isInAngularZone()).toBe(true);
          }
        }),
        first()
      )
      .subscribe({
        error: () => {
          expect(NgZone.isInAngularZone()).toBe(true);
          done();
        }
      });

    component.stream$.error(undefined);
  });

  it('should call all operators and subscribe in stream inside zone for complete methods', done => {
    component.testSubs
      .pipe(
        tap({
          complete: () => {
            expect(NgZone.isInAngularZone()).toBe(true);
          }
        })
      )
      .subscribe({
        complete: () => {
          expect(NgZone.isInAngularZone()).toBe(true);
          done();
        }
      });

    component.stream$.complete();
  });
});

@Component({
  selector: 'use-component',
  template: ''
})
class TestComponent {
  public stream$ = new Subject();

  constructor(public readonly ngZone: NgZone) {}

  public testSubs(): Observable<unknown> {
    return this.stream$.asObservable();
  }
}

@Component({
  selector: 'use-component',
  template: ''
})
class TestUseInsideZoneComponent {
  public stream$ = new Subject();
  public testSubs = this.stream$.asObservable().pipe(useOutsideZone(), useInsideZone());
}
