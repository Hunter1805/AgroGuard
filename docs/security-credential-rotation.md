# Rotação e Revogação de Credencial — Fase 17S (AgroGuard)

> **AVISO OBRIGATÓRIO**
> Este documento descreve o **procedimento operacional**. Ele **não** é a confirmação de que
> a credencial foi revogada. A exposição só é considerada contenida quando a revogação for
> executada e verificada (seção 5). Nenhum valor de chave é registrado aqui, por política.

---

## 1. O que foi corrigido no código (escopo desta fase)

- Remoção do fallback hardcoded de `SUPABASE_SERVICE_ROLE_KEY` em `server/src/config/env.ts`.
- Remoção dos fallbacks para `VITE_SUPABASE_ANON_KEY` e `SUPABASE_ANON_KEY`.
- Remoção do fallback hardcoded da chave anon em `src/lib/supabase/supabase-client.ts`.
- Rotas de arquivos com autenticação, escopo organizacional, permissão e isolamento por tenant.
- Eliminação do fallback `default-org` no upload.
- Validação de namespace/traversal antes de qualquer operação de storage.

**Importante:** a remoção do código **não revoga** a credencial que já esteve exposta. É
necessária a rotação descrita abaixo.

---

## 2. Identificação do mecanismo de chave (antes de rotacionar)

Antes de agir, identifique **qual tipo de chave** esteve exposta e os consumidores dela. No
Supabase existem chaves com impactos distintos:

| Chave | Papel | Efeito de rotacionar |
|---|---|---|
| `anon` (JWT com `"role":"anon"`) | Pública por design; usada pelo frontend | Reemissão invalida apenas o valor antigo; sessões de usuário continuam válidas |
| `service_role` (JWT com `"role":"service_role"`) | **Privilégio administrativo total**; ignora RLS | **Rotação obrigatória e prioritária**. Não expõe por si só sessões de usuários finais, mas concede acesso administrativo total |
| JWT Secret legado | Base de assinatura dos tokens (modo legado) | **Rotacionar invalida TODAS as sessões e tokens de usuário** — impacto amplo |

### Chave encontrada neste projeto
A credencial removida do código era uma **chave `service_role`** (o payload do JWT trazia
`"role":"service_role"`). Portanto:

- **Não houve** exposição do *JWT Secret* legado → a rotação **não precisa** invalidar todas
  as sessões (caso o projeto use as novas chaves de API publicáveis/secretas do Supabase).
- Ainda assim, **confirme no painel do Supabase** qual mecanismo está ativo para este projeto
  (abas *Project Settings → API Keys*), pois projetos migrados usam pares
  publishable/secret em vez de anon/service_role.

> **Regra:** só recomende a rotação do JWT Secret se for confirmado que o projeto depende dele.
> Caso contrário, rotacionar por engano **derrubaria sessões ativas** de todos os usuários.

---

## 3. Passos de rotação/revogação no Supabase

Executar com acesso administrativo ao projeto **de produção** (não usar produção para testes).

1. **Inventariar consumidores** da chave antes de trocar:
   - Backend (Render/VPS): variável `SUPABASE_SERVICE_ROLE_KEY`.
   - Rotinas de importação/seed e jobs administrativos fora do app.
   - Scripts internos de operação (não devem residir no repositório).
2. Acessar **Project Settings → API Keys** no Supabase.
3. **Rotacionar a chave `service_role`** (ou *roll* da secret key correspondente):
   - Gere a nova chave.
   - **Não** cole o valor em arquivos versionados, tickets ou logs.
4. **Revogar a chave antiga** imediatamente após atualizar os consumidores (o Supabase permite
   manter a nova e desativar a anterior).
5. Atualizar os ambientes dependentes:
   - Backend de produção: `SUPABASE_SERVICE_ROLE_KEY` (nova).
   - Backend de homologação/staging: se compartilhava a mesma chave, atualizar também.
   - Serviços externos/jobs: atualizar e reiniciar.
6. **Se e somente se** o projeto usar o JWT Secret legado e ele tiver sido exposto:
   - Rotacionar o JWT Secret **causará logout global** dos usuários finais.
   - Planejar janela de comunicação com os usuários.
7. Verificar se a chave antiga foi realmente invalidada (seção 5).

---

## 4. Atualização do ambiente e verificação de bundle

Após a rotação, garantir que o novo valor **não** vaze para o frontend:

- Rodar `npm run build` e confirmar que o bundle **não** contém `service_role`,
  `SUPABASE_SERVICE_ROLE_KEY` nem fragmentos das chaves.
- Confirmar que o frontend consome apenas `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
  (chave anon é pública por design; nunca a service_role).
- Confirmar que `.env` e `server/.env` permanecem no `.gitignore`.

Comando de verificação local (não expõe valores, apenas procura padrões nomeados):

```powershell
cd dist
Select-String -Path ".\assets\*.js" -Pattern "service_role","SUPABASE_SERVICE_ROLE_KEY" -SimpleMatch
# Resultado esperado: nenhuma ocorrência.
```

---

## 5. Verificação posterior (comprovação da revogação)

Só declare a exposição **contida** após:

1. Confirmar no painel do Supabase que a **chave antiga está revogada/desativada**.
2. Confirmar que o backend em produção opera com a **nova** chave (healthcheck + operação de
   upload de arquivo real em ambiente controlado).
3. Confirmar que tentativas com a chave antiga **falham** (validação via painel/logs do
   Supabase — **não** reutilize a credencial exposta para "testar" acesso).
4. Registrar data, responsável e evidência (IDs de changelog do Supabase, sem valores).

---

## 6. Estado do trabalho (separação de responsabilidades)

| Item | Estado |
|---|---|
| Correção de código (remover segredo/fallbacks, proteger arquivos) | **Concluída no escopo desta fase** |
| Credencial revogada | **PENDENTE** — requer ação manual no Supabase (seção 3 + 5) |
| Correção publicada em produção (deploy) | **PENDENTE** — requer deploy do backend e do frontend |

> A separação acima é deliberada: código corrigido ≠ credencial revogada ≠ correção publicada.
