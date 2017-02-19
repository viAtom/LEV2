/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LevMainComponent } from './lev-main.component';

describe('LevMainComponent', () => {
  let component: LevMainComponent;
  let fixture: ComponentFixture<LevMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
