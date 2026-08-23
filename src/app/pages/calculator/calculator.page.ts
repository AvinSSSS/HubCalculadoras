import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { LanguageService } from '../../core/language.service';

type CalculatorTab = 'hourly' | 'interest' | 'travel' | 'loan' | 'discount';
type ExportRow = Record<string, string | number>;

@Component({ selector: 'app-calculator', templateUrl: './calculator.page.html', styleUrls: ['./calculator.page.scss'], standalone: true, imports: [IonContent, FormsModule] })
export class CalculatorPage {
  readonly language = inject(LanguageService);
  readonly activeTab = signal<CalculatorTab>('hourly');
  readonly exporting = signal(false);
  desiredIncome = 8000; monthlyCosts = 1200; monthlyHours = 120; profitMargin = 20;
  initialAmount = 10000; monthlyDeposit = 500; monthlyRate = 0.8; months = 60;
  distance = 40; workDays = 22; fuelPrice = 6; fuelEfficiency = 11; electricEfficiency = 6; energyPrice = 0.95;
  loanAmount = 50000; loanAnnualRate = 18; loanMonths = 36;
  originalPrice = 1000; discountRate = 10; additionalDiscount = 5; installments = 10;

  readonly hourlyRate = computed(() => this.positive((this.desiredIncome + this.monthlyCosts) / Math.max(this.monthlyHours, 1) / (1 - this.percent(this.profitMargin, 95))));
  readonly hourlyBase = computed(() => this.positive((this.desiredIncome + this.monthlyCosts) / Math.max(this.monthlyHours, 1)));
  readonly interestRows = computed(() => this.buildInterestRows());
  readonly investmentTotal = computed(() => {
    const rows = this.interestRows();
    return rows[rows.length - 1]?.balance ?? this.positive(this.initialAmount);
  });
  readonly investedAmount = computed(() => this.positive(this.initialAmount + this.monthlyDeposit * Math.max(Math.floor(this.months), 0)));
  readonly fuelMonthly = computed(() => this.positive((this.distance * this.workDays / Math.max(this.fuelEfficiency, .1)) * this.fuelPrice));
  readonly electricMonthly = computed(() => this.positive((this.distance * this.workDays / Math.max(this.electricEfficiency, .1)) * this.energyPrice));
  readonly travelSavings = computed(() => Math.abs(this.fuelMonthly() - this.electricMonthly()));
  readonly travelMaximum = computed(() => Math.max(this.fuelMonthly(), this.electricMonthly(), 1));
  readonly loanRows = computed(() => this.buildLoanRows());
  readonly loanPayment = computed(() => this.loanRows()[0]?.payment ?? 0);
  readonly loanTotal = computed(() => this.loanRows().reduce((total, row) => total + row.payment, 0));
  readonly loanInterest = computed(() => this.positive(this.loanTotal() - this.positive(this.loanAmount)));
  readonly discountedPrice = computed(() => this.positive(this.originalPrice) * (1 - this.percent(this.discountRate)) * (1 - this.percent(this.additionalDiscount)));
  readonly savedAmount = computed(() => this.positive(this.originalPrice) - this.discountedPrice());
  readonly installmentValue = computed(() => this.discountedPrice() / Math.max(Math.floor(this.installments), 1));

  isPt(): boolean { return this.language.current() === 'pt'; }
  select(tab: CalculatorTab): void { this.activeTab.set(tab); }
  money(value: number): string { return new Intl.NumberFormat(this.isPt() ? 'pt-BR' : 'en-US', { style: 'currency', currency: 'BRL' }).format(value); }
  percentWidth(value: number, maximum: number): number { return maximum > 0 ? Math.min(Math.max(value / maximum * 100, 0), 100) : 0; }
  interestChartPoints(): string { return this.chartPoints(this.sample(this.interestRows().map(row => row.balance), 18)); }
  loanChartPoints(): string { return this.chartPoints(this.sample(this.loanRows().map(row => row.balance), 18)); }

