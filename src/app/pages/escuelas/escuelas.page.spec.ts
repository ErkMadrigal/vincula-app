import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EscuelasPage } from './escuelas.page';

describe('EscuelasPage', () => {
  let component: EscuelasPage;
  let fixture: ComponentFixture<EscuelasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EscuelasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
