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

  [1200, 1201].forEach(months => {
    it(`should keep the summary and export consistent for ${months} months`, () => {
      component.select('interest');
      component.language.current.set('en');
      component.initialAmount = 0;
      component.monthlyDeposit = 500;
      component.monthlyRate = 0;
      component.months = months;
      component.onFormChange();
      fixture.detectChanges();

      expect(component.interestRows().length).toBe(1201);
      expect(component.investmentTotal()).toBe(600000);
      expect(component.investedAmount()).toBe(600000);
      const summary = fixture.nativeElement.querySelector('aside p').textContent;
      expect(summary).toContain(component.money(600000));
      expect(summary).toContain(`Earnings: ${component.money(0)}`);
      const rows = component['exportData']().rows;
      expect(rows.length).toBe(1201);
      expect(rows[1200]).toEqual({ Month: 1200, Invested: 600000, Earnings: 0, Balance: 600000 });
    });
  });

  [
    { label: 'negative', months: -1, invested: 1000, rows: 1 },
    { label: 'empty', months: null as unknown as number, invested: 1000, rows: 1 },
    { label: 'NaN', months: NaN, invested: 1000, rows: 1 },
    { label: 'infinite', months: Infinity, invested: 1000, rows: 1 },
    { label: 'negative infinite', months: -Infinity, invested: 1000, rows: 1 },
    { label: 'fractional', months: 2.9, invested: 2000, rows: 3 }
  ].forEach(({ label, months, invested, rows }) => {
    it(`should define a consistent investment for a ${label} term`, () => {
      component.initialAmount = 1000;
      component.monthlyDeposit = 500;
      component.monthlyRate = 0;
      component.months = months;
      component.onFormChange();

      expect(component.interestRows().length).toBe(rows);
      expect(component.investmentTotal()).toBe(invested);
      expect(component.investedAmount()).toBe(invested);
      expect(component.investmentTotal() - component.investedAmount()).toBe(0);
    });
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
