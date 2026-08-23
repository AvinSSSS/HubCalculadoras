import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorPage } from './calculator.page';

describe('CalculatorPage', () => {
  let component: CalculatorPage;
  let fixture: ComponentFixture<CalculatorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate compound interest timeline', () => {
    component.initialAmount = 1000;
    component.monthlyDeposit = 100;
    component.monthlyRate = 1;
    component.months = 12;
    expect(component.interestRows().length).toBe(13);
    expect(component.investmentTotal()).toBeGreaterThan(component.investedAmount());
  });

  it('should calculate a fixed-rate loan schedule', () => {
    component.loanAmount = 12000;
    component.loanAnnualRate = 12;
    component.loanMonths = 12;
    expect(component.loanRows().length).toBe(12);
    expect(component.loanTotal()).toBeGreaterThan(component.loanAmount);
    const rows = component.loanRows();
    expect(rows[rows.length - 1]?.balance).toBeCloseTo(0, 2);
  });

  it('should apply successive discounts', () => {
    component.originalPrice = 1000;
    component.discountRate = 10;
    component.additionalDiscount = 10;
    component.installments = 3;
    expect(component.discountedPrice()).toBe(810);
    expect(component.installmentValue()).toBe(270);
  });
});
