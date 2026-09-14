# Memory — Plano de Ação SCI/EOR — CODEBA

Atualizado: 2026-09-14

## Produto

- Nome canônico: **Plano de Ação SCI/EOR — CODEBA**
- Norma: NO.S8.8.DIP.01 (Rev. 0, 09/08/2024) — fonte primária do catálogo
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
- `next-themes`, `nuqs`, `zod`, `dexie`, `sonner`, `lucide-react`
- Sem auth de app, sem DB cloud, sem env obrigatória na v1
- Logo: `public/logo-codeba.png` (fonte: `Logo CODEBA.png` na raiz)

## Persistência

- Dual-write: IndexedDB (Dexie) + `localStorage` + draft (~300 ms)
- Flush em `beforeunload` / `visibilitychange`
- Autosave **silencioso** (sem toast a cada save)
- Boot: `#embedded-state` (HTML exportado) **vence**; senão o mais recente entre IDB / LS / draft
- Hydrate: seed = catálogo fixo; runtime preserva `responsavel`, `prazo`, `status`, `obs`, `updatedAt`, `bloqueioMotivo`
- Migração: campo legado `onda` → `fase`; `"Usuário local"` → `"Operador"`; prazos legado `D+N` do seed → vazio

## Domínio (pós-auditoria da norma)

- **36 ações** em `src/features/plan/data/seed.ts` (IDs estáveis; +A-13/A-14/A-15)
- Prazos do catálogo começam **vazios**; o operador define na Lista (hydrate limpa legado `D+N` do seed)
- Siglas no header/hero: **SCI** = Sistema de Comando de Incidentes; **EOR** = Estrutura Organizacional de Resposta
- Ordem do catálogo: formalização → lacunas documentais → inconsistências → operacionalização → validação → melhorias
- **Fases** 1–3: crítica/impeditiva → operacionalização → aperfeiçoamento pós-baseline
- Prioridade independente da fase
- Removidos na curadoria anterior: A-11 (marco), C-06 (cibernético)
- Operador: nome no histórico; editável no menu ⋯ (Dialog)
- Marco Fase 1: lacunas documentais (Seções 3–4, organogramas 5.x, 8.8/8.9, regra do CI)

### Lacunas confirmadas no PDF (Fase 1)

- Seções 3 e 4 vazias; 8.8/8.9 só título; organogramas 5.2/5.5 vazios
- Conflito CI: 6.1.a vs 16.3/16.4; forma (###ª em 17.1)
- Anexo de canais oficiais (8.2); Portarias 16.2–16.5 + aprovação 17.1

### Recalibração de verbos (não reinventar o PDF)

- B-* / A-10: operacionalizar / publicar / implementar / executar o que a Rev. 0 já prevê
- C-03..C-05 / C-07..C-08: melhorias pós-baseline (Prioridade Média onde não há lacuna literal)

## UI (estado atual)

- SPA com `?view=` (nuqs): Visão geral | Quadro | Lista | Cronograma | Auditoria
- **Home** = Visão geral (`dashboard`)
- Navegação: logo CODEBA, breadcrumb “Plano” e seta voltar → Visão geral (filtros preservados)
- Switcher: ícones Lucide; mobile labels `Visão` / `Quadro` / `Lista` / `Cron.` / `Log` + fade de scroll
- Header: título mobile `SCI/EOR · CODEBA`; logo com fundo `card`/`muted` (dark-friendly)
- Legenda SCI/EOR sob o título (mobile e desktop) e no hero da Visão geral
- Visão geral: hero + KPIs **antes** dos filtros; filtros colapsáveis no mobile (busca + “Filtros”)
- Toolbar mobile: só tema + ⋯ (undo/redo/export no menu); desktop completo
- Responsivo: touch ~44px, KPIs `2 / 3 / 5` cols, CTAs full-width no mobile
- Motion: fade na troca de view; `prefers-reduced-motion` respeitado
- Menu ⋯: Operador, Importar JSON, Restaurar (AlertDialog)
- Export: JSON / CSV / HTML
- Tema institucional azul CODEBA (`globals.css`)
- Filtros na URL: `fase`, `status`, `resp`, `prio`, `q`, `view`

### Componentes-chave (feature plan)

- `plan-app.tsx` — orquestração
- `plan-header.tsx` — chrome sticky / home / progresso
- `acronym-legend.tsx` — SCI/EOR por extenso
- `plan-view-nav.tsx` — switcher de views
- `plan-filters.tsx` — filtros colapsáveis
- `dashboard-hero.tsx` + `dashboard-view.tsx` + `dashboard-kpi.tsx` — Visão geral
- `plan-toolbar.tsx` — undo/redo, export, tema, ⋯

## Deploy / ops

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
