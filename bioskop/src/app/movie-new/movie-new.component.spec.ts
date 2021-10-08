import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieNewComponent } from './movie-new.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';

describe('MovieNewComponent', () => {
  let component: MovieNewComponent;
  let fixture: ComponentFixture<MovieNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
