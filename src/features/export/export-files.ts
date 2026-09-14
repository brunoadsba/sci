import { csvEscape, downloadBlob } from "@/lib/dates";
import type { AppState } from "@/features/plan/types";

export function exportJson(state: AppState) {
  const payload = {
    ...state,
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  downloadBlob(`plano-sci-eor-codeba-${dateStamp()}.json`, blob);
}

export function exportCsv(state: AppState) {
  const headers = [
    "id",
    "fase",
    "prioridade",
    "acao",
    "entregavel",
    "responsavel",
    "prazo",
    "criterio",
    "status",
    "obs",
    "bloqueioMotivo",
  ];
  const lines = [
    headers.join(";"),
    ...state.actions.map((action) =>
      headers.map((key) => csvEscape(action[key as keyof typeof action])).join(";")
    ),
  ];
  const blob = new Blob(["\uFEFF" + lines.join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  downloadBlob(`plano-sci-eor-codeba-${dateStamp()}.csv`, blob);
}

export function exportHtmlSnapshot(state: AppState) {
  const payload = {
    ...state,
    exportedAt: new Date().toISOString(),
  };
  const embedded = JSON.stringify(payload).replace(/</g, "\\u003c");
  const rows = state.actions
    .map(
      (a) => `<tr>
      <td>${escapeHtml(a.id)}</td>
      <td>${a.fase}</td>
      <td>${escapeHtml(a.prioridade)}</td>
      <td>${escapeHtml(a.acao)}</td>
      <td>${escapeHtml(a.status)}</td>
      <td>${escapeHtml(a.responsavel)}</td>
      <td>${escapeHtml(a.prazo)}</td>
      <td>${escapeHtml(a.obs)}</td>
    </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Plano de Ação SCI/EOR — CODEBA (snapshot)</title>
  <style>
    body{font-family:system-ui,sans-serif;margin:1.5rem;color:#17233a;background:#f4f7fb}
    h1{font-size:1.25rem;margin:0 0 .5rem}
    p{color:#5b677a}
    table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #dbe2ec}
    th,td{border:1px solid #dbe2ec;padding:.5rem;text-align:left;vertical-align:top;font-size:.9rem}
    th{background:#f8fafc}
    @media print{body{background:#fff;margin:0}}
  </style>
</head>
<body>
  <h1>Plano de Ação SCI/EOR — CODEBA</h1>
  <p>Snapshot exportado em ${escapeHtml(new Date().toLocaleString("pt-BR"))} · Usuário: ${escapeHtml(state.user)}</p>
  <table>
    <thead>
      <tr>
        <th>ID</th><th>Fase</th><th>Prioridade</th><th>Ação</th>
        <th>Status</th><th>Responsável</th><th>Prazo</th><th>Obs</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <script type="application/json" id="embedded-state">${embedded}</script>
  <p style="margin-top:1rem;font-size:.85rem">Para editar novamente, importe o JSON correspondente no app ou abra este HTML no app se o boot priorizar <code>#embedded-state</code>.</p>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  downloadBlob(`plano-sci-eor-codeba-${dateStamp()}.html`, blob);
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, (match) =>
    (
      {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      } as Record<string, string>
    )[match]!
  );
}
