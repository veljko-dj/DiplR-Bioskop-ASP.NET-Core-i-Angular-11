import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorNewComponent } from './actor-new.component';

describe('ActorNewComponent', () => {
  let component: ActorNewComponent;
  let fixture: ComponentFixture<ActorNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActorNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActorNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
