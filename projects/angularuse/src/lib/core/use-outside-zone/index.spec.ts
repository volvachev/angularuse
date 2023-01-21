import { Observable, Subject, tap } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NgZone } from '@angular/core';
import { outsideZone, useOutsideZone } from '.';

describe('OutsideZone operator function', () => {
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

  it('should call all operators and subscribe in stream outsideZone for next methods', done => {
    component
      .testSubs()
      .pipe(
        outsideZone(component.ngZone),
        tap(() => {
          expect(NgZone.isInAngularZone()).toBe(false);
        })
      )
      .subscribe(() => {
        expect(NgZone.isInAngularZone()).toBe(false);
        done();
      });

    component.stream$.next(undefined);
  });

  it('should call all operators and subscribe in stream outsideZone for error methods', done => {
    component
      .testSubs()
      .pipe(
        outsideZone(component.ngZone),
        tap({
          error: () => {
            expect(NgZone.isInAngularZone()).toBe(false);
          }
        })
      )
      .subscribe({
        error: () => {
          expect(NgZone.isInAngularZone()).toBe(false);
          done();
        }
      });

    component.stream$.error(undefined);
  });

  it('should call all operators and subscribe in stream outsideZone for complete methods', done => {
    component
      .testSubs()
      .pipe(
        outsideZone(component.ngZone),
        tap({
          complete: () => {
            expect(NgZone.isInAngularZone()).toBe(false);
          }
        })
      )
      .subscribe({
        complete: () => {
          expect(NgZone.isInAngularZone()).toBe(false);
          done();
        }
      });

    component.stream$.complete();
  });
});

describe('useOutsideZone function', () => {
  let component: TestUseOutsideZoneComponent;
  let fixture: ComponentFixture<TestUseOutsideZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestUseOutsideZoneComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestUseOutsideZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call all operators and subscribe in stream outsideZone for next methods', done => {
    component.testSubs
      .pipe(
        tap(() => {
          expect(NgZone.isInAngularZone()).toBe(false);
        })
      )
      .subscribe(() => {
        expect(NgZone.isInAngularZone()).toBe(false);
        done();
      });

    component.stream$.next(undefined);
  });

  it('should call all operators and subscribe in stream outsideZone for error methods', done => {
    component.testSubs
      .pipe(
        tap({
          error: () => {
            expect(NgZone.isInAngularZone()).toBe(false);
          }
        })
      )
      .subscribe({
        error: () => {
          expect(NgZone.isInAngularZone()).toBe(false);
          done();
        }
      });

    component.stream$.error(undefined);
  });

  it('should call all operators and subscribe in stream outsideZone for complete methods', done => {
    component.testSubs
      .pipe(
        tap({
          complete: () => {
            expect(NgZone.isInAngularZone()).toBe(false);
          }
        })
      )
      .subscribe({
        complete: () => {
          expect(NgZone.isInAngularZone()).toBe(false);
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
class TestUseOutsideZoneComponent {
  public stream$ = new Subject();
  public testSubs = this.stream$.asObservable().pipe(useOutsideZone());
}
