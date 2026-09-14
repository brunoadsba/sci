# Memory — Plano de Ação SCI/EOR — CODEBA

Atualizado: 2026-09-14

## Produto

- Nome canônico: **Plano de Ação SCI/EOR — CODEBA**
- Norma: NO.S8.8.DIP.01
- Single-user, free, hospedagem Vercel
- Origem: protótipo `reference/sci.html` (antes `sci.html` monolítico ~3.4k linhas)
- Remoto: https://github.com/brunoadsba/sci.git (estava vazio no início)

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind v4 + shadcn/ui (Radix)
- `next-themes`, `nuqs`, `zod`, `dexie`, `sonner`
- Sem auth, sem DB cloud, sem env obrigatória na v1
- React Grab no `dev` + scripts no `layout` (somente development)

## Persistência (decisão fechada)

- Dual-write: IndexedDB (Dexie) + `localStorage` + draft (`~300ms` debounce)
- Flush em `beforeunload` / `visibilitychange`
- Boot: `#embedded-state` (HTML exportado) **vence**; senão o mais recente entre IDB / LS / draft
- `hydrate()`: seed = catálogo fixo de conteúdo; runtime só preserva `responsavel`, `prazo`, `status`, `obs`, `updatedAt`, `bloqueioMotivo`
- Undo/redo **não** grava no histórico; histórico só `alteracao` | `importacao`

## Domínio curado

- Seed: **33 ações** em `src/features/plan/data/seed.ts`
- Removidos: A-11 (virou marco de onda), C-06 (cibernético fora do núcleo)
- Fundidos: A-07+A-08→A-07; B-01+B-02→B-01; B-04+B-05→B-05; B-09+B-10→B-09; B-11+C-10→B-11; B-16+C-09→B-16
- Reclassificados: A-10 → Onda 2/Alta; C-01 → Onda 1/Alta (RACI cedo); C-05 → só falha de sistemas/TI
- Marcos: `WAVE_MILESTONES` (ex.: Minuta v0.1 na Onda 1)
- Campo extra: `bloqueioMotivo` quando status = Bloqueado
- Prioridade independente da onda (não é mais espelho 1:1)

## UI (escopo v1)

Manter: Dashboard, Kanban (pointer DnD único), Tabela, Cronograma (ex-Gantt), Histórico  
Removido: Cards, Excel, botão Imprimir, copy “Premium v4”, dual HTML5+pointer DnD  
Edição: inline status/responsável/prazo; modal só obs (+ detalhe read-only)  
Export: JSON (backup) + CSV + HTML com estado  
Toolbar: Undo/Redo | Usuário | Tema | Export▾ | Import | Restaurar

## Estrutura relevante

```
src/
  app/                    # layout, page, globals
  features/plan/          # domínio, views, hooks, seed, schemas
  features/export/        # JSON/CSV/HTML
  lib/storage/            # Dexie + LS + draft + chooseInitialState
  components/ui/          # shadcn
reference/sci.html        # legado (não produção)
PLAN.md
```

## Estado técnico

- `npm run build` e `npm run lint` OK após migração
- App providers: NuqsAdapter + ThemeProvider + PlanProvider + Sonner
- Filtros/view na URL via `nuqs`
- Página raiz com `Suspense` (CSR bailout do `useSearchParams`)

## Riscos / próximos

- Limpeza de dados do browser perde estado → mitigar com export JSON
- Fase 2 (só se precisar): sync cloud (Supabase free) multi-dispositivo
- Ainda não commitado/pushado para o GitHub na última sessão de implementação
- YAGNI v1: sem porto/dependências/seção normativa no modelo

## Comandos

```bash
npm install
npm run dev    # React Grab + next dev --turbopack
npm run build
npm run lint
```
