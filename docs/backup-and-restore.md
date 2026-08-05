# Procedimento de Backup e Restauração — AgroGuard (Homologação / Produção)

Este documento estabelece o procedimento operacional padrão (SOP) para backup e restauração do banco de dados **Supabase PostgreSQL** e do **Supabase Storage**.

---

## 1. Backup do Banco de Dados PostgreSQL (pg_dump)

Para realizar o backup lógico completo do banco de dados:

```bash
# Exportação via pg_dump seguro usando a URL direta de sessão do Supabase
pg_dump "postgresql://postgres.poihrnbinlgehvrbrkwu:SENHA@aws-0-sa-east-1.pooler.supabase.com:5432/postgres" \
  --clean --if-exists --quote-all-identifiers \
  --file="agroguard_backup_$(date +%Y%m%d_%H%M%S).sql"
```

## 2. Restauração do Banco em Novo Ambiente (pg_restore / psql)

Para restaurar um backup em uma instância limpa:

```bash
# 1. Conectar e aplicar o dump SQL
psql "postgresql://postgres.NOVA_INSTANCIA@host:5432/postgres" < agroguard_backup_20260805.sql

# 2. Validar integridade e migrações do Prisma
cd server
npx prisma migrate status
npx prisma db seed
```

## 3. Sincronização e Restauração de Arquivos (Supabase Storage)

1. Os metadados de arquivos em `storage.objects` e na tabela interna de anexos são mantidos de forma referente.
2. O bucket privado `agroguard-files` é recriado em `storage.buckets` com as mesmas restrições (`public: false`, `file_size_limit: 20971520`).

---

## 4. Testes de Restauração Validados
- Backup SQL testado e compatível com as migrações Prisma existentes.
- Correspondência entre IDs e `storageKey` mantida após a recarga.
