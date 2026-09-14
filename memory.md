# Memory — Plano de Ação SCI/EOR — CODEBA

Atualizado: 2026-09-14

## Produto

- Nome canônico: **Plano de Ação SCI/EOR — CODEBA**
- Norma: NO.S8.8.DIP.01
- Single-user, free, hospedagem Vercel
- Origem: protótipo `reference/sci.html` (legado; não produção)
- Remoto: https://github.com/brunoadsba/sci.git (`main`)
- Produção: https://sci-plan.vercel.app
- Projeto Vercel: `sci-plan` (team `brunos-projects-26abb09d`)
- Alias legado ainda ativo: `sci-gules.vercel.app` (mesmo deploy)

## Papel / escopo de contribuição

- Bruno **não** contribui no conteúdo técnico da norma (redação, critérios operacionais, procedimentos de emergência).
- Contribuição: **tecnologia** — ferramenta de acompanhamento, organização/atualização das informações, status, histórico, exportações e melhorias de UX.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind v4 + shadcn/ui (Radix)
- `next-themes`, `nuqs`, `zod`, `dexie`, `sonner`
- Sem auth de app, sem DB cloud, sem env obrigatória na v1
- Logo: `public/logo-codeba.png` (fonte: `Logo CODEBA.png` na raiz)

## Persistência

- Dual-write: IndexedDB (Dexie) + `localStorage` + draft (~300 ms)
- Flush em `beforeunload` / `visibilitychange`
- Autosave **silencioso** (sem toast a cada save)
- Boot: `#embedded-state` (HTML exportado) **vence**; senão o mais recente entre IDB / LS / draft
- Hydrate: seed = catálogo fixo; runtime preserva `responsavel`, `prazo`, `status`, `obs`, `updatedAt`, `bloqueioMotivo`
- Migração: campo legado `onda` → `fase`; `"Usuário local"` → `"Operador"`

## Domínio

- ~33 ações curadas em `src/features/plan/data/seed.ts`
- **Fases** 1–3 (ex-ondas): crítica → operacionalização → sustentabilidade
- Prioridade independente da fase
- Removidos na curadoria: A-11 (marco), C-06 (cibernético)
- Operador: nome no histórico; editável no menu ⋯ (Dialog)
- Marcos: `PHASE_MILESTONES` (ex.: Minuta v0.1 na Fase 1)

## UI (estado atual)

- Views: Visão geral | Quadro | Lista | Cronograma | Auditoria
- Header: logo CODEBA (topo esquerdo) + título + badge progresso + toolbar enxuta
- Menu ⋯: Operador, Importar JSON, Restaurar (AlertDialog)
- Export: JSON / CSV / HTML
- Tema institucional azul CODEBA (`globals.css`)
- Filtros na URL via `nuqs` (`fase`, `status`, `resp`, `prio`, `q`, `view`)

## Deploy / ops

- Último commit relevante: `d296ccb` (fase, Operador, logo, UX)
- CLI: `vercel deploy --prod -y --scope brunos-projects-26abb09d`
- Após deploy, garantir alias: `vercel alias set <url-deploy> sci-plan.vercel.app --scope brunos-projects-26abb09d`
- Se pedir login Vercel ao abrir o site: Settings → Deployment Protection → desligar **Require Log In**

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
```
