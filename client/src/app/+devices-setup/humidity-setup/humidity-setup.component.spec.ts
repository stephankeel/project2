/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HumiditySetupComponent } from './humidity-setup.component';

describe('HumiditySetupComponent', () => {
  let component: HumiditySetupComponent;
  let fixture: ComponentFixture<HumiditySetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumiditySetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumiditySetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
