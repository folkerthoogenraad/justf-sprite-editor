import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpriteDetails } from './sprite-details';

describe('SpriteDetails', () => {
  let component: SpriteDetails;
  let fixture: ComponentFixture<SpriteDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpriteDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpriteDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
