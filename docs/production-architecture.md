# Arquitetura de Produção e Auditoria do Repositório — AgroGuard

Este documento especifica a topologia de infraestrutura de produção, o resultado da auditoria de segredos e a separação de ambientes para a versão **v1.0.0**.

---

## 1. Topologia da Arquitetura de Produção

```
  [ Navegador do Usuário / Dispositivo ]
                 │
      ┌──────────┴──────────┐
      │  HTTPS (TLS 1.3)    │
      ▼                     ▼
┌──────────────┐     ┌────────────────┐
│  Frontend    │     │    Backend     │
│ React (Vite) │ ──► │ Fastify (Node) │
└──────────────┘     └───────┬────────┘
                             │ Prisma ORM
                             ▼
              ┌─────────────────────────────┐
              │ Supabase Produção (sa-east) │
              │ ├─ PostgreSQL               │
              │ ├─ Supabase Auth            │
              │ └─ Supabase Storage         │
              └─────────────────────────────┘
```

### Provedores e Região Oficial
- **Frontend**: Hospedagem estática com CDN global (`https://app.agroguard.com.br`).
- **Backend API REST**: Node.js com Fastify (`https://api.agroguard.com.br`), localizado na região **América do Sul (São Paulo - sa-east-1)**.
- **Projeto Supabase Produção**: Projeto independente (`AWS sa-east-1`), isolado da infraestrutura de homologação/testes.

---

## 2. Separação de Ambientes

| Recurso | Desenvolvimento / Local | Homologação (Staging) | Produção (Production) |
|---|---|---|---|
| **Banco de Dados** | PostgreSQL Local / Docker | Supabase Staging | Supabase Produção Dedicado |
| **Bucket Storage** | Local (`./uploads`) | `agroguard-files` (Staging) | `agroguard-files` (Produção Privado) |
| **Domínio Frontend** | `http://localhost:5173` | `https://staging-app.agroguard.com.br` | `https://app.agroguard.com.br` |
| **Domínio Backend** | `http://localhost:3333` | `https://staging-api.agroguard.com.br` | `https://api.agroguard.com.br` |
| **Ator Mockado** | Habilitado via flag se necessário | Desativado | **PROIBIDO** (Lança erro no boot) |

---

## 3. Resultado da Auditoria de Segredos e Repositório

- **Chaves Administrativas no Frontend**: **0 encontradas**. O bundle web consome exclusivamente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
- **Atores Mockados**: Trava explícita em `env.ts` lançando erro crítico se `MOCK_ACTOR_ENABLED=true` em `NODE_ENV=production`.
- **Variáveis Sensíveis**: `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` e `DIRECT_URL` restritas ao ambiente seguro do servidor backend.
- **Arquivos `.env`**: Inseridos no `.gitignore`, apenas `.env.example` versionado com placeholders.
