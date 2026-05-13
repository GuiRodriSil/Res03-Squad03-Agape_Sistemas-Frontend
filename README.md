# Agape Frota

Dashboard web para gestão de frotas, com foco em indicadores operacionais, filtros avançados, visualização de consumo, quilometragem, status dos veículos e geração de relatórios.

## Visão geral

O projeto foi construído com React, TypeScript e Vite, usando componentes do shadcn/ui e gráficos com Recharts. Atualmente os dados são carregados a partir de uma camada local de mock, já organizada para futura integração com API REST.

Principais recursos:

- Cards de KPI com métricas da operação
- Filtros por período, veículo e status
- Gráficos de consumo, postos e quilometragem
- Visão de status operacional da frota
- Geração de relatórios a partir dos filtros aplicados

## Stack

- React 19
- TypeScript
- Vite 7
- Tailwind CSS 4
- shadcn/ui com Radix UI
- Recharts

## Pré-requisitos

- Node.js 20 ou superior
- npm 10 ou superior

## Como rodar o projeto

Os comandos abaixo devem ser executados dentro da pasta `agape-frota`.

```bash
cd agape-frota
npm install
npm run dev
```

Depois disso, abra no navegador o endereço informado pelo Vite, normalmente:

```text
http://localhost:5173
```

## Scripts disponíveis

```bash
npm run dev
```

Inicia o servidor de desenvolvimento com recarregamento automático.

```bash
npm run build
```

Gera a build de produção e executa a checagem de tipos do TypeScript.

```bash
npm run preview
```

Inicia um servidor local para visualizar a build de produção.

```bash
npm run lint
```

Executa a análise estática com ESLint.

```bash
npm run typecheck
```

Executa apenas a validação de tipos com TypeScript.

```bash
npm run format
```

Formata os arquivos TypeScript e TSX com Prettier.

## Estrutura do projeto

```text
src/
	app/
		models/       Tipos e interfaces TypeScript
		services/     Regras de negócio e dados do dashboard
		context/      Espaço reservado para estado global
		utils/        Utilitários da aplicação
	views/
		components/   Componentes reutilizáveis e UI
		pages/        Páginas principais
	styles/         Estilos globais
```

## Fluxo atual dos dados

- A aplicação renderiza a página principal em `src/App.tsx`
- A tela principal está em `src/views/pages/Dashboard.tsx`
- Os dados são obtidos via `src/app/services/dataService.ts`
- Os filtros alteram os dados exibidos nos KPIs, gráficos e relatórios

## Arquitetura e documentação técnica

Para detalhes de componentes, modelo de dados e evolução planejada, consulte o arquivo `ARCHITECTURE.md`.

## Build e publicação

Para gerar os arquivos de produção:

```bash
cd agape-frota
npm install
npm run build
```

Os artefatos serão gerados na pasta `dist/`.

Para validar localmente a build antes de publicar:

```bash
npm run preview
```

## Situação atual do projeto

- Interface pronta para uso local
- Dados em mock para demonstração e validação visual
- Estrutura preparada para integrar backend no futuro

## Próximos passos sugeridos

- Integrar com API REST
- Adicionar testes unitários e E2E
- Introduzir gerenciamento global de estado
- Evoluir exportação de relatórios com dados reais

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
