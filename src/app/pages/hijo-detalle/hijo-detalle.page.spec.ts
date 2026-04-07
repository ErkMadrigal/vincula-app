import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HijoDetallePage } from './hijo-detalle.page';

describe('HijoDetallePage', () => {
  let component: HijoDetallePage;
  let fixture: ComponentFixture<HijoDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HijoDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
