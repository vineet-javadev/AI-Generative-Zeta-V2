import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterheadComponent } from './masterhead.component';

describe('MasterheadComponent', () => {
  let component: MasterheadComponent;
  let fixture: ComponentFixture<MasterheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterheadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
