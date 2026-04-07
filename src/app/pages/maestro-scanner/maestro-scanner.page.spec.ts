import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaestroScannerPage } from './maestro-scanner.page';

describe('MaestroScannerPage', () => {
  let component: MaestroScannerPage;
  let fixture: ComponentFixture<MaestroScannerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaestroScannerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
