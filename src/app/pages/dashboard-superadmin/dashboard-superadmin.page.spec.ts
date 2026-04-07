import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardSuperadminPage } from './dashboard-superadmin.page';

describe('DashboardSuperadminPage', () => {
  let component: DashboardSuperadminPage;
  let fixture: ComponentFixture<DashboardSuperadminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSuperadminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
