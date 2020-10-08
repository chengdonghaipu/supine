import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyFormComponent } from './dy-form.component';

describe('DyFormComponent', () => {
  let component: DyFormComponent;
  let fixture: ComponentFixture<DyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
