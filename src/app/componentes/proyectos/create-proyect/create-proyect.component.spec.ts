import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProyectComponent } from './create-proyect.component';

describe('CreateProyectComponent', () => {
  let component: CreateProyectComponent;
  let fixture: ComponentFixture<CreateProyectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProyectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProyectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
