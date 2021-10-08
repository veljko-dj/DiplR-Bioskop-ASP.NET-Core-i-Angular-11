import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationNewComponent } from './location-new.component'; 

describe('LocationNewComponent', () => {
  let component: LocationNewComponent;
  let fixture: ComponentFixture<LocationNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
