import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayBoxComponent } from './day-box.component';

describe('DayBoxComponent', () => {
  let component: DayBoxComponent;
  let fixture: ComponentFixture<DayBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
