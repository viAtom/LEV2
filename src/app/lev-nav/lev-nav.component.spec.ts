/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LevNavComponent } from './lev-nav.component';

describe('LevNavComponent', () => {
  let component: LevNavComponent;
  let fixture: ComponentFixture<LevNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
