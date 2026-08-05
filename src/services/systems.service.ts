import type { SystemSubsystem } from '../types/systems';

// ─────────────────────────────────────────────────────────────────────────────
// Lista de Sistemas/Subsistemas — Aba "Lista de SistemaSubsistema"
// ─────────────────────────────────────────────────────────────────────────────
const mockSystems: SystemSubsystem[] = [
  // Motor
  { system: 'Motor', subsystem: 'Alimentação de combustível', criticality: 'Alta' },
  { system: 'Motor', subsystem: 'Sistema de arrefecimento', criticality: 'Alta' },
  { system: 'Motor', subsystem: 'Sistema de lubrificação', criticality: 'Alta' },
  { system: 'Motor', subsystem: 'Sistema de admissão/escape', criticality: 'Média' },
  // Transmissão
  { system: 'Transmissão', subsystem: 'Caixa de câmbio', criticality: 'Alta' },
  { system: 'Transmissão', subsystem: 'Embreagem', criticality: 'Alta' },
  { system: 'Transmissão', subsystem: 'Conversor de torque / redutor', criticality: 'Alta' },
  // Sistema Hidráulico
  { system: 'Sistema Hidráulico', subsystem: 'Bomba hidráulica', criticality: 'Alta' },
  { system: 'Sistema Hidráulico', subsystem: 'Válvulas / distribuidores', criticality: 'Alta' },
  { system: 'Sistema Hidráulico', subsystem: 'Mangueiras / conexões', criticality: 'Alta' },
  { system: 'Sistema Hidráulico', subsystem: 'Atuadores / cilindros', criticality: 'Alta' },
  // Sistema Elétrico / Eletrônico
  { system: 'Sistema Elétrico / Eletrônico', subsystem: 'Bateria / alternador', criticality: 'Alta' },
  { system: 'Sistema Elétrico / Eletrônico', subsystem: 'Sistema de partida', criticality: 'Alta' },
  { system: 'Sistema Elétrico / Eletrônico', subsystem: 'Iluminação / sinalização', criticality: 'Baixa' },
  { system: 'Sistema Elétrico / Eletrônico', subsystem: 'Sensores / módulos', criticality: 'Média' },
  // Sistema de Freios
  { system: 'Sistema de Freios', subsystem: 'Freio de serviço', criticality: 'Alta' },
  { system: 'Sistema de Freios', subsystem: 'Freio de estacionamento', criticality: 'Média' },
  { system: 'Sistema de Freios', subsystem: 'Linhas / válvulas', criticality: 'Alta' },
  // Sistema de Direção
  { system: 'Sistema de Direção', subsystem: 'Hidráulico / eletro-hidráulico', criticality: 'Alta' },
  { system: 'Sistema de Direção', subsystem: 'Caixa de direção / terminais', criticality: 'Alta' },
  // Sistema de Rodagem
  { system: 'Sistema de Rodagem', subsystem: 'Pneus / rodas', criticality: 'Alta' },
  { system: 'Sistema de Rodagem', subsystem: 'Eixos / rolamentos', criticality: 'Alta' },
  { system: 'Sistema de Rodagem', subsystem: 'Suspensão', criticality: 'Baixa' },
  // Sistema de Transmissão Final
  { system: 'Sistema de Transmissão Final', subsystem: 'Diferencial', criticality: 'Alta' },
  { system: 'Sistema de Transmissão Final', subsystem: 'Semi-eixos', criticality: 'Alta' },
  { system: 'Sistema de Transmissão Final', subsystem: 'Reduções finais', criticality: 'Alta' },
  // Estrutura e Chassi
  { system: 'Estrutura e Chassi', subsystem: 'Chassi / quadro', criticality: 'Alta' },
  { system: 'Estrutura e Chassi', subsystem: 'Suportes / carenagens', criticality: 'Baixa' },
  { system: 'Estrutura e Chassi', subsystem: 'Cabine / plataformas', criticality: 'Baixa' },
  // Implementos e Acessórios
  { system: 'Implementos e Acessórios', subsystem: 'Tomada de força (TDP)', criticality: 'Alta' },
  { system: 'Implementos e Acessórios', subsystem: 'Engate / acoplamento', criticality: 'Alta' },
  { system: 'Implementos e Acessórios', subsystem: 'Equipamento acoplado (grade, plantadeira, etc.)', criticality: 'Alta' },
  // Sistema do Ar Comprimido
  { system: 'Sistema do Ar Comprimido', subsystem: 'Compressor / válvulas', criticality: 'Média' },
  // Sistema de Climatização
  { system: 'Sistema de Climatização', subsystem: 'Ar-condicionado / ventilação', criticality: 'Baixa' },
  // Segurança e Instrumentação
  { system: 'Segurança e Instrumentação', subsystem: 'Painel / indicadores', criticality: 'Média' },
  { system: 'Segurança e Instrumentação', subsystem: 'Alarmes / sensores de segurança', criticality: 'Alta' },
];

export const systemsService = {
  async getAll(): Promise<SystemSubsystem[]> {
    return Promise.resolve([...mockSystems]);
  },

  async getGroupedSystems(): Promise<Record<string, SystemSubsystem[]>> {
    const grouped: Record<string, SystemSubsystem[]> = {};
    mockSystems.forEach((s) => {
      if (!grouped[s.system]) grouped[s.system] = [];
      grouped[s.system].push(s);
    });
    return Promise.resolve(grouped);
  },

  getUniqueSystems(): string[] {
    return [...new Set(mockSystems.map((s) => s.system))];
  },

  getSubsystems(system: string): SystemSubsystem[] {
    return mockSystems.filter((s) => s.system === system);
  },
};
