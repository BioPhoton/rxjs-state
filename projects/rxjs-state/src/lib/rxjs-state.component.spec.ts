import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RxjsStateComponent } from './rxjs-state.component';

describe('RxjsStateComponent', () => {
  let component: RxjsStateComponent;
  let fixture: ComponentFixture<RxjsStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RxjsStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RxjsStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
