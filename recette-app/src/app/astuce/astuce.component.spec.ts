import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AstuceComponent } from './astuce.component';

describe('AstuceComponent', () => {
  let component: AstuceComponent;
  let fixture: ComponentFixture<AstuceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AstuceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AstuceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
