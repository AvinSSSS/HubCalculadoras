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
- 🔥 **Churrasco:** gera uma lista de carnes, bebidas, acompanhamentos e carvão conforme convidados, duração e perfil de consumo.
- 💱 **Conversor de moedas:** converte valores com uma taxa informada pelo usuário, sem consultar APIs externas.

Cada calculadora inclui um gráfico responsivo e pode exportar seus resultados para um arquivo Excel (`.xlsx`).

### Referências da calculadora de churrasco

A metodologia foi baseada na [Calculadora de Churrasco do Calcula Geral](https://calculageral.com.br/calculadora-churrasco), que consolida referências de Minha Receita, Assaí, Zaffari, iFood, Ki Brasa e Carvão Matão. Foram adotadas as seguintes faixas:

- Carne: 350–500 g por adulto e 150–200 g por criança, dividida em 40% bovina, 40% frango e 20% linguiça.
- Bebidas: 1,5–2 L de cerveja por adulto, 1 L de refrigerante e 0,5–1 L de água por pessoa.
- Acompanhamentos: 100 g de farofa, um pão de alho e 150 g de salada por pessoa.
- Carvão: 0,6–1,5 kg por pessoa, conforme a duração do evento.

Perfil e duração movimentam o consumo dentro dessas faixas. Os resultados são estimativas para planejamento e podem ser ajustados conforme o público.

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
- O prazo dos juros compostos é arredondado para baixo e limitado a 1.200 meses; valores negativos, vazios ou não finitos equivalem a zero meses. Resumo, gráfico e exportação usam o mesmo prazo.
- O comparativo de deslocamento usa distância diária multiplicada pelos dias informados.

> ⚠️ Os resultados são estimativas educacionais, não aconselhamento financeiro.

---

## 🇬🇧 English

Responsive, ad-free Angular/Ionic app with hourly-rate, compound-interest and commuting-cost calculators. All calculations run locally in the browser and no entered data is stored.
