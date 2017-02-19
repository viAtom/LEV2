/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LevMapComponent } from './lev-map.component';

describe('LevMapComponent', () => {
  let component: LevMapComponent;
  let fixture: ComponentFixture<LevMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
