# 🧮 Hub de Calculadoras Úteis

[![Deploy](https://github.com/AvinSSSS/HubCalculadoras/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/AvinSSSS/HubCalculadoras/actions/workflows/deploy-pages.yml)
[![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular)](https://angular.dev/)

Web app responsivo e sem anúncios para resolver cálculos recorrentes com rapidez e transparência.

🌐 **Demonstração:** [avinssss.github.io/HubCalculadoras](https://avinssss.github.io/HubCalculadoras/)

## ✨ Calculadoras incluídas

- 💼 **Valor-hora:** considera renda desejada, custos, horas faturáveis e margem.
- 📈 **Juros compostos:** projeta saldo, capital investido e rendimento estimado.
- 🚗 **Deslocamento:** compara o custo mensal de veículo a combustão e elétrico.
- 🏦 **Financiamento:** estima parcela fixa, juros totais e evolução do saldo devedor.
- 🏷️ **Descontos:** combina descontos sucessivos e calcula o parcelamento do preço final.

Cada calculadora inclui um gráfico responsivo e pode exportar seus resultados para um arquivo Excel (`.xlsx`).

Todos os cálculos acontecem localmente. Nenhum valor digitado é transmitido ou armazenado.

## 🛠️ Tecnologias

- Ionic 8 e Angular 20 com componentes standalone.
- TypeScript e formulários Angular.
- SCSS responsivo e `Intl.NumberFormat` para valores em reais.
- SheetJS para geração local de planilhas Excel.
- Karma/Jasmine e Chrome Headless.
- GitHub Actions e GitHub Pages.

## 🚀 Executar e validar

Requisitos: Node.js 22+ e npm 11+.

```bash
npm ci
npm start
```

```bash
npx ng test --watch=false --browsers=ChromeHeadless
npx ng build --configuration production --base-href /HubCalculadoras/
```

## 🧠 Regras de cálculo

- Entradas negativas e divisões por zero são neutralizadas.
- A margem do valor-hora é limitada a 95%.
- Juros compostos utilizam capitalização mensal e aportes no fim de cada período.
- O comparativo de deslocamento usa distância diária multiplicada pelos dias informados.

> ⚠️ Os resultados são estimativas educacionais, não aconselhamento financeiro.

---

## 🇬🇧 English

Responsive, ad-free Angular/Ionic app with hourly-rate, compound-interest and commuting-cost calculators. All calculations run locally in the browser and no entered data is stored.
