import { Component, computed, ElementRef, HostListener, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { LanguageService } from '../../core/language.service';

type CalculatorTab = 'hourly' | 'interest' | 'travel' | 'loan' | 'discount' | 'barbecue' | 'currency';
type BarbecueDuration = 'short' | 'medium' | 'long';
type GuestProfile = 'light' | 'normal' | 'high';
type ExportRow = Record<string, string | number>;

/**
 * Página principal do Hub de Calculadoras.
 *
 * A classe concentra os valores digitados, os resultados reativos, a geração
 * dos pontos dos gráficos e a exportação da calculadora ativa para Excel.
 * Nenhum dado é enviado a servidor: todas as operações acontecem no navegador.
 */
@Component({ selector: 'app-calculator', templateUrl: './calculator.page.html', styleUrls: ['./calculator.page.scss'], standalone: true, imports: [IonContent, FormsModule] })
export class CalculatorPage implements OnDestroy {
  // Serviços e estado geral da interface.
  readonly language = inject(LanguageService);
  readonly activeTab = signal<CalculatorTab>('hourly');
  readonly exporting = signal(false);
  readonly projectMenuOpen = signal(false);
  private readonly projectDialog = viewChild.required<ElementRef<HTMLDialogElement>>('projectDialog');
  private readonly projectTrigger = viewChild.required<ElementRef<HTMLButtonElement>>('projectTrigger');
  private readonly projectClose = viewChild.required<ElementRef<HTMLButtonElement>>('projectClose');
  // Versão reativa incrementada sempre que um input/select do formulário muda.
  private readonly formRevision = signal(0);

  // Entradas da tela "Valor-hora".
  desiredIncome = 8000; monthlyCosts = 1200; monthlyHours = 120; profitMargin = 20;
  // Entradas da tela "Juros compostos".
  initialAmount = 10000; monthlyDeposit = 500; monthlyRate = 0.8; months = 60;
  // Entradas da tela "Deslocamento".
  distance = 40; workDays = 22; fuelPrice = 6; fuelEfficiency = 11; electricEfficiency = 6; energyPrice = 0.95;
  // Entradas da tela "Financiamento".
  loanAmount = 50000; loanAnnualRate = 18; loanMonths = 36;
  // Entradas da tela "Descontos".
  originalPrice = 1000; discountRate = 10; additionalDiscount = 5; installments = 10;
  // Entradas da tela "Churrasco".
  barbecuePeople = 10; barbecueChildren = 2; barbecueDuration: BarbecueDuration = 'medium'; barbecueProfile: GuestProfile = 'normal';
  // Entradas do conversor. A taxa é manual para manter o app local e transparente.
  currencyAmount = 1000; sourceCurrency = 'BRL'; targetCurrency = 'USD'; exchangeRate = 0.185;

  /*
   * Valor-hora: soma renda e custos, divide pelas horas faturáveis e ajusta a
   * tarifa para que a margem desejada esteja contida no preço final.
   * Math.max impede divisão por zero; a margem é limitada a 95%.
   */
  readonly hourlyRate = computed(() => { this.formRevision(); return this.positive((this.desiredIncome + this.monthlyCosts) / Math.max(this.monthlyHours, 1) / (1 - this.percent(this.profitMargin, 95))); });
  readonly hourlyBase = computed(() => { this.formRevision(); return this.positive((this.desiredIncome + this.monthlyCosts) / Math.max(this.monthlyHours, 1)); });

  // Juros compostos: a série mensal alimenta o resultado, o gráfico e o Excel.
  readonly interestRows = computed(() => { this.formRevision(); return this.buildInterestRows(); });
  readonly investmentTotal = computed(() => {
    const rows = this.interestRows();
    return rows[rows.length - 1]?.balance ?? this.positive(this.initialAmount);
  });
  readonly investedAmount = computed(() => { this.formRevision(); return this.positive(this.initialAmount + this.monthlyDeposit * Math.max(Math.floor(this.months), 0)); });

  // Deslocamento: distância mensal dividida pela eficiência e multiplicada pelo preço da fonte de energia.
  readonly fuelMonthly = computed(() => { this.formRevision(); return this.positive((this.distance * this.workDays / Math.max(this.fuelEfficiency, .1)) * this.fuelPrice); });
  readonly electricMonthly = computed(() => { this.formRevision(); return this.positive((this.distance * this.workDays / Math.max(this.electricEfficiency, .1)) * this.energyPrice); });
  readonly travelSavings = computed(() => Math.abs(this.fuelMonthly() - this.electricMonthly()));
  readonly travelMaximum = computed(() => Math.max(this.fuelMonthly(), this.electricMonthly(), 1));

  // Financiamento: cronograma Price usado para parcela, total, juros e gráfico do saldo.
  readonly loanRows = computed(() => { this.formRevision(); return this.buildLoanRows(); });
  readonly loanPayment = computed(() => this.loanRows()[0]?.payment ?? 0);
  readonly loanTotal = computed(() => this.loanRows().reduce((total, row) => total + row.payment, 0));
  readonly loanInterest = computed(() => this.positive(this.loanTotal() - this.positive(this.loanAmount)));

  // Descontos sucessivos são multiplicativos: o segundo incide sobre o preço já reduzido.
  readonly discountedPrice = computed(() => { this.formRevision(); return this.positive(this.originalPrice) * (1 - this.percent(this.discountRate)) * (1 - this.percent(this.additionalDiscount)); });
  readonly savedAmount = computed(() => this.positive(this.originalPrice) - this.discountedPrice());
  readonly installmentValue = computed(() => this.discountedPrice() / Math.max(Math.floor(this.installments), 1));

  /*
   * Churrasco: adultos e crianças possuem consumo-base diferente. Duração e
   * perfil aplicam fatores sobre carnes, bebidas e acompanhamentos.
   */
  readonly barbecueResult = computed(() => {
    this.formRevision();
    const people = Math.max(Math.floor(this.barbecuePeople), 0);
    const children = Math.min(Math.max(Math.floor(this.barbecueChildren), 0), people);
    const adults = people - children;
    const durationAdjustment = { short: -50, medium: 0, long: 75 }[this.barbecueDuration];
    const adultGrams = Math.min(Math.max({ light: 350, normal: 425, high: 500 }[this.barbecueProfile] + durationAdjustment, 350), 500);
    const childGrams = Math.min(Math.max({ light: 150, normal: 175, high: 200 }[this.barbecueProfile] + durationAdjustment / 3, 150), 200);
    const meat = (adults * adultGrams + children * childGrams) / 1000;
    const beerPerAdult = Math.min(Math.max({ light: 1.5, normal: 1.75, high: 2 }[this.barbecueProfile] + ({ short: -.25, medium: 0, long: .25 }[this.barbecueDuration]), 1.5), 2);
    const waterPerPerson = { short: .5, medium: .75, long: 1 }[this.barbecueDuration];
    const charcoalPerPerson = { short: .6, medium: 1, long: 1.5 }[this.barbecueDuration];
    return {
      people, adults, children, meat,
      picanha: meat * .4, chicken: meat * .4, sausage: meat * .2,
      beer: adults * beerPerAdult,
      soda: people * 1,
      water: people * waterPerPerson,
      garlicBread: people,
      farofa: people * .1,
      salad: people * .15,
      charcoal: people * charcoalPerPerson
    };
  });

  // Conversão direta: valor de origem multiplicado pela taxa informada.
  readonly convertedAmount = computed(() => { this.formRevision(); return this.positive(this.currencyAmount) * this.positive(this.exchangeRate); });

  /** Informa qual idioma deve ser usado pelos textos e formatos monetários. */
  isPt(): boolean { return this.language.current() === 'pt'; }
  /** Troca a calculadora exibida sem navegar ou recarregar a página. */
  select(tab: CalculatorTab): void { this.activeTab.set(tab); }
  /** Abre ou fecha a explicação da solução no painel lateral. */
  toggleProjectMenu(): void {
    if (this.projectMenuOpen()) { this.closeProjectMenu(); return; }
    this.projectDialog().nativeElement.showModal();
    this.projectMenuOpen.set(true);
    this.projectClose().nativeElement.focus();
  }
  /** Fecha explicitamente a explicação da solução. */
  closeProjectMenu(): void {
    if (!this.projectMenuOpen()) { return; }
    this.projectDialog().nativeElement.close();
    this.projectMenuOpen.set(false);
    this.projectTrigger().nativeElement.focus();
  }
  /** Permite fechar o drawer pela tecla Escape, além do botão e do backdrop. */
  onEscape(event?: Event): void {
    event?.preventDefault();
    this.closeProjectMenu();
  }
  /** Mantém Tab nos controles do painel, inclusive nos limites do diálogo nativo. */
  onProjectTab(event: KeyboardEvent): void {
    if (event.key !== 'Tab') { return; }
    const controls = this.projectDialog().nativeElement.querySelectorAll<HTMLElement>('.project-drawer button, .project-drawer a[href]');
    const first = controls[0];
    const last = controls[controls.length - 1];
    const backwards = event.shiftKey;
    if (event.target === (backwards ? first : last)) {
      event.preventDefault();
      (backwards ? last : first)?.focus();
    }
  }
  ngOnDestroy(): void { this.projectDialog().nativeElement.close(); }
  /** Invalida os resultados em cache quando qualquer campo do formulário muda. */
  @HostListener('input')
  @HostListener('change')
  onFormChange(): void { this.formRevision.update(revision => revision + 1); }
  /** Formata valores sempre em reais, respeitando a pontuação do idioma atual. */
  money(value: number): string { return new Intl.NumberFormat(this.isPt() ? 'pt-BR' : 'en-US', { style: 'currency', currency: 'BRL' }).format(value); }
  /** Formata valores usando a moeda selecionada pelo usuário. */
  currency(value: number, code: string): string {
    try { return new Intl.NumberFormat(this.isPt() ? 'pt-BR' : 'en-US', { style: 'currency', currency: code }).format(value); }
    catch { return `${code} ${value.toFixed(2)}`; }
  }
  /** Inverte as moedas e transforma a taxa na sua recíproca. */
  swapCurrencies(): void {
    [this.sourceCurrency, this.targetCurrency] = [this.targetCurrency, this.sourceCurrency];
    this.exchangeRate = this.exchangeRate > 0 ? 1 / this.exchangeRate : 0;
    this.onFormChange();
  }
  /** Converte uma proporção para a faixa visual segura de 0% a 100%. */
  percentWidth(value: number, maximum: number): number { return maximum > 0 ? Math.min(Math.max(value / maximum * 100, 0), 100) : 0; }
  /** Produz a polyline SVG do crescimento do investimento. */
  interestChartPoints(): string { return this.chartPoints(this.sample(this.interestRows().map(row => row.balance), 18)); }
  /** Produz a polyline SVG da redução do saldo devedor. */
  loanChartPoints(): string { return this.chartPoints(this.sample(this.loanRows().map(row => row.balance), 18)); }

  /**
   * Exporta a calculadora selecionada como .xlsx.
   * O import dinâmico evita carregar a biblioteca SheetJS durante a abertura
   * normal da página. A flag `exporting` evita cliques repetidos enquanto o
   * arquivo é preparado e é restaurada mesmo se ocorrer uma falha.
   */
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

  /**
   * Monta uma linha para cada mês do investimento.
   * Em cada período, os juros incidem primeiro sobre o saldo e o aporte é
   * acrescentado ao final. O limite de 1.200 meses protege a interface.
   */
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

  /**
   * Gera o cronograma de amortização pela Tabela Price.
   * A taxa anual é convertida em mensal; cada parcela separa juros e principal.
   * Para taxa zero, o principal é simplesmente dividido pelo prazo.
   */
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

  /**
   * Traduz o estado da aba ativa para linhas tabulares.
   * Os nomes das colunas acompanham o idioma selecionado e cada calculadora
   * entrega o nível de detalhe adequado: resumo ou evolução período a período.
   */
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
      case 'barbecue': {
        const result = this.barbecueResult();
        return { name: pt ? 'Churrasco' : 'Barbecue', rows: [
          { [pt ? 'Categoria' : 'Category']: pt ? 'Picanha/Alcatra' : 'Beef', [pt ? 'Quantidade' : 'Quantity']: result.picanha, [pt ? 'Unidade' : 'Unit']: 'kg' },
          { [pt ? 'Categoria' : 'Category']: pt ? 'Frango' : 'Chicken', [pt ? 'Quantidade' : 'Quantity']: result.chicken, [pt ? 'Unidade' : 'Unit']: 'kg' },
          { [pt ? 'Categoria' : 'Category']: pt ? 'Linguiça' : 'Sausage', [pt ? 'Quantidade' : 'Quantity']: result.sausage, [pt ? 'Unidade' : 'Unit']: 'kg' },
          { [pt ? 'Categoria' : 'Category']: pt ? 'Cerveja' : 'Beer', [pt ? 'Quantidade' : 'Quantity']: result.beer, [pt ? 'Unidade' : 'Unit']: 'L' },
          { [pt ? 'Categoria' : 'Category']: pt ? 'Refrigerante' : 'Soda', [pt ? 'Quantidade' : 'Quantity']: result.soda, [pt ? 'Unidade' : 'Unit']: 'L' },
          { [pt ? 'Categoria' : 'Category']: pt ? 'Água' : 'Water', [pt ? 'Quantidade' : 'Quantity']: result.water, [pt ? 'Unidade' : 'Unit']: 'L' },
          { [pt ? 'Categoria' : 'Category']: pt ? 'Pão de alho' : 'Garlic bread', [pt ? 'Quantidade' : 'Quantity']: result.garlicBread, [pt ? 'Unidade' : 'Unit']: pt ? 'unid' : 'units' },
          { [pt ? 'Categoria' : 'Category']: pt ? 'Farofa' : 'Farofa', [pt ? 'Quantidade' : 'Quantity']: result.farofa, [pt ? 'Unidade' : 'Unit']: 'kg' },
          { [pt ? 'Categoria' : 'Category']: pt ? 'Salada' : 'Salad', [pt ? 'Quantidade' : 'Quantity']: result.salad, [pt ? 'Unidade' : 'Unit']: 'kg' },
          { [pt ? 'Categoria' : 'Category']: pt ? 'Carvão' : 'Charcoal', [pt ? 'Quantidade' : 'Quantity']: result.charcoal, [pt ? 'Unidade' : 'Unit']: 'kg' }
        ] };
      }
      case 'currency': return { name: pt ? 'Moedas' : 'Currency', rows: [{
        [pt ? 'Moeda de origem' : 'Source currency']: this.sourceCurrency,
        [pt ? 'Valor de origem' : 'Source amount']: this.currencyAmount,
        [pt ? 'Moeda de destino' : 'Target currency']: this.targetCurrency,
        [pt ? 'Taxa informada' : 'Entered rate']: this.exchangeRate,
        [pt ? 'Valor convertido' : 'Converted amount']: this.convertedAmount()
      }] };
    }
  }

  /** Normaliza uma série numérica para o viewBox 100 × 44 usado pelos SVGs. */
  private chartPoints(values: number[]): string {
    if (!values.length) return '';
    const max = Math.max(...values, 1);
    const span = Math.max(values.length - 1, 1);
    return values.map((value, index) => `${index / span * 100},${40 - value / max * 36}`).join(' ');
  }
  /** Reduz séries extensas a uma amostra uniforme para manter o SVG leve. */
  private sample(values: number[], count: number): number[] {
    if (values.length <= count) return values;
    return Array.from({ length: count }, (_, index) => values[Math.round(index * (values.length - 1) / (count - 1))]);
  }
  /** Converte uma porcentagem digitada para decimal, respeitando um teto. */
  private percent(value: number, maximum = 100): number { return Math.min(this.positive(value), maximum) / 100; }
  /** Neutraliza NaN, infinito e números negativos antes de usá-los nas fórmulas. */
  private positive(value: number): number { return Number.isFinite(value) ? Math.max(value, 0) : 0; }
}
