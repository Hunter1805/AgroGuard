# Roteiros de Homologação Funcional e Matriz de Defeitos — AgroGuard

Este documento registra os roteiros formais de homologação por perfil operacional, a auditoria de usabilidade e a classificação de defeitos para validação da **Fase 15D**.

---

## 1. Roteiros de Homologação por Perfil Operacional

### Roteiro 1 — Administrador do Sistema
- **Objetivo**: Gestão de acessos, criação de usuários e escopos organizacionais.
- **Passos**: Fazer login → Acessar Configurações → Criar Novo Usuário → Atribuir perfil `ADMIN` → Consultar Logs de Auditoria.
- **Resultado Esperado**: Usuário cadastrado e log registrado em `audit_logs`.
- **Status**: **APROVADO**

### Roteiro 2 — Gestor de Frotas
- **Objetivo**: Análise do Dashboard Geral e Aprovacão de Manutenções.
- **Passos**: Login → Consultar Dashboard → Filtrar Indicadores por Unidade → Analisar Alertas Ativos.
- **Resultado Esperado**: Indicadores consolidados sem erro de renderização.
- **Status**: **APROVADO**

### Roteiro 3 — Planejador de Manutenção
- **Objetivo**: Programação de Preventivas e Abertura de Ordens de Serviço.
- **Passos**: Login → Acessar Manutenções → Vincular Plano ao Trator Valtra A750 → Abrir OS Preventiva.
- **Resultado Esperado**: OS criada no status `aberta` com numeração sequencial.
- **Status**: **APROVADO**

### Roteiro 4 — Mecânico Diesel
- **Objetivo**: Apontamento em Ordem de Serviço e Consumo de Peças.
- **Passos**: Login → Acessar OS Atribuída → Alterar para `em_andamento` → Apontar filtro de óleo → Finalizar OS.
- **Resultado Esperado**: OS concluída e movimentação de peça registrada no estoque.
- **Status**: **APROVADO**

### Roteiro 5 — Operador Agrícola
- **Objetivo**: Registro rápido de leitura de horímetro e execução de Checklist.
- **Passos**: Login → Selecionar Trator → Inserir Leitura (1520h) → Preencher Checklist Pré-Operacional.
- **Resultado Esperado**: Leitura salva e checklist armazenado em tempo real.
- **Status**: **APROVADO**

### Roteiro 6 — Almoxarife
- **Objetivo**: Entrada de NF, Reserva e Baixa de Estoque.
- **Passos**: Login → Acessar Peças & Insumos → Registrar Entrada de Lote → Realizar Reserva.
- **Resultado Esperado**: Saldo atualizado e custo médio recalculado.
- **Status**: **APROVADO**

### Roteiro 7 — Responsável por Pneus
- **Objetivo**: Inspeção de Sulco e Rodízio de Pneus.
- **Passos**: Login → Acessar Pneus → Registrar Inspeção de Sulco (12mm) → Executar Rodízio de Posição.
- **Resultado Esperado**: Posição alterada e gráfico de desgaste atualizado.
- **Status**: **APROVADO**

### Roteiro 8 — Auditor de Compliance
- **Objetivo**: Exportação de Relatórios e Leitura Sem Permissão de Edição.
- **Passos**: Login com usuário Auditor → Consultar Relatório de Custos → Exportar CSV → Tentativa de abrir OS.
- **Resultado Esperado**: Exportação concluída; tentativa de abertura de OS bloqueada com mensagem de permissão negada.
- **Status**: **APROVADO**

---

## 2. Acessibilidade (WCAG 2.2 AA) & Usabilidade
- Navegação por teclado (`Tab`, `Shift+Tab`, `Enter`, `Esc`) totalmente suporteada em modais e tabelas.
- Modos Claro e Escuro validados com contraste mínimo de 4.5:1 para textos normais.
- Rótulos explicativos (`aria-label`) presentes em todos os botões que utilizam apenas ícones (`Lucide React`).

---

## 3. Matriz de Defeitos

| ID Defeito | Classificação | Descrição | Status | Solução / Contorno |
|---|---|---|---|---|
| DEF-001 | **P0 (Bloqueante)** | Nenhum defeito P0 encontrado | **FECHADO** | N/A |
| DEF-002 | **P1 (Crítico)** | Nenhum defeito P1 encontrado | **FECHADO** | N/A |
| DEF-003 | **P2 (Moderado)** | Aviso de chunk size do Vite no build | **ACEITO** | Ajustável via code-splitting na Fase 16 |
| DEF-004 | **P3 (Baixo)** | Dependência ausente em aviso de hook menor | **FECHADO** | Refatorado e ajustado |

**Conclusão**: **Zero defeitos P0 ou P1**. O AgroGuard atende integralmente a todos os critérios de qualidade funcional.
