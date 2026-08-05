import type { MaintenancePlan, MaintenancePlanFilterState } from '../types/maintenance-plan';
import type { EquipmentMaintenancePlanLink } from '../types/maintenance-schedule';

// ─────────────────────────────────────────────────────────────────────────────
// Planos de Manutenção extraídos das abas: Tratores, Colhedoras, Implementos, Veículos
// ─────────────────────────────────────────────────────────────────────────────

const mockPlans: MaintenancePlan[] = [
  // ════════════════════════════════════════════════════════════════════════════
  // TRATOR LS U80 (ID 22) — Aba Tratores
  // ════════════════════════════════════════════════════════════════════════════
  {
    equipmentId: 'EQ-022',
    equipmentName: 'Trator LS U80 22 4x4',
    intervalBlocks: [
      {
        interval: { label: 'A Cada 10 Horas (Diária)', type: 'hours', value: 10, unit: 'h' },
        tasks: [
          { description: 'Verificar o nível do óleo do motor.', estimatedMinutes: 5, supplies: [{ description: 'SAE 15W-40 API CI-4', quantity: '-', unit: 'Litros' }] },
          { description: 'Verificar o nível do líquido de arrefecimento.', estimatedMinutes: 5, supplies: [{ description: 'Líquido de Arrefecimento', quantity: '-', unit: '-' }] },
          { description: 'Verificar o nível do óleo da transmissão / sistema hidráulico.', estimatedMinutes: 5, supplies: [{ description: 'Óleo Multifuncional (UTTO)', quantity: '-', unit: '-' }] },
          { description: 'Drenar o separador de água do filtro de combustível.', estimatedMinutes: 2, supplies: [] },
          { description: 'Verificar a pressão e o estado dos pneus.', estimatedMinutes: 10, supplies: [{ description: 'Ar comprimido', quantity: '(Ver pneu)', unit: 'psi' }] },
        ],
      },
      {
        interval: { label: 'A Cada 100 Horas', type: 'hours', value: 100, unit: 'h' },
        tasks: [
          { description: 'Lubrificar todos os pontos de graxa do trator.', estimatedMinutes: 20, supplies: [{ description: 'Graxa de Lítio EP2', quantity: 'Conforme necessidade', unit: '-' }] },
        ],
      },
      {
        interval: { label: 'A Cada 200 Horas', type: 'hours', value: 200, unit: 'h' },
        tasks: [
          { description: 'Trocar o óleo do motor e o filtro de óleo.', estimatedMinutes: 45, supplies: [{ description: 'SAE 15W-40 API CI-4', quantity: '~8,5', unit: 'Litros' }] },
          { description: 'Limpar o filtro de ar.', estimatedMinutes: 10, supplies: [] },
        ],
      },
      {
        interval: { label: 'A Cada 400 Horas', type: 'hours', value: 400, unit: 'h' },
        tasks: [
          { description: 'Trocar o óleo da transmissão / hidráulico e o filtro.', estimatedMinutes: 90, supplies: [{ description: 'Óleo Multifuncional (UTTO)', quantity: '~56,0', unit: 'Litros' }] },
          { description: 'Substituir o(s) filtro(s) de combustível.', estimatedMinutes: 30, supplies: [{ description: 'Filtros de combustível', quantity: '(Verificar qtd.)', unit: 'Peças' }] },
        ],
      },
      {
        interval: { label: 'A Cada 1200 Horas (Anual)', type: 'hours', value: 1200, unit: 'h' },
        tasks: [
          { description: 'Trocar o óleo do eixo dianteiro (diferencial e cubos).', estimatedMinutes: 60, supplies: [{ description: 'SAE 80W-90 GL-5', quantity: '~7,9', unit: 'Litros' }] },
          { description: 'Substituir o líquido de arrefecimento.', estimatedMinutes: 60, supplies: [{ description: 'Líquido de Arrefecimento (com aditivo)', quantity: '~11,0', unit: 'Litros' }] },
          { description: 'Regular a folga das válvulas do motor.', estimatedMinutes: 90, supplies: [] },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // TRATOR MASSEY 265 (IDs 1 e 2) — Aba Tratores
  // ════════════════════════════════════════════════════════════════════════════
  {
    equipmentId: 'EQ-001',
    equipmentName: 'Trator Massey 265 01 4x2',
    intervalBlocks: [
      {
        interval: { label: 'A cada 10h ou Diariamente', type: 'hours', value: 10, unit: 'h' },
        tasks: [
          { description: 'Verificar nível do óleo do motor.', estimatedMinutes: 3, supplies: [{ description: 'SAE 15W-40 API CF', quantity: '7,8', unit: 'Litros' }] },
          { description: 'Limpar filtro de ar.', estimatedMinutes: 3, supplies: [] },
          { description: 'Drenar água e impurezas do filtro de combustível.', estimatedMinutes: 2, supplies: [] },
          { description: 'Abastecer o tanque de combustível.', estimatedMinutes: 5, supplies: [] },
          { description: 'Verificar nível de água do radiador.', estimatedMinutes: 3, supplies: [] },
          { description: 'Engraxar articulações dianteiras.', estimatedMinutes: 5, supplies: [{ description: 'Graxa de lítio NLGI 2', quantity: '0,15', unit: 'KG' }] },
          { description: 'Verificar funcionamento de luzes e painel.', estimatedMinutes: 2, supplies: [] },
          { description: 'Engraxar todos os bicos graxeiros.', estimatedMinutes: 5, supplies: [{ description: 'Graxa de lítio NLGI 2', quantity: '0,15', unit: 'KG' }] },
        ],
      },
      {
        interval: { label: 'A cada 50h', type: 'hours', value: 50, unit: 'h' },
        tasks: [
          { description: 'Calibrar pneus.', estimatedMinutes: 3, supplies: [] },
          { description: 'Verificar nível do óleo da transmissão.', estimatedMinutes: 5, supplies: [{ description: 'Permatran 821XL ou SAE 10W-30 UTTO', quantity: '30,3', unit: 'Litros' }] },
        ],
      },
      {
        interval: { label: 'A cada 250h', type: 'hours', value: 250, unit: 'h' },
        tasks: [
          { description: 'Trocar óleo do motor.', estimatedMinutes: 30, supplies: [{ description: 'SAE 15W-40 API CF', quantity: '7,8', unit: 'Litros' }] },
          { description: 'Trocar filtro de óleo do motor.', estimatedMinutes: 10, supplies: [{ description: '-', quantity: '1', unit: 'Peça' }] },
          { description: 'Trocar filtro de combustível.', estimatedMinutes: 10, supplies: [{ description: 'Filtro de Combustível', quantity: '1', unit: 'Peça' }] },
        ],
      },
      {
        interval: { label: 'A cada 500h', type: 'hours', value: 500, unit: 'h' },
        tasks: [
          { description: 'Trocar óleo do eixo dianteiro.', estimatedMinutes: 30, supplies: [{ description: 'SAE 90 EP', quantity: '1,8', unit: 'Litros' }] },
        ],
      },
      {
        interval: { label: 'A cada 750h', type: 'hours', value: 750, unit: 'h' },
        tasks: [
          { description: 'Trocar óleo da transmissão/hidráulico.', estimatedMinutes: 30, supplies: [{ description: 'Permatran 821XL ou SAE 10W-30 UTTO', quantity: '30,3', unit: 'Litros' }] },
        ],
      },
      {
        interval: { label: 'Anual', type: 'calendar', value: 12, unit: 'meses' },
        tasks: [
          { description: 'Trocar líquido de arrefecimento.', estimatedMinutes: 30, supplies: [{ description: 'Etileno Glicol + Água (1:2)', quantity: '10,2', unit: 'Litros' }] },
        ],
      },
    ],
  },
  {
    equipmentId: 'EQ-002',
    equipmentName: 'Trator Massey 265 02 4x2',
    intervalBlocks: [], // Mesmo plano que EQ-001 — referência ao EQ-001
  },

  // ════════════════════════════════════════════════════════════════════════════
  // COLHEDORA JACTO K3 — Aba Colhedoras
  // ════════════════════════════════════════════════════════════════════════════
  {
    equipmentId: 'EQ-C01',
    equipmentName: 'Colhedora Jacto K3 4x2',
    intervalBlocks: [
      {
        interval: { label: 'A Cada 10 Horas (Diária)', type: 'hours', value: 10, unit: 'h' },
        tasks: [
          { description: 'Verifique o nível de óleo lubrificante do motor diesel.', estimatedMinutes: 5, supplies: [{ description: 'API-CC, MIL-L-2104 B ou MIL-L-46 152 SAE-3', quantity: '-', unit: '-' }] },
          { description: 'Verifique o nível da solução do radiador.', estimatedMinutes: 5, supplies: [{ description: 'Aditivo para Arrefecimento', quantity: '-', unit: '-' }] },
          { description: 'Verifique o funcionamento dos mexedores de folhas.', estimatedMinutes: 2, supplies: [] },
          { description: 'Drene as impurezas do sedimentador e do(s) filtro(s) de combustível.', estimatedMinutes: 3, supplies: [] },
          { description: 'Verifique e limpe se necessária a tela de proteção do radiador.', estimatedMinutes: 5, supplies: [{ description: 'Ar comprimido', quantity: '-', unit: '-' }] },
          { description: 'Verifique os terminais e a luz indicadora do nível de carga da bateria.', estimatedMinutes: 2, supplies: [] },
          { description: 'Verifique o nível do óleo hidráulico.', estimatedMinutes: 5, supplies: [{ description: 'Óleo Hidráulico ISO VG 68', quantity: '-', unit: '-' }] },
          { description: 'Verifique o indicador no filtro de sucção do circuito de translação.', estimatedMinutes: 2, supplies: [] },
          { description: 'Verifique o indicador do filtro de retorno do circuito funcional.', estimatedMinutes: 2, supplies: [] },
          { description: 'Efetue a limpeza dos transportadores (horizontais, verticais, transversal e graneleiro).', estimatedMinutes: 10, supplies: [] },
          { description: 'Efetue a limpeza do ventilador.', estimatedMinutes: 5, supplies: [] },
        ],
      },
      {
        interval: { label: 'A Cada 50 Horas (Semanal)', type: 'hours', value: 50, unit: 'h' },
        tasks: [
          { description: 'Lubrifique as cruzetas do cardã.', estimatedMinutes: 10, supplies: [{ description: 'Graxa a base de lítio NLGI-2', quantity: '~30', unit: 'Gramas' }] },
          { description: 'Lubrifique os pinos de articulação dos cilindros das pernas.', estimatedMinutes: 10, supplies: [{ description: 'Graxa a base de lítio NLGI-2', quantity: '~40', unit: 'Gramas' }] },
          { description: 'Lubrifique os mancais dos transportadores.', estimatedMinutes: 10, supplies: [{ description: 'Graxa a base de lítio NLGI-2', quantity: '~50', unit: 'Gramas' }] },
          { description: 'Lubrifique o conjunto vibrador.', estimatedMinutes: 10, supplies: [{ description: 'Graxa a base de lítio EP NLGI-3', quantity: '~50', unit: 'Gramas' }] },
          { description: 'Reaperte os parafusos e porcas das rodas.', estimatedMinutes: 15, supplies: [] },
          { description: 'Verifique a pressão dos pneus e ajuste se necessário.', estimatedMinutes: 5, supplies: [{ description: 'Ar comprimido', quantity: '(Ver pneu)', unit: 'psi' }] },
          { description: 'Verifique o nível do óleo da caixa de acionamento duplo de bombas.', estimatedMinutes: 5, supplies: [{ description: 'SAE 140', quantity: '-', unit: '-' }] },
          { description: 'Verifique as condições de limpeza e fixação dos sensores eletrônicos.', estimatedMinutes: 15, supplies: [] },
          { description: 'Verifique a regulagem dos freios do oscilador e ajuste se necessário.', estimatedMinutes: 30, supplies: [] },
          { description: 'Verifique o esticamento das correntes dos transportadores horizontais, verticais, transversal e graneleiro. Ajuste se necessário.', estimatedMinutes: 45, supplies: [] },
        ],
      },
      {
        interval: { label: 'A Cada 150 Horas', type: 'hours', value: 150, unit: 'h' },
        tasks: [
          { description: 'Retire as lâminas e lubrifique o eixo e a bucha da lâmina.', estimatedMinutes: 60, supplies: [{ description: 'Graxa de lítio NLGI-2', quantity: '~50', unit: 'Gramas' }] },
        ],
      },
      {
        interval: { label: 'A Cada 200 Horas', type: 'hours', value: 200, unit: 'h' },
        tasks: [
          { description: 'Substitua o lubrificante e o filtro de óleo do motor.', estimatedMinutes: 60, supplies: [{ description: 'API-CC, MIL-L-2104 B ou MIL-L-46 152 SAE-3', quantity: '8', unit: 'Litros' }] },
          { description: 'Verifique o estado geral das correias do conjunto vibrador.', estimatedMinutes: 30, supplies: [] },
          { description: 'Efetue o alinhamento da direção.', estimatedMinutes: 30, supplies: [] },
          { description: 'Efetue a regulagem da direção.', estimatedMinutes: 30, supplies: [] },
        ],
      },
      {
        interval: { label: 'A Cada 250 Horas', type: 'hours', value: 250, unit: 'h' },
        tasks: [
          { description: 'Substitua o elemento do filtro sedimentador (diesel).', estimatedMinutes: 15, supplies: [{ description: 'Filtro Sedimentador', quantity: '1', unit: 'Peça' }] },
        ],
      },
      {
        interval: { label: 'A Cada 500 Horas', type: 'hours', value: 500, unit: 'h' },
        tasks: [
          { description: 'Substitua os filtros de ar e enchimento.', estimatedMinutes: 30, supplies: [{ description: 'Filtros de Ar (Kit)', quantity: '1', unit: 'Peça' }] },
          { description: 'Substitua os filtros de sucção do circuito de direção.', estimatedMinutes: 20, supplies: [{ description: 'Filtro Hidráulico', quantity: '1', unit: 'Peça' }] },
          { description: 'Substitua o filtro de sucção do circuito funcional.', estimatedMinutes: 20, supplies: [{ description: 'Filtro Hidráulico', quantity: '1', unit: 'Peça' }] },
          { description: 'Substitua o filtro de retorno do circuito funcional.', estimatedMinutes: 20, supplies: [{ description: 'Filtro Hidráulico vazão máx. de 240 L/min', quantity: '1', unit: 'Peça' }] },
          { description: 'Lubrifique o cubo das rodas (K-3 4x2).', estimatedMinutes: 45, supplies: [{ description: 'Graxa de lítio NLGI-2', quantity: '~100', unit: 'Gramas' }] },
        ],
      },
      {
        interval: { label: 'A Cada 1000 Horas', type: 'hours', value: 1000, unit: 'h' },
        tasks: [
          { description: 'Remova o reservatório de combustível e lave-o interno e externamente.', estimatedMinutes: 180, supplies: [] },
        ],
      },
      {
        interval: { label: 'A Cada 1500 Horas', type: 'hours', value: 1500, unit: 'h' },
        tasks: [
          { description: 'Substitua o óleo hidráulico do sistema hidráulico.', estimatedMinutes: 120, supplies: [{ description: 'Óleo Hidráulico ISO VG 68', quantity: '200', unit: 'Litros' }] },
        ],
      },
      {
        interval: { label: 'Anualmente', type: 'calendar', value: 12, unit: 'meses' },
        tasks: [
          { description: 'Substitua o óleo lubrificante da caixa de acionamento duplo de bombas.', estimatedMinutes: 30, supplies: [{ description: 'SAE 140', quantity: '1,5', unit: 'Litros' }] },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // VARREDOR HIDRÁULICO VACCA/VICON (VH 360) — Aba Implementos
  // ════════════════════════════════════════════════════════════════════════════
  {
    equipmentId: 'EQ-I01',
    equipmentName: 'Varredor Hidráulico VACCA Vincon 3.60',
    intervalBlocks: [
      {
        interval: { label: 'A Cada 10 Horas (Diária)', type: 'hours', value: 10, unit: 'h' },
        tasks: [
          { description: 'Limpar o radiador do óleo hidráulico. (Item mais crítico)', estimatedMinutes: 10, supplies: [{ description: 'Ar comprimido', quantity: '-', unit: '-' }] },
          { description: 'Lubrificar TODOS os pontos de graxa: Mancais da escova principal, mancais das rodas de apoio, 3º ponto.', estimatedMinutes: 20, supplies: [{ description: 'Graxa EP2 (aplicação via bombas)', quantity: '~80', unit: 'Gramas' }] },
          { description: 'Lubrificar TODAS as correntes de transmissão.', estimatedMinutes: 10, supplies: [{ description: 'Grafite em pó ou lubrificante seco', quantity: 'Conforme necessidade', unit: '-' }] },
          { description: 'Verificar o nível do óleo da caixa de transmissão (TDP).', estimatedMinutes: 5, supplies: [{ description: 'SAE 140 API GL-5', quantity: '-', unit: '-' }] },
          { description: 'Verificar o nível do óleo hidráulico (reservatório próprio).', estimatedMinutes: 5, supplies: [{ description: 'Óleo Hidráulico ISO VG 68', quantity: '-', unit: '-' }] },
          { description: 'Inspecionar o eixo cardan e suas proteções de segurança.', estimatedMinutes: 5, supplies: [] },
          { description: 'Inspecionar as cerdas da escova por desgaste ou danos.', estimatedMinutes: 5, supplies: [] },
          { description: 'Verificar a pressão e o estado dos pneus de apoio.', estimatedMinutes: 5, supplies: [{ description: 'Ar comprimido', quantity: '(Ver pneu)', unit: 'psi' }] },
        ],
      },
      {
        interval: { label: 'A Cada 50 Horas (Semanal)', type: 'hours', value: 50, unit: 'h' },
        tasks: [
          { description: 'Verificar e ajustar a tensão das correntes e correias.', estimatedMinutes: 15, supplies: [] },
          { description: 'Reapertar os parafusos (mancais, rodas, chassi) devido à alta vibração.', estimatedMinutes: 20, supplies: [] },
          { description: 'Lubrificar as cruzetas do eixo cardan.', estimatedMinutes: 5, supplies: [{ description: 'Graxa EP2', quantity: '~20', unit: 'Gramas' }] },
        ],
      },
      {
        interval: { label: 'Anual / Fim de Safra', type: 'calendar', value: 12, unit: 'meses' },
        tasks: [
          { description: 'Trocar o óleo da caixa de transmissão (TDP).', estimatedMinutes: 30, supplies: [{ description: 'SAE 140 API GL-5', quantity: '~2,0', unit: 'Litros' }] },
          { description: 'Trocar o óleo e o(s) filtro(s) do sistema hidráulico.', estimatedMinutes: 60, supplies: [{ description: 'Óleo ISO VG 68 / Filtro(s)', quantity: '(Ver manual)', unit: '-' }] },
          { description: 'Revisão completa dos mancais e rolamentos (escova, rodas).', estimatedMinutes: 120, supplies: [{ description: 'Rolamentos (se necessário)', quantity: '-', unit: '-' }] },
          { description: 'Avaliar e, se necessário, substituir o jogo de cerdas da escova.', estimatedMinutes: 120, supplies: [{ description: 'Cerdas de reposição', quantity: '1 (kit)', unit: '-' }] },
          { description: 'Inspecionar a estrutura (chassi, engate) em busca de trincas.', estimatedMinutes: 30, supplies: [] },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // MOTO HONDA NXR 150 BROS (Terreirão) — Aba Veículos
  // ════════════════════════════════════════════════════════════════════════════
  {
    equipmentId: 'EQ-M01',
    equipmentName: 'Moto Terreirão Honda NXR 150 Bros',
    intervalBlocks: [
      {
        interval: { label: 'A Cada Semana (ou 250 km)', type: 'km', value: 250, unit: 'km' },
        tasks: [
          { description: 'Verificar nível de óleo do motor. (Item mais crítico).', estimatedMinutes: 5, supplies: [{ description: 'Óleo 10W-30 (Mineral ou Semi)', quantity: '-', unit: '-' }] },
          { description: 'Lubrificar e ajustar a folga da corrente.', estimatedMinutes: 10, supplies: [{ description: 'Óleo de Corrente (Spray) ou SAE 90', quantity: '(conforme nec.)', unit: '-' }] },
          { description: 'Verificar a calibragem dos pneus.', estimatedMinutes: 5, supplies: [{ description: 'Ar comprimido', quantity: '-', unit: 'psi' }] },
          { description: 'Verificar e ajustar a folga dos freios (dianteiro e traseiro).', estimatedMinutes: 5, supplies: [] },
        ],
      },
      {
        interval: { label: 'A Cada 1.500 km (ou 3 Meses)', type: 'km', value: 1500, unit: 'km' },
        tasks: [
          { description: 'Trocar o óleo do motor.', estimatedMinutes: 15, supplies: [{ description: 'Óleo 10W-30 (Mineral ou Semi)', quantity: '~1,0', unit: 'Litro' }] },
          { description: 'Limpar o filtro de ar (Lavar elemento de espuma ou bater ar, dependendo do modelo).', estimatedMinutes: 20, supplies: [{ description: 'Solvente / Ar comprimido', quantity: '-', unit: '-' }] },
          { description: 'Limpar e verificar a vela de ignição.', estimatedMinutes: 10, supplies: [] },
          { description: 'Verificar e ajustar a folga da embreagem.', estimatedMinutes: 5, supplies: [] },
          { description: 'Reapertar parafusos principais (motor, guidão, rodas).', estimatedMinutes: 10, supplies: [] },
        ],
      },
      {
        interval: { label: 'A Cada 4.500 km (ou 6 Meses)', type: 'km', value: 4500, unit: 'km' },
        tasks: [
          { description: 'Executar as tarefas de 1.500 km.', estimatedMinutes: 0, supplies: [] },
          { description: 'Substituir o filtro de ar. (Não apenas limpar).', estimatedMinutes: 10, supplies: [{ description: 'Filtro de Ar (Novo)', quantity: '1', unit: 'Peça' }] },
          { description: 'Substituir a vela de ignição.', estimatedMinutes: 10, supplies: [{ description: 'Vela (NGK)', quantity: '1', unit: 'Peça' }] },
        ],
      },
      {
        interval: { label: 'A Cada 9.000 km (ou 12 Meses)', type: 'km', value: 9000, unit: 'km' },
        tasks: [
          { description: 'Executar as tarefas de 4.500 km.', estimatedMinutes: 0, supplies: [] },
          { description: 'Substituir o kit de relação (Corrente, Coroa e Pinhão).', estimatedMinutes: 60, supplies: [{ description: 'Kit Relação', quantity: '1', unit: 'Kit' }] },
          { description: 'Inspecionar e trocar lonas e pastilhas de freio (se necessário).', estimatedMinutes: 30, supplies: [{ description: 'Lonas / Pastilhas', quantity: '1 (kit)', unit: '-' }] },
          { description: 'Trocar o fluido de freio (se aplicável, freio a disco).', estimatedMinutes: 20, supplies: [{ description: 'Fluido de Freio DOT-4', quantity: '~0,2', unit: 'Litros' }] },
          { description: 'Lubrificar caixa de direção e balança traseira (Graxa EP2).', estimatedMinutes: 60, supplies: [{ description: 'Graxa EP2 (Litho)', quantity: '(conforme nec.)', unit: 'Gramas' }] },
        ],
      },
    ],
  },
];

// ─── Planos Mestre da Fase 5 (Versionamento e Regra Combinada) ───────────────
let mockPlansV5: MaintenancePlan[] = [
  {
    id: 'PLN-V5-01',
    code: 'PLN-LS-80',
    name: 'Plano Preventivo Trator LS U80 (2026)',
    description: 'Plano completo de 10h a 1.200h para Tratores da linha LS U80 com regra combinada anual.',
    applicableEquipmentTypeIds: ['Trator'],
    applicableBrandIds: ['LS Tractor'],
    applicableModelIds: ['U80 4x4'],
    specificEquipmentIds: ['EQ-022'],
    version: 3,
    active: true,
    archived: false,
    createdBy: 'Eng. Mecânico (Carlos Roberto)',
    createdAt: '2026-04-10T08:00:00Z',
    updatedAt: '2026-07-01T10:00:00Z',
    intervals: [
      {
        id: 'INT-200H',
        name: 'A Cada 200 Horas (Troca de Óleo e Filtros)',
        triggerType: 'horas',
        rule: 'leitura',
        meterType: 'horimetro',
        readingInterval: 200,
        alertReadingBefore: 25,
        allowedReadingDelay: 10,
        priority: 'alta',
        estimatedDurationMinutes: 90,
        requiresEquipmentStop: true,
        requiresApproval: false,
        tasks: [
          {
            id: 'tsk-1',
            order: 1,
            title: 'Troca de Óleo do Motor',
            criticality: 'alta',
            required: true,
            requirePhotoBefore: false,
            requirePhotoAfter: false,
            requireMeasurement: false,
            parts: [{ id: 'p1', name: 'Filtro de Óleo LS', quantity: 1, unit: 'Peça', required: true }],
            supplies: [{ id: 's1', name: 'Óleo SAE 15W-40 CI-4', quantity: 8.5, unit: 'Litros', required: true }],
            tools: [{ id: 't1', name: 'Chave de Filtro e Recipiente', required: true }],
          },
        ],
      },
      {
        id: 'INT-1200H',
        name: 'A Cada 1.200 Horas ou 12 Meses (O Que Ocorrer Primeiro)',
        triggerType: 'combinado',
        rule: 'o_que_ocorrer_primeiro',
        meterType: 'horimetro',
        readingInterval: 1200,
        timeInterval: 12,
        timeUnit: 'meses',
        alertReadingBefore: 50,
        alertDaysBefore: 15,
        allowedReadingDelay: 20,
        allowedDaysDelay: 7,
        priority: 'critica',
        estimatedDurationMinutes: 300,
        requiresEquipmentStop: true,
        requiresApproval: true,
        tasks: [
          {
            id: 'tsk-2',
            order: 1,
            title: 'Substituição Completa dos Fluidos e Regulagem de Válvulas',
            criticality: 'critica',
            required: true,
            requirePhotoBefore: false,
            requirePhotoAfter: true,
            requireMeasurement: false,
            parts: [
              { id: 'p2', name: 'Kit de Filtros de Combustível e Transmissão', quantity: 1, unit: 'Kit', required: true },
            ],
            supplies: [
              { id: 's2', name: 'Óleo UTTO Transmissão', quantity: 56.0, unit: 'Litros', required: true },
              { id: 's3', name: 'Líquido de Arrefecimento Aditivado', quantity: 11.0, unit: 'Litros', required: true },
            ],
            tools: [{ id: 't2', name: 'Calibrador de Folga de Válvulas', required: true }],
          },
        ],
      },
    ],
  },
  {
    id: 'PLN-V5-02',
    code: 'PLN-MAS-265',
    name: 'Plano Preventivo Massey 265 (Safra 26)',
    description: 'Manutenção periódica para linha Massey Ferguson.',
    applicableEquipmentTypeIds: ['Trator'],
    applicableBrandIds: ['Massey Ferguson'],
    applicableModelIds: ['265 4x2'],
    specificEquipmentIds: ['EQ-001'],
    version: 1,
    active: true,
    archived: false,
    createdBy: 'Supervisor Operacional (Roberto Campos)',
    createdAt: '2026-05-15T09:00:00Z',
    updatedAt: '2026-05-15T09:00:00Z',
    intervals: [
      {
        id: 'INT-50H',
        name: 'A Cada 50 Horas (Lubrificação e Nível)',
        triggerType: 'horas',
        rule: 'leitura',
        meterType: 'horimetro',
        readingInterval: 50,
        alertReadingBefore: 10,
        allowedReadingDelay: 5,
        priority: 'media',
        estimatedDurationMinutes: 45,
        requiresEquipmentStop: false,
        requiresApproval: false,
        tasks: [
          {
            id: 'tsk-3',
            order: 1,
            title: 'Lubrificação Geral de Articulações e Bicos Graxeiros',
            criticality: 'media',
            required: true,
            requirePhotoBefore: false,
            requirePhotoAfter: false,
            requireMeasurement: false,
            parts: [],
            supplies: [{ id: 's4', name: 'Graxa de Lítio NLGI 2', quantity: 0.5, unit: 'Kg', required: true }],
            tools: [{ id: 't3', name: 'Bomba Pneumática', required: true }],
          },
        ],
      },
    ],
  },
];

// ─── Vínculos de Equipamentos aos Planos ─────────────────────────────────────
let mockLinks: EquipmentMaintenancePlanLink[] = [
  {
    id: 'LNK-01',
    equipmentId: 'EQ-022',
    equipmentCode: 'TR-022',
    equipmentName: 'Trator LS U80 22 4x4',
    planId: 'PLN-V5-01',
    planName: 'Plano Preventivo Trator LS U80 (2026)',
    planVersion: 3,
    startDate: '2026-05-01',
    baseReading: 5800,
    baseDate: '2026-05-01',
    lastKnownMaintenanceReading: 6000,
    lastKnownMaintenanceDate: '2026-07-15',
    active: true,
    workshopName: 'Oficina Central Sede',
    maintenanceResponsibleName: 'Eng. Mecânico (Carlos Roberto)',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-07-15T16:30:00Z',
  },
  {
    id: 'LNK-02',
    equipmentId: 'EQ-001',
    equipmentCode: 'MAS-01',
    equipmentName: 'Trator Massey 265 01 4x2',
    planId: 'PLN-V5-02',
    planName: 'Plano Preventivo Massey 265 (Safra 26)',
    planVersion: 1,
    startDate: '2026-05-15',
    baseReading: 3200,
    baseDate: '2026-05-15',
    lastKnownMaintenanceReading: 3240,
    lastKnownMaintenanceDate: '2026-06-20',
    active: true,
    workshopName: 'Oficina Central Sede',
    maintenanceResponsibleName: 'Técnico de Oficina (Marcos Lima)',
    createdAt: '2026-05-15T00:00:00Z',
    updatedAt: '2026-06-20T00:00:00Z',
  },
];

export const maintenancePlanService = {
  // ── Métodos Legados de Compatibilidade ──
  async getAll(): Promise<MaintenancePlan[]> {
    return Promise.resolve([...mockPlans]);
  },

  async getByEquipmentId(equipmentId: string): Promise<MaintenancePlan | undefined> {
    return Promise.resolve(mockPlans.find((p) => p.equipmentId === equipmentId));
  },

  async getEquipmentsWithPlans(): Promise<string[]> {
    return Promise.resolve(mockPlans.map((p) => p.equipmentId || ''));
  },

  // ── Métodos Mestre da Fase 5 (Planos Preventivos e Versionamento) ──
  async getMaintenancePlans(filters?: Partial<MaintenancePlanFilterState>): Promise<MaintenancePlan[]> {
    let result = [...mockPlansV5];
    if (!filters) return Promise.resolve(result);

    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.code && p.code.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }
    if (filters.equipmentType && filters.equipmentType !== 'todos') {
      result = result.filter((p) => p.applicableEquipmentTypeIds?.includes(filters.equipmentType!));
    }
    if (filters.status === 'ativo') result = result.filter((p) => p.active && !p.archived);
    if (filters.status === 'inativo') result = result.filter((p) => !p.active && !p.archived);
    if (filters.status === 'arquivado') result = result.filter((p) => p.archived);

    return Promise.resolve(result);
  },

  async getMaintenancePlanById(id: string): Promise<MaintenancePlan | undefined> {
    const found = mockPlansV5.find((p) => p.id === id || p.code === id);
    return Promise.resolve(found ? JSON.parse(JSON.stringify(found)) : undefined);
  },

  async createMaintenancePlan(data: Omit<MaintenancePlan, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<MaintenancePlan> {
    const id = `PLN-V5-0${mockPlansV5.length + 1}`;
    const newPlan: MaintenancePlan = {
      ...data,
      id,
      version: 1,
      active: true,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPlansV5.unshift(newPlan);
    return Promise.resolve(newPlan);
  },

  async updateMaintenancePlan(id: string, updates: Partial<MaintenancePlan>): Promise<MaintenancePlan> {
    const idx = mockPlansV5.findIndex((p) => p.id === id || p.code === id);
    if (idx === -1) throw new Error('Plano de manutenção não encontrado no banco do AgroGuard.');

    // Verificar se já possui histórico no sistema. Se possui, sugerir versionamento!
    mockPlansV5[idx] = { ...mockPlansV5[idx], ...updates, updatedAt: new Date().toISOString() };
    return Promise.resolve(mockPlansV5[idx]);
  },

  async duplicateMaintenancePlan(id: string): Promise<MaintenancePlan> {
    const existing = await this.getMaintenancePlanById(id);
    if (!existing) throw new Error('Plano original não encontrado para duplicação.');
    const copyId = `PLN-V5-0${mockPlansV5.length + 1}`;
    const duplicate: MaintenancePlan = {
      ...existing,
      id: copyId,
      code: `${existing.code}-CÓPIA`,
      name: `${existing.name} (Cópia)`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPlansV5.unshift(duplicate);
    return Promise.resolve(duplicate);
  },

  async createMaintenancePlanVersion(id: string): Promise<MaintenancePlan> {
    const existingIdx = mockPlansV5.findIndex((p) => p.id === id || p.code === id);
    if (existingIdx === -1) throw new Error('Plano não localizado.');

    const current = mockPlansV5[existingIdx];
    // Congelar a versão anterior no histórico imutável (simulado por clonagem incrementada)
    const newVersionNum = (current.version || 1) + 1;
    const upgraded: MaintenancePlan = {
      ...JSON.parse(JSON.stringify(current)),
      version: newVersionNum,
      updatedAt: new Date().toISOString(),
    };
    mockPlansV5[existingIdx] = upgraded;

    // Atualizar também vínculos ativos para esta nova versão
    mockLinks.forEach((lnk) => {
      if (lnk.planId === current.id) lnk.planVersion = newVersionNum;
    });

    return Promise.resolve(upgraded);
  },

  // ── Gestão dos Vínculos Operacionais (Equipamentos) ──
  async getEquipmentPlanLinks(equipmentId?: string): Promise<EquipmentMaintenancePlanLink[]> {
    if (!equipmentId) return Promise.resolve([...mockLinks]);
    return Promise.resolve(mockLinks.filter((l) => l.equipmentId === equipmentId && l.active));
  },

  async linkPlanToEquipment(data: Omit<EquipmentMaintenancePlanLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<EquipmentMaintenancePlanLink> {
    const id = `LNK-0${mockLinks.length + 1}`;
    const link: EquipmentMaintenancePlanLink = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Desativar vínculos antigos do mesmo plano/equipamento se existirem
    mockLinks.forEach((l) => {
      if (l.equipmentId === data.equipmentId && l.planId === data.planId) l.active = false;
    });
    mockLinks.unshift(link);
    return Promise.resolve(link);
  },

  async unlinkPlanFromEquipment(linkId: string): Promise<boolean> {
    const idx = mockLinks.findIndex((l) => l.id === linkId);
    if (idx !== -1) {
      mockLinks[idx].active = false;
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  },
};

