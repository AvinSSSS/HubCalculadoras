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
    component.onFormChange();
    expect(component.interestRows().length).toBe(13);
    expect(component.investmentTotal()).toBeGreaterThan(component.investedAmount());
  });

  it('should calculate a fixed-rate loan schedule', () => {
    component.loanAmount = 12000;
    component.loanAnnualRate = 12;
    component.loanMonths = 12;
    component.onFormChange();
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
    component.onFormChange();
    expect(component.discountedPrice()).toBe(810);
    expect(component.installmentValue()).toBe(270);
  });

  it('should prepare a barbecue shopping list for adults and children', () => {
    component.barbecuePeople = 10;
    component.barbecueChildren = 2;
    component.barbecueDuration = 'medium';
    component.barbecueProfile = 'normal';
    component.onFormChange();
    const result = component.barbecueResult();
    expect(result.adults).toBe(8);
    expect(result.meat).toBeCloseTo(3.75, 2);
    expect(result.picanha + result.chicken + result.sausage).toBeCloseTo(result.meat, 5);
  });

  it('should convert and swap currencies using the entered rate', () => {
    component.currencyAmount = 100;
    component.sourceCurrency = 'BRL';
    component.targetCurrency = 'USD';
    component.exchangeRate = .2;
    component.onFormChange();
    expect(component.convertedAmount()).toBe(20);
    component.swapCurrencies();
    expect(component.sourceCurrency).toBe('USD');
    expect(component.targetCurrency).toBe('BRL');
    expect(component.exchangeRate).toBe(5);
  });

  it('should open and close the project information menu', () => {
    component.toggleProjectMenu();
    expect(component.projectMenuOpen()).toBeTrue();
    component.onEscape();
    expect(component.projectMenuOpen()).toBeFalse();
  });
});
