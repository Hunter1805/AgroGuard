# Guia de Implantação e Sequência de Deploy de Produção — AgroGuard (v1.0.0)

Este documento especifica o protocolo da janela de deploy inicial e a ordem de execução da migração para produção.

---

## 1. Protocolo da Janela de Deploy Inicial

A implantação de produção segue a sequência estrita em 8 etapas:

1. **Backup Pré-Implantação**: Execução do dump `pg_dump` no banco de origem e snapshot dos arquivos do Storage.
2. **Banco de Dados & Schemas**: Conexão com o Supabase PostgreSQL de Produção.
3. **Migrações de Banco**: Execução do comando `npx prisma migrate deploy` no servidor backend.
4. **Seed Estrutural de Produção**: Execução de `npx tsx prisma/seeds/production.seed.ts` para carregar perfis e numerações essenciais.
5. **Configuração do Storage & Auth**: Validação do bucket privado `agroguard-files` e redirecionamentos do Supabase Auth.
6. **Deploy do Backend (Fastify)**: Inicialização do servidor em `NODE_ENV=production` com `LOG_LEVEL=info`.
7. **Deploy do Frontend (React/Vite)**: Publicação do bundle otimizado com `VITE_API_BASE_URL` pública.
8. **Smoke Tests & Ativação de Jobs**: Execução do teste de fumaça inicial e ativação das automações no `schedulerService`.

---

## 2. Reconciliação e Controle de Legado

- Todas as entidades importadas de sistemas legados registram seu mapeamento em `legacy_id_maps`.
- Não é permitida nenhuma discrepância em quantidades, valores de estoque ou leituras de medidores.
