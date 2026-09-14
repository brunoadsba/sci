# Plano de Ação SCI/EOR — CODEBA

## Pitch

Ferramenta single-user para acompanhar a revisão da norma SCI/EOR na CODEBA, com persistência local endurecida e exportação para backup/compartilhamento.

## Backlog

1. Scaffold Next.js + shadcn + tema
2. Seed curado (~33 ações) + schemas Zod
3. Storage Dexie + localStorage + draft
4. Dashboard + Tabela + Kanban
5. Cronograma + Histórico + undo/redo
6. Export JSON/CSV/HTML + Import + Restaurar
7. Responsivo + a11y + smoke

## Decisões

- Persistência v1: IndexedDB + localStorage (sem cloud)
- Catálogo fixo: seed é source of truth do conteúdo
- Sem view Cards / Excel / copy Premium
