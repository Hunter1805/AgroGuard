# Validação Pós-Deploy, Smoke Tests e Matriz de Rollback — AgroGuard (v1.0.0)

Este documento registra a homologação técnica pós-deploy, o roteiro de smoke tests em produção e a matriz de rollback em 3 níveis.

---

## 1. Roteiro de Smoke Tests de Produção (Teste de Fumaça)

1. **Acesso & Autenticação**: Abrir `https://app.agroguard.com.br` → Efetuar Login via Supabase Auth → Confirmar direcionamento ao Dashboard.
2. **Consultas de Frotas & Operação**: Consultar listagem de Equipamentos → Abrir ficha detalhada → Registrar nova leitura de medidor (horímetro).
3. **Checklists & Apontamentos**: Preencher Checklist Pré-Operacional → Verificar criação automática de alerta para item não conforme.
4. **Ordens de Serviço (Work Orders)**: Abrir OS Preventiva → Atribuir mecânico → Transicionar status (`aberta` → `em_andamento`) → Consumir filtro de óleo do estoque → Concluir OS.
5. **Storage & Evidências**: Efetuar upload de foto anexa → Verificar armazenagem no bucket privado `agroguard-files/${orgId}/attachments/...` → Testar geração e expiração de URL assinada temporária (3600s).
6. **Auditoria & Rastreabilidade**: Acessar painel de auditoria → Confirmar registro do evento em `audit_logs` sem vazamento de senhas ou chaves.

---

## 2. Liberação Piloto Progressiva

- **Estágio 1 (Equipe Técnica & DevOps)**: Validação de conexões, TLS, CORS e Healthcheck.
- **Estágio 2 (Administradores da Organização)**: Validação de perfis, escopos e cadastros.
- **Estágio 3 (Grupo Piloto)**: 1 Gestor, 1 Planejador, 1 Mecânico, 1 Operador e 1 Almoxarife operando dados reais.
- **Estágio 4 (Liberação Geral)**: Habilitação de acesso a todos os usuários da empresa.

---

## 3. Matriz de Rollback em 3 Níveis

| Nível | Componente Afetado | Ação de Rollback | Critério de Acionamento |
|---|---|---|---|
| **Nível 1** | Frontend (React) | Reverter deploy para o commit anterior da release | Erro visual, loop de re-render ou falha de layout |
| **Nível 2** | Backend API (Fastify) | Re-instanciar versão estável anterior e validar endpoints | Erros 500 recorrentes ou falha de autenticação |
| **Nível 3** | Banco de Dados & Storage | Restaurar dump PostgreSQL (`pg_restore`) e sincronizar arquivos | Vazamento de dados cross-tenant ou perda de integridade |
