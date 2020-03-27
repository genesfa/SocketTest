import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollWindowComponent } from './roll-window.component';

describe('RollWindowComponent', () => {
  let component: RollWindowComponent;
  let fixture: ComponentFixture<RollWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
