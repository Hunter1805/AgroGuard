# Runbook Operacional — Fase 17S (Revogação de Credencial + Deploy)

> Complementa `docs/security-credential-rotation.md` com o **passo a passo executável**.
> Ordem recomendada: **Seção A → B → C**. Nenhum valor de chave deve ser colado neste arquivo,
> em logs, tickets ou no repositório.

---

## Contexto confirmado no repositório

| Componente | Onde roda | Observação |
|---|---|---|
| Frontend (React/Vite) | **Vercel** (`vercel.json`, rewrite SPA) | Consome `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (pública) |
| Backend (Fastify) | **Render** (`https://agroguard-4tve.onrender.com/api/v1`) | Usa `SUPABASE_SERVICE_ROLE_KEY` |
| Storage | **Supabase Storage privado** (`agroguard-files`) | Requer service_role no backend |
| Banco/Auth | **Supabase** | Região `sa-east-1` (SP) |

**Ponto crítico:** o provider de storage do backend é `supabase`. Portanto, após rotacionar a
chave, o backend **só volta a funcionar se a nova `SUPABASE_SERVICE_ROLE_KEY` for configurada
no Render**. O deploy do backend é **bloqueante** para uploads/downloads.

---

## Seção A — Revogação da credencial (Supabase)

Execute **antes** do deploy (para que o deploy já suba com a credencial nova).

### A.1 Confirmar o mecanismo de chave
1. Abrir o projeto de **produção** no Supabase → *Project Settings → API Keys*.
2. Identificar se o projeto usa:
   - **Legacy**: `anon` + `service_role` (JWT).
   - **Novo**: `publishable` + `secret`.
3. Se usar o **JWT Secret legado** como base de assinatura: **NÃO** rotacionar sem planejar —
   isso **derruba todas as sessões** dos usuários. Registre a decisão.

### A.2 Inventariar consumidores da chave antiga
- [ ] Backend Render → env var `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Staging/homologação (se compartilha a mesma chave)
- [ ] Jobs/scripts externos de importação ou seed
- [ ] Qualquer integração de terceiros

### A.3 Rotacionar e revogar
1. Gerar a **nova** chave (secret/service_role).
2. Atualizar os consumidores (Render primeiro — ver Seção B).
3. **Revogar/desativar a chave antiga** no painel do Supabase.
4. Registrar: data, responsável, e o **ID do evento de rotação** (sem a chave).

### A.4 Verificação (comprovar a revogação)
- [ ] Painel do Supabase mostra a chave antiga **desativada**.
- [ ] Backend em produção opera com a chave **nova** (healthcheck + um upload real controlado).
- [ ] Tentativas com a chave antiga **falham** (observar no painel/logs do Supabase).
      **Não** reutilize a credencial exposta para "testar" acesso.
- [ ] Atualizar `docs/security-credential-rotation.md` marcando a revogação como **CONFIRMADA**.

---

## Seção B — Deploy do Backend (Render)

1. **Configurar variáveis** no Render (Environment) — sem colar valores em lugar público:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` ← **nova chave (rotacionada)**
   - `SUPABASE_STORAGE_BUCKET=agroguard-files`
   - `UPLOAD_PROVIDER=supabase`
   - `NODE_ENV=production`
   - `CORS_ORIGIN` (domínio do frontend)
   - Confirmar que **`MOCK_ACTOR_ENABLED` NÃO está definido como `true`** (produção lança erro no boot).
2. **Deploy**: acionar o deploy do backend (push em `main` já dispara, se houver auto-deploy).
3. **Validar boot**: confirmar `NODE_ENV=production` e ausência de erro de configuração.
4. **Smoke test**:
   - `GET /api/health` → 200.
   - `GET /api/docs` → Swagger carrega.
5. **Validar proteção de arquivos** (com token real de um usuário da Org):
   - `POST /api/v1/files` sem `Authorization` → esperado **401**.
   - `GET /api/v1/files/<key-de-outra-org>/download` → esperado **403**.
   - `POST /api/v1/files` com a própria org → esperado **201** e `storageKey` sob `${orgId}/attachments/`.

### Rollback do backend
- Reverter para o commit anterior no Render (Deploy → *Rollback*).
- Reconfigurar a `SUPABASE_SERVICE_ROLE_KEY` anterior **somente se** ela ainda estiver válida.
  Se já revogada, restaurar a chave nova é a única opção válida.

---

## Seção C — Deploy do Frontend (Vercel)

1. **Variáveis de build** na Vercel (Project → Settings → Environment Variables):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY` (chave **pública** — nunca a service_role)
   - `VITE_API_BASE_URL=https://agroguard-4tve.onrender.com/api/v1`
2. **Deploy**: push em `main` dispara o build, ou acionar manualmente (Redeploy).
3. **Validar**:
   - Login e navegação funcionam.
   - Nenhum erro de "Configuração ausente no frontend" (a nova checagem em
     `supabase-client.ts` exige as duas variáveis no build).
4. **Confirmar ausência de segredos no bundle** (comando local, sem imprimir valores):

```powershell
cd dist
Select-String -Path ".\assets\*.js" -Pattern "service_role","SUPABASE_SERVICE_ROLE_KEY" -SimpleMatch
# Esperado: nenhuma ocorrência.
```

### Rollback do frontend
- Vercel → Deployments → promover o deploy anterior (Instant Rollback).

---

## Seção D — Ordem e janela

```
A.1 confirmar mecanismo
   └─ A.2 inventariar consumidores
        └─ A.3 rotacionar + atualizar Render (B.1)
             └─ B. deploy backend + smoke tests
                  └─ A.3 revogar chave antiga
                       └─ A.4 verificar revogação
                            └─ C. deploy frontend + verificação
```

> Se a organização usa **JWT Secret legado**, inclua comunicação prévia aos usuários
> (logout global) antes do passo A.3.

---

## Critérios de conclusão (Definition of Done)

- [ ] Chave antiga **revogada** e comprovada (Seção A.4).
- [ ] Backend em produção com a credencial **nova**, uploads funcionando.
- [ ] Frontend em produção com build limpo (sem `service_role`).
- [ ] Testes de acesso cross-tenant retornando **403** em produção.
- [ ] `.env`/`server/.env` continuam fora do versionamento.
