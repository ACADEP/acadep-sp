import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioEventosComponent } from './calendario-eventos.component';

describe('CalendarioEventosComponent', () => {
  let component: CalendarioEventosComponent;
  let fixture: ComponentFixture<CalendarioEventosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarioEventosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarioEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
