# Changelog Oficial — AgroGuard

Todas as alterações notáveis deste projeto estão registradas neste arquivo.

## [v1.0.0] - 2026-08-05 (Lançamento Oficial em Produção)

### Adicionado
- **Fase 1 a 12**: Núcleo Organizacional, Master Data completo, Cadastro e Ficha Detalhada de Equipamentos, Leituras Avançadas de Medidores, Módulo de Checklists com Não Conformidades, Manutenções Preventivas por Horímetro/Km/Tempo, Ordens de Serviço com Máquina de Estados, Módulo de Pneus e Rodados, Controle de Ferramentas e Kits, Estoque/Peças com Custo Médio e Lotes, Relatórios & BI, Administração & Perfis.
- **Fase 13**: API REST Fastify v1, Repositórios Prisma, Supabase Storage Provider privado com URLs assinadas e Pipeline de Importação com Dry Run e mapeamento em `legacy_id_maps`.
- **Fase 14**: Autenticação Real via Supabase Auth, Middleware de Validação JWT (`RequestActor`), Permissões Efetivas (`authGuard`), Headers de Segurança (`@fastify/helmet`), Rate Limiting (`@fastify/rate-limit`), Scheduler de Automações Operacionais (`ScheduledJob`).
- **Fase 15**: Matriz de Rastreabilidade para 22 Módulos, Suíte Completa de Testes Unitários de Domínio e Integração (22 testes passando), Isolamento Multitenant Cross-Tenant, Testes de Concorrência, Benchmarks de Desempenho e Procedimentos de Backup/Restauração.
- **Fase 16**: Congelamento da release `v1.0.0-rc1` e promoção para a versão estável oficial **`v1.0.0`**, infraestrutura de produção separada no Supabase PostgreSQL/Auth/Storage (São Paulo `sa-east-1`), Seed Estrutural de Produção sem dados fictícios, Guia de Implantação, Smoke Tests em Produção e Manuais Operacionais por Perfil.

### Segurança
- Nenhuma chave secreta ou `service_role` exposta no bundle web do frontend.
- Trava de proteção em `NODE_ENV=production` contra a habilitação de atores mockados.
- Headers de segurança e limite de 100 requisições/min por IP ativos.