  async exportExcel(): Promise<void> {
    this.exporting.set(true);
    try {
      const XLSX = await import('xlsx');
      const { name, rows } = this.exportData();
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheet['!cols'] = Object.keys(rows[0] ?? {}).map(key => ({ wch: Math.max(14, key.length + 2) }));
      XLSX.utils.book_append_sheet(workbook, worksheet, name.slice(0, 31));
      XLSX.writeFile(workbook, `hub-calculadoras-${this.activeTab()}-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } finally { this.exporting.set(false); }
  }

  private buildInterestRows(): { month: number; invested: number; earnings: number; balance: number }[] {
    const periods = Math.min(Math.max(Math.floor(this.months), 0), 1200);
    const rate = this.positive(this.monthlyRate) / 100;
    const deposit = this.positive(this.monthlyDeposit);
    let balance = this.positive(this.initialAmount);
    const rows = [{ month: 0, invested: balance, earnings: 0, balance }];
    for (let month = 1; month <= periods; month++) {
      balance = balance * (1 + rate) + deposit;
      const invested = this.positive(this.initialAmount) + deposit * month;
      rows.push({ month, invested, earnings: this.positive(balance - invested), balance });
    }
    return rows;
  }

  private buildLoanRows(): { month: number; payment: number; principal: number; interest: number; balance: number }[] {
    const principal = this.positive(this.loanAmount);
    const periods = Math.min(Math.max(Math.floor(this.loanMonths), 1), 600);
    const rate = this.positive(this.loanAnnualRate) / 1200;
    const payment = rate === 0 ? principal / periods : principal * rate / (1 - Math.pow(1 + rate, -periods));
    let balance = principal;
    const rows = [];
    for (let month = 1; month <= periods; month++) {
      const interest = balance * rate;
      const amortization = Math.min(payment - interest, balance);
      balance = this.positive(balance - amortization);
      rows.push({ month, payment: amortization + interest, principal: amortization, interest, balance });
    }
    return rows;
  }

  private exportData(): { name: string; rows: ExportRow[] } {
    const pt = this.isPt();
    switch (this.activeTab()) {
      case 'hourly': return { name: pt ? 'Valor-hora' : 'Hourly rate', rows: [{ [pt ? 'Renda desejada' : 'Desired income']: this.desiredIncome, [pt ? 'Custos mensais' : 'Monthly costs']: this.monthlyCosts, [pt ? 'Horas faturáveis' : 'Billable hours']: this.monthlyHours, [pt ? 'Margem (%)' : 'Margin (%)']: this.profitMargin, [pt ? 'Valor-hora sugerido' : 'Suggested hourly rate']: this.hourlyRate() }] };
      case 'interest': return { name: pt ? 'Juros compostos' : 'Compound interest', rows: this.interestRows().map(row => ({ [pt ? 'Mês' : 'Month']: row.month, [pt ? 'Total investido' : 'Invested']: row.invested, [pt ? 'Rendimento' : 'Earnings']: row.earnings, [pt ? 'Saldo' : 'Balance']: row.balance })) };
      case 'travel': return { name: pt ? 'Deslocamento' : 'Commuting', rows: [
        { [pt ? 'Modal' : 'Mode']: pt ? 'Combustão' : 'Fuel', [pt ? 'Custo mensal' : 'Monthly cost']: this.fuelMonthly() },
        { [pt ? 'Modal' : 'Mode']: pt ? 'Elétrico' : 'Electric', [pt ? 'Custo mensal' : 'Monthly cost']: this.electricMonthly() },
        { [pt ? 'Modal' : 'Mode']: pt ? 'Economia potencial' : 'Potential savings', [pt ? 'Custo mensal' : 'Monthly cost']: this.travelSavings() }
      ] };
      case 'loan': return { name: pt ? 'Financiamento' : 'Loan', rows: this.loanRows().map(row => ({ [pt ? 'Parcela' : 'Installment']: row.month, [pt ? 'Pagamento' : 'Payment']: row.payment, [pt ? 'Amortização' : 'Principal']: row.principal, [pt ? 'Juros' : 'Interest']: row.interest, [pt ? 'Saldo devedor' : 'Balance']: row.balance })) };
      case 'discount': return { name: pt ? 'Descontos' : 'Discounts', rows: [
        { [pt ? 'Descrição' : 'Description']: pt ? 'Preço original' : 'Original price', [pt ? 'Valor' : 'Value']: this.originalPrice },
        { [pt ? 'Descrição' : 'Description']: pt ? 'Economia total' : 'Total savings', [pt ? 'Valor' : 'Value']: this.savedAmount() },
        { [pt ? 'Descrição' : 'Description']: pt ? 'Preço final' : 'Final price', [pt ? 'Valor' : 'Value']: this.discountedPrice() },
        { [pt ? 'Descrição' : 'Description']: `${Math.max(Math.floor(this.installments), 1)}x`, [pt ? 'Valor' : 'Value']: this.installmentValue() }
      ] };
    }
  }

  private chartPoints(values: number[]): string {
    if (!values.length) return '';
    const max = Math.max(...values, 1);
    const span = Math.max(values.length - 1, 1);
    return values.map((value, index) => `${index / span * 100},${40 - value / max * 36}`).join(' ');
  }
  private sample(values: number[], count: number): number[] {
    if (values.length <= count) return values;
    return Array.from({ length: count }, (_, index) => values[Math.round(index * (values.length - 1) / (count - 1))]);
  }
  private percent(value: number, maximum = 100): number { return Math.min(this.positive(value), maximum) / 100; }
  private positive(value: number): number { return Number.isFinite(value) ? Math.max(value, 0) : 0; }
}
