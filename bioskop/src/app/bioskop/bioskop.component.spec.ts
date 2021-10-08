import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BioskopComponent } from './bioskop.component';

describe('BioskopComponent', () => {
  let component: BioskopComponent;
  let fixture: ComponentFixture<BioskopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BioskopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BioskopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
