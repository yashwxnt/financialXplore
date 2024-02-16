import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagequizzesComponent } from './managequizzes.component';

describe('ManagequizzesComponent', () => {
  let component: ManagequizzesComponent;
  let fixture: ComponentFixture<ManagequizzesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagequizzesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagequizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
