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

Execute os comandos na raiz do repositório, onde ficam [package.json](package.json), [package-lock.json](package-lock.json) e [angular.json](angular.json). Use Node.js 22.12+ na linha 22 e npm; o Angular CLI fixado no lockfile aceita npm 8+ e não exige npm 11. Chrome instalado é necessário para os testes Karma.

```bash
npm ci
npm start
```

```bash
npx ng test --watch=false --browsers=ChromeHeadless
npx ng build --configuration production --base-href /HubCalculadoras/
```

`npm start` usa a configuração de desenvolvimento. O build acima gera os arquivos em `www/`; a configuração de produção substitui [environment.ts](src/environments/environment.ts) por [environment.prod.ts](src/environments/environment.prod.ts). Esses arquivos contêm apenas a propriedade `production`; não há arquivo `.env` a preencher para executar o app web.

Se o Karma não localizar o Chrome no Windows, informe `CHROME_BIN` com o caminho do executável instalado antes de executar os testes. Exemplo em PowerShell, ajustando o caminho conforme a instalação:

```powershell
$env:CHROME_BIN = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm.cmd test -- --watch=false --browsers=ChromeHeadless
```

### Módulos e validação local

- [CalculatorPage](src/app/pages/calculator/calculator.page.ts) concentra entradas, fórmulas, séries dos gráficos e exportação XLSX; HTML e SCSS ficam no mesmo diretório. `onFormChange()` invalida os resultados reativos quando as entradas mudam.
- [LanguageService](src/app/core/language.service.ts) controla PT/EN, o atributo `lang` do documento e a preferência de idioma.
- [Rotas](src/app/app.routes.ts) carregam a página de calculadoras; [main.ts](src/main.ts) configura Angular, Ionic e o roteador.
- [karma.conf.js](karma.conf.js) configura Jasmine/Chrome; [src/test.ts](src/test.ts) inicializa o ambiente Angular de testes.

Os dois arquivos de testes possuem oito casos: criação do app e da página, série de juros compostos, financiamento, descontos sucessivos, churrasco, conversão/inversão de moedas e abertura/fechamento do menu. Os dados sintéticos são definidos em [calculator.page.spec.ts](src/app/pages/calculator/calculator.page.spec.ts) e [app.component.spec.ts](src/app/app.component.spec.ts); não é necessário importar uma base ou preparar contas. Por exemplo, o teste de descontos usa preço 1.000, dois descontos de 10% e três parcelas, verificando preço final 810 e parcela 270.

Essa suíte não verifica download/conteúdo do XLSX, gráficos, foco do teclado ou todas as entradas-limite das fórmulas. Para uma conferência manual com dados sintéticos, use o mesmo exemplo de descontos, alterne PT/EN e exporte a aba ativa para conferir a planilha. Build e testes web não validam projetos nativos Capacitor ou SDKs Android/iOS.

`npm run lint` executa `ng lint`, configurado em `angular.json`, com as regras de [.eslintrc.json](.eslintrc.json). Nas verificações locais de 12/10/2026, instalação offline, oito testes Karma, lint e build passaram com Node.js 22.17.1 e npm 10.9.2. A instalação usou o cache npm desta máquina; isso não comprova instalação com cache vazio.

## 🧠 Regras de cálculo

- Entradas negativas e divisões por zero são neutralizadas.
- A margem do valor-hora é limitada a 95%.
- Juros compostos utilizam capitalização mensal e aportes no fim de cada período.
- O comparativo de deslocamento usa distância diária multiplicada pelos dias informados.

> ⚠️ Os resultados são estimativas educacionais, não aconselhamento financeiro.

---

## 🇬🇧 English

Responsive, ad-free Angular/Ionic app with hourly-rate, compound-interest and commuting-cost calculators. All calculations run locally in the browser and no entered data is stored.
