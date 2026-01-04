import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpriteFrameDetails } from './sprite-frame-details';

describe('SpriteFrameDetails', () => {
  let component: SpriteFrameDetails;
  let fixture: ComponentFixture<SpriteFrameDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpriteFrameDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpriteFrameDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
