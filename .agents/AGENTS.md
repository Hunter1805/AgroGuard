# Regras de Arquitetura do Projeto AgroGuard

Antes de iniciar qualquer implementação, siga estas regras obrigatórias:

- **Não criar componentes gigantes**: Dividir estruturas complexas em sub-componentes focados.
- **Responsabilidade única**: Cada componente deve ter um propósito bem definido.
- **Utilizar composição**: Preferir composição ao invés de arquivos muito extensos.
- **Limite de linhas**: Cada componente deve possuir menos de 250 linhas sempre que possível.
- **Separação de camadas**: Separar rigorosamente Layout, UI, Business Logic (Services) e Estado (Hooks).
- **Sem chamadas diretas ao banco nos componentes**: Nunca misturar chamadas ao Supabase dentro dos componentes visuais.
- **Camada Services**: Criar e utilizar a camada `services/` responsável pelo acesso e manipulação dos dados.
- **Camada Types**: Manter modelos em `types/` específicos por domínio.
- **Hooks Reutilizáveis**: Utilizar a camada `hooks/` para gerenciamento de estado e integração de regras de negócio.
- **Design System Coeso**: Toda interface deve utilizar o mesmo Design System (Tailwind + Lucide React).
- **Componentes Reutilizáveis**: Componentes de UI genéricos devem residir em `components/ui/`.
- **Escalabilidade e Manutenção**: Priorizar legibilidade e facilitar futura conexão com Supabase.
- **Dados Mockados**: Utilizar dados mockados nos serviços nesta primeira etapa sem conexão direta ao Supabase.
- **Ícones Padronizados**: Utilizar **exclusivamente** `lucide-react`. Não misturar com Material Symbols.
