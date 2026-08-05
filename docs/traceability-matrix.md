# Matriz de Rastreabilidade de Testes — Sistema AgroGuard

Esta matriz de rastreabilidade mapeia a cobertura de testes para os 22 módulos do sistema AgroGuard, relacionando **Módulo → Requisito → Regra de Negócio → Teste Unitário → Teste de Integração → Teste E2E → Resultado Esperado**.

---

| # | Módulo | Requisito | Regra de Negócio Crítica | Teste Unitário | Teste Integração | Teste E2E | Resultado Esperado |
|---|---|---|---|---|---|---|---|
| 1 | **Autenticação** | Token JWT real via Supabase Auth | Usuários bloqueados/inativos não acessam operativamente | `security-auth.test.ts` | `authGuard.test.ts` | `e2e/login.spec.ts` | Acesso concedido apenas a usuários ativos |
| 2 | **Usuários & Perfis** | Gestão de Usuários e Perfis | Não permitir email duplicado; vinculo `UserRole` | `users-domain.test.ts` | `user.routes.test.ts` | `e2e/users.spec.ts` | Cadastro e associação de papéis idempotentes |
| 3 | **Permissões** | Matriz de Permissões Efetivas | Concessão/Negação individual sobrepõe perfil | `permissions-domain.test.ts` | `authGuard.test.ts` | `e2e/permissions.spec.ts` | Avaliação estrita das permissões no backend |
| 4 | **Escopos Organizacionais** | Contexto Multitenant | Acesso restrito aos IDs organizacionais do token | `tenant-isolation.test.ts` | `organization.routes.test.ts` | `e2e/multitenant.spec.ts` | Cross-Tenant Block (HTTP 403) em qualquer rota |
| 5 | **Empresas & Unidades** | Estrutura Organizacional | Empresas e Unidades pertencem à Organização | `org-domain.test.ts` | `organization.routes.test.ts` | `e2e/org.spec.ts` | Integridade referencial e filtro tenant |
| 6 | **Cadastros Auxiliares** | Master Data | Tipos, Marcas, Modelos e Unidades de Medida | `masterdata-domain.test.ts` | `masterdata.routes.test.ts` | `e2e/masterdata.spec.ts` | Upsert sem duplicação de códigos master |
| 7 | **Equipamentos** | Catálogo de Frotas | Código do equipamento único por organização | `equipment-domain.test.ts` | `equipment.routes.test.ts` | `e2e/equipments.spec.ts` | Cadastro e vinculação com medidores |
| 8 | **Leituras & Horímetros** | Apontamento de Medidores | Impedir leitura regressiva não justificada | `readings-domain.test.ts` | `equipment.routes.test.ts` | `e2e/readings.spec.ts` | Atualização atômica do medidor do equipamento |
| 9 | **Checklists** | Execução de Checklists | Itens críticos geram não conformidade automática | `checklist-domain.test.ts` | `checklist.routes.test.ts` | `e2e/checklists.spec.ts` | Geração imediata de apontamento de falha |
| 10 | **Não Conformidades** | Trativa de Problemas | Resolução bloqueia fechamento indevido | `nonconformity.test.ts` | `checklist.routes.test.ts` | `e2e/checklists.spec.ts` | Status atualizado até encerramento |
| 11 | **Manutenções Preventivas** | Planos e Gatilhos | Gatilhos por horímetro, km e intervalo em dias | `maintenance-domain.test.ts` | `work-order.routes.test.ts` | `e2e/maintenance.spec.ts` | Recálculo automático de próximas revisões |
| 12 | **Ordens de Serviço** | Fluxo de OS | Máquina de estado (aberta → andamento → encerrada) | `state-machine.test.ts` | `work-order.routes.test.ts` | `e2e/workorders.spec.ts` | Transições válidas com bloqueio de concorrência |
| 13 | **Pneus & Rodados** | Gestão de Rodados | Profundidade de sulco crítica alerta troca | `tires-domain.test.ts` | `tires.routes.test.ts` | `e2e/tires.spec.ts` | Histórico de posições e movimentações mantido |
| 14 | **Ferramentas & Kits** | Controle de Ferramental | Empréstimos e calibrações vencidas bloqueiam uso | `tools-domain.test.ts` | `tools.routes.test.ts` | `e2e/tools.spec.ts` | Notificação automática de calibração pendente |
| 15 | **Estoque & Peças** | Controle de Materiais | Cálculo de custo médio e saldo não negativo | `stock-domain.test.ts` | `stock.routes.test.ts` | `e2e/stock.spec.ts` | Movimentação com lock de concorrência |
| 16 | **Arquivos & Anexos** | Supabase Storage Privado | Upload restrito por MIME e pasta `${orgId}/...` | `storage.test.ts` | `file.routes.test.ts` | `e2e/files.spec.ts` | URLs assinadas temporárias (3600s) |
| 17 | **Importação & Legacy** | Pipeline de Importação | Simulação Dry Run e mapeamento em `legacy_id_maps` | `import-domain.test.ts` | `import.routes.test.ts` | `e2e/imports.spec.ts` | Reconciliação completa com contagem de erros |
| 18 | **Central de Alertas** | Notificações Operacionais | Não duplicar alertas ativos para o mesmo fato | `alerts-domain.test.ts` | `job.routes.test.ts` | `e2e/alerts.spec.ts` | Auto-resolução quando a causa é sanada |
| 19 | **Automações Operacionais** | Jobs Agendados | `ScheduledJob` idempotente com medição de duração | `jobs-domain.test.ts` | `job.routes.test.ts` | `e2e/jobs.spec.ts` | Log de execução sem duplicar tarefas |
| 20 | **Relatórios & BI** | Indicadores e Agregações | Filtro multi-tenant em todas as agregações | `reports-domain.test.ts` | `reports.routes.test.ts` | `e2e/reports.spec.ts` | Relatórios consolidados com colunas dinâmicas |
| 21 | **Auditoria** | Rastreabilidade Geral | Registro de atuações sem vazamento de segredos | `audit-domain.test.ts` | `audit.routes.test.ts` | `e2e/audit.spec.ts` | Logs imutáveis para auditoria compliance |
| 22 | **Configurações Globais** | Definições do Sistema | Sequências numéricas de OS e preferências globais | `settings-domain.test.ts` | `settings.routes.test.ts` | `e2e/settings.spec.ts` | Numeração sequencial sem pulo de IDs |
