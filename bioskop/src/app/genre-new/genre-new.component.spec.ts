import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreNewComponent } from './genre-new.component';

describe('GenreNewComponent', () => {
  let component: GenreNewComponent;
  let fixture: ComponentFixture<GenreNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenreNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
