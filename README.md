# Plano de Ação SCI/EOR — CODEBA

App Next.js 15 para acompanhamento single-user da revisão da norma SCI/EOR na CODEBA.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Deploy

Vercel na raiz do repositório. Sem variáveis de ambiente obrigatórias na v1.

## Persistência

IndexedDB (Dexie) + `localStorage` + draft autosave. Export JSON/CSV/HTML para backup.
