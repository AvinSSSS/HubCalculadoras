import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateConverterPage } from './date-converter.page';

describe('DateConverterPage', () => {
  let component: DateConverterPage;
  let fixture: ComponentFixture<DateConverterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DateConverterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
