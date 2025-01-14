import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitsTableComponent } from './habits-table.component';

describe('HabitsTableComponent', () => {
  let component: HabitsTableComponent;
  let fixture: ComponentFixture<HabitsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
