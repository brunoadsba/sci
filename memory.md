# Memory — Plano de Ação SCI/EOR — CODEBA

Atualizado: 2026-09-14

## Produto

- Nome canônico: **Plano de Ação SCI/EOR — CODEBA**
- Norma: NO.S8.8.DIP.01
- Single-user, free, hospedagem Vercel
- Origem: protótipo `reference/sci.html`
- Remoto: https://github.com/brunoadsba/sci.git
- Produção: https://sci-plan.vercel.app
- Projeto Vercel: `sci-plan` (team brunos-projects-26abb09d)

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind v4 + shadcn/ui (Radix)
- `next-themes`, `nuqs`, `zod`, `dexie`, `sonner`
- Sem auth, sem DB cloud, sem env obrigatória na v1
- Logo: `public/logo-codeba.png`

## Persistência

- Dual-write: IndexedDB (Dexie) + `localStorage` + draft (~300ms)
- Boot: `#embedded-state` vence; senão mais recente IDB/LS/draft
- Hydrate: seed fixo; runtime fields + migração `onda`→`fase`

## Domínio

- 33 ações; fases 1–3 (ex-ondas)
- Operador (ex-Usuário local) para auditoria do histórico
- Marcos via `PHASE_MILESTONES`

## UI

- Views: Visão geral | Quadro | Lista | Cronograma | Auditoria
- Header: logo CODEBA (esq.) + título + progresso + toolbar enxuta
- Tema institucional azul CODEBA

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
```
