import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationIngrUstComponent } from './creation-ingr-ust.component';

describe('CreationIngrUstComponent', () => {
  let component: CreationIngrUstComponent;
  let fixture: ComponentFixture<CreationIngrUstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationIngrUstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationIngrUstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
