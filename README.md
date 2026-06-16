# Chamados Internos — Frontend (React + Vite)

Interface web para o sistema de controle de chamados internos. Mostra os chamados
em uma tabela, exibe prioridade/status/responsável e permite **atribuição
automática** de responsável com um clique.

Este é o frontend que consome a **API em Go**:
👉 https://github.com/Dudainfinity/chamados-go

> Implementação do desafio técnico em arquitetura desacoplada (frontend e backend
> como projetos independentes que se comunicam via HTTP/JSON). Existe também uma
> versão monolítica em Ruby on Rails:
> https://github.com/Dudainfinity/desafio-codificar-chamados

## Stack

- **React 19**
- **Vite** — bundler e dev server com HMR
- **Fetch API** — comunicação com o backend (sem dependências extras)
- **ESLint** — padronização de código

## Como rodar

O frontend sozinho não exibe dados — ele precisa da **API Go no ar**. A ordem é:
banco → API → frontend.

### 1. Banco de dados e API (no projeto `chamados-go`)

```bash
cd ../chamados-go
docker compose up -d     # sobe o PostgreSQL (porta 5436)
go run ./cmd/api         # sobe a API em http://localhost:8090
```

### 2. Frontend (este projeto)

```bash
npm install
npm run dev              # sobe em http://localhost:5173
```

Abra o endereço mostrado no terminal (ex.: `http://localhost:5173`). A tabela de
chamados deve aparecer com os dados vindos da API.

## Configuração

O endereço da API fica em `src/App.jsx`:

```js
const API = "http://localhost:8090";
```

O backend já libera **CORS** para qualquer origem `http://localhost:*`, então o
Vite funciona mesmo que suba em outra porta (5174, 5175, …).

## Funcionalidades

- Listagem de chamados em tabela (título, prioridade, status, responsável)
- Botão **Atribuir auto** — chama `POST /tickets/:id/assign-auto` e recarrega a lista
- Botão **Recarregar** para atualizar os dados manualmente
- Tratamento de erro de rede: se a API estiver fora do ar, a tela mostra uma
  mensagem clara em vez de travar em "Carregando..."
- Estados de carregando e de lista vazia

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de produção (gera `dist/`) |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm run lint` | Verifica o código com ESLint |

## Estrutura

```
src/
  main.jsx      # ponto de entrada do React
  App.jsx       # componente principal (tabela + chamadas à API)
  index.css     # estilos globais
```
