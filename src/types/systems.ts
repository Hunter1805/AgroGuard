export type Criticality = 'Alta' | 'Média' | 'Baixa';

export interface SystemSubsystem {
  system: string;               // Ex: "Motor"
  subsystem: string;            // Ex: "Alimentação de combustível"
  criticality: Criticality;
}
