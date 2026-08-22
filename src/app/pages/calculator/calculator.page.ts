import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { LanguageService } from '../../core/language.service';

type CalculatorTab = 'hourly' | 'interest' | 'travel';

@Component({ selector: 'app-calculator', templateUrl: './calculator.page.html', styleUrls: ['./calculator.page.scss'], standalone: true, imports: [IonContent, FormsModule, RouterLink] })
export class CalculatorPage {
  readonly activeTab = signal<CalculatorTab>('hourly');
  desiredIncome = 8000; monthlyCosts = 1200; monthlyHours = 120; profitMargin = 20;
  initialAmount = 10000; monthlyDeposit = 500; monthlyRate = 0.8; months = 60;
  distance = 40; workDays = 22; fuelPrice = 6; fuelEfficiency = 11; electricEfficiency = 6; energyPrice = 0.95;

  readonly hourlyRate = computed(() => this.positive((this.desiredIncome + this.monthlyCosts) / Math.max(this.monthlyHours, 1) / (1 - Math.min(Math.max(this.profitMargin, 0), 95) / 100)));
  readonly investmentTotal = computed(() => {
    const rate = Math.max(this.monthlyRate, 0) / 100;
    const periods = Math.max(Math.floor(this.months), 0);
    if (rate === 0) return this.positive(this.initialAmount + this.monthlyDeposit * periods);
    return this.positive(this.initialAmount * Math.pow(1 + rate, periods) + this.monthlyDeposit * ((Math.pow(1 + rate, periods) - 1) / rate));
  });
  readonly investedAmount = computed(() => this.positive(this.initialAmount + this.monthlyDeposit * Math.max(Math.floor(this.months), 0)));
  readonly fuelMonthly = computed(() => this.positive((this.distance * this.workDays / Math.max(this.fuelEfficiency, .1)) * this.fuelPrice));
  readonly electricMonthly = computed(() => this.positive((this.distance * this.workDays / Math.max(this.electricEfficiency, .1)) * this.energyPrice));
  readonly travelSavings = computed(() => Math.abs(this.fuelMonthly() - this.electricMonthly()));

  constructor(readonly language: LanguageService) {}
  isPt(): boolean { return this.language.current() === 'pt'; }
  select(tab: CalculatorTab): void { this.activeTab.set(tab); }
  money(value: number): string { return new Intl.NumberFormat(this.isPt() ? 'pt-BR' : 'en-US', { style: 'currency', currency: 'BRL' }).format(value); }
  private positive(value: number): number { return Number.isFinite(value) ? Math.max(value, 0) : 0; }
}
