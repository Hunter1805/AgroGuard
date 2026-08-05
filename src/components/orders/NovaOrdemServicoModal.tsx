import React, { useState, useEffect } from 'react';
import { ClipboardList, X } from 'lucide-react';
import type { ServiceOrder, EquipmentKind, FailureLocation, MaintenanceSubtype, OrderPriority } from '../../types';
import { systemsService } from '../../services/systems.service';
import { equipmentService } from '../../services/equipment.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddOS: (os: ServiceOrder) => void;
}

const inputCls = 'w-full bg-surface-container-highest border border-white/10 rounded-md py-1.5 px-3 text-[13px] text-on-surface focus:outline-none focus:border-primary/50 placeholder:text-on-surface-variant/40';
const labelCls = 'block text-[11px] font-medium text-on-surface-variant/70 uppercase tracking-wide mb-1';
const sectionCls = 'space-y-3 border border-white/8 rounded-xl p-4 bg-surface-container-high/30';

type Step = 1 | 2 | 3 | 4;

export const NovaOrdemServicoModal: React.FC<Props> = ({ isOpen, onClose, onAddOS }) => {
  const [step, setStep] = useState<Step>(1);
  const [equipmentNames, setEquipmentNames] = useState<string[]>([]);
  const [allSystems, setAllSystems] = useState<string[]>([]);
  const [subsystems, setSubsystems] = useState<string[]>([]);

  // Campos do formulário
  const [requester, setRequester] = useState('');
  const [failureLocation, setFailureLocation] = useState<FailureLocation>('Fazenda');
  const [openDate] = useState(new Date().toLocaleDateString('pt-BR'));
  const [equipment, setEquipment] = useState('');
  const [equipmentKind, setEquipmentKind] = useState<EquipmentKind>('Trator');
  const [horimeter, setHorimeter] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [responsible, setResponsible] = useState('');
  const [maintenanceSubtype, setMaintenanceSubtype] = useState<MaintenanceSubtype>('Corretiva não planejada');
  const [priority, setPriority] = useState<OrderPriority>('Alta');
  const [affectedSystem, setAffectedSystem] = useState('');
  const [affectedSubsystem, setAffectedSubsystem] = useState('');
  const [reportedSymptom, setReportedSymptom] = useState('');
  const [servicesPerformed, setServicesPerformed] = useState('');
  const [partsUsed, setPartsUsed] = useState('');
  const [observations, setObservations] = useState('');
  const [failureDateTime, setFailureDateTime] = useState('');
  const [maintenanceStart, setMaintenanceStart] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    equipmentService.getAllEquipments().then((eqs) => setEquipmentNames(eqs.map((e) => e.name)));
    setAllSystems(systemsService.getUniqueSystems());
  }, [isOpen]);

  useEffect(() => {
    if (!affectedSystem) { setSubsystems([]); return; }
    setSubsystems(systemsService.getSubsystems(affectedSystem).map((s) => s.subsystem));
    setAffectedSubsystem('');
  }, [affectedSystem]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const os: ServiceOrder = {
      id: `OS-${Math.floor(4030 + Math.random() * 1000)}`,
      requester,
      failureLocation,
      openDate,
      equipment,
      equipmentKind,
      horimeter: horimeter ? Number(horimeter) : undefined,
      brand,
      model,
      responsible,
      type: maintenanceSubtype === 'Preventiva' ? 'Preventiva' : 'Corretiva',
      maintenanceSubtype,
      priority,
      affectedSystem,
      affectedSubsystem,
      reportedSymptom,
      servicesPerformed,
      partsUsed,
      observations,
      failureDateTime,
      maintenanceStart,
      status: 'Pendente',
      date: openDate,
      costEstimate: '-',
      technician: responsible,
    };
    onAddOS(os);
    onClose();
    setStep(1);
  };

  const stepLabels = ['Identificação', 'Dados da Falha', 'Detalhamento', 'Resumo'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <ClipboardList size={20} className="text-primary" />
            <div>
              <h2 className="text-[16px] font-bold text-on-surface">Nova Ordem de Serviço</h2>
              <p className="text-[11px] text-on-surface-variant/60">Etapa {step} de 4 — {stepLabels[step - 1]}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-on-surface-variant">
            <X size={18} />
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-1 px-6 pt-3 flex-shrink-0">
          {([1, 2, 3, 4] as Step[]).map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-white/10'}`}
            />
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Step 1: Dados da OS + Identificação do Equipamento */}
          {step === 1 && (
            <>
              <div className={sectionCls}>
                <h3 className="text-[12px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Dados da Ordem de Serviço</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelCls}>Solicitante</label>
                    <input className={inputCls} placeholder="Nome do solicitante" value={requester} onChange={(e) => setRequester(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Localização da Falha</label>
                    <select className={inputCls} value={failureLocation} onChange={(e) => setFailureLocation(e.target.value as FailureLocation)}>
                      {(['Fazenda', 'Pátio', 'Lavoura', 'Outro'] as FailureLocation[]).map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Data de Abertura</label>
                    <input className={`${inputCls} text-on-surface-variant/60`} value={openDate} readOnly />
                  </div>
                </div>
              </div>

              <div className={sectionCls}>
                <h3 className="text-[12px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Identificação do Equipamento</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Tipo de Equipamento</label>
                    <select className={inputCls} value={equipmentKind} onChange={(e) => setEquipmentKind(e.target.value as EquipmentKind)}>
                      {(['Trator', 'Implemento', 'Máquina', 'Caminhão', 'Outro'] as EquipmentKind[]).map((k) => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Horímetro</label>
                    <input className={inputCls} type="number" placeholder="Ex: 6800" value={horimeter} onChange={(e) => setHorimeter(e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Descrição / Nome do Ativo</label>
                    <select className={inputCls} value={equipment} onChange={(e) => setEquipment(e.target.value)}>
                      <option value="">Selecione o equipamento...</option>
                      {equipmentNames.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Marca</label>
                    <input className={inputCls} placeholder="Ex: Massey Ferguson" value={brand} onChange={(e) => setBrand(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Modelo</label>
                    <input className={inputCls} placeholder="Ex: 265" value={model} onChange={(e) => setModel(e.target.value)} />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Dados de Parada + Dados da Falha */}
          {step === 2 && (
            <>
              <div className={sectionCls}>
                <h3 className="text-[12px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Dados de Parada</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Falha na Operação (data/hora)</label>
                    <input className={inputCls} type="datetime-local" value={failureDateTime} onChange={(e) => setFailureDateTime(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Início da Manutenção</label>
                    <input className={inputCls} type="datetime-local" value={maintenanceStart} onChange={(e) => setMaintenanceStart(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className={sectionCls}>
                <h3 className="text-[12px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Dados da Falha</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelCls}>Responsável pela Manutenção</label>
                    <input className={inputCls} placeholder="Nome do técnico / mecânico" value={responsible} onChange={(e) => setResponsible(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Tipo de Manutenção</label>
                    <select className={inputCls} value={maintenanceSubtype} onChange={(e) => setMaintenanceSubtype(e.target.value as MaintenanceSubtype)}>
                      <option value="Preventiva">Preventiva</option>
                      <option value="Corretiva não planejada">Corretiva não planejada</option>
                      <option value="Corretiva planejada">Corretiva planejada</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Classificação de Gravidade</label>
                    <select className={inputCls} value={priority} onChange={(e) => setPriority(e.target.value as OrderPriority)}>
                      <option value="Alta">Alta</option>
                      <option value="Média">Média</option>
                      <option value="Baixa">Baixa</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Sistema Afetado</label>
                    <select className={inputCls} value={affectedSystem} onChange={(e) => setAffectedSystem(e.target.value)}>
                      <option value="">Selecione...</option>
                      {allSystems.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Subsistema / Componente</label>
                    <select className={inputCls} value={affectedSubsystem} onChange={(e) => setAffectedSubsystem(e.target.value)} disabled={!affectedSystem}>
                      <option value="">Selecione...</option>
                      {subsystems.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Textos Livres */}
          {step === 3 && (
            <div className="space-y-3">
              {[
                { label: 'Sintoma Reportado', value: reportedSymptom, onChange: setReportedSymptom, placeholder: 'Descreva o sintoma observado no equipamento...' },
                { label: 'Serviços Executados', value: servicesPerformed, onChange: setServicesPerformed, placeholder: 'Liste os serviços realizados...' },
                { label: 'Peças Utilizadas', value: partsUsed, onChange: setPartsUsed, placeholder: 'Ex: Filtro de óleo (1un), Óleo SAE 15W-40 (7,8L)...' },
                { label: 'Observações', value: observations, onChange: setObservations, placeholder: 'Observações adicionais...' },
              ].map(({ label, value, onChange, placeholder }) => (
                <div key={label} className={sectionCls}>
                  <label className={labelCls}>{label}</label>
                  <textarea
                    rows={3}
                    className={`${inputCls} resize-none`}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Resumo */}
          {step === 4 && (
            <div className="space-y-3">
              <div className={sectionCls}>
                <h3 className="text-[12px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">Resumo da OS</h3>
                {[
                  ['Solicitante', requester],
                  ['Equipamento', equipment || '—'],
                  ['Tipo', equipmentKind],
                  ['Local', failureLocation],
                  ['Responsável', responsible || '—'],
                  ['Manutenção', maintenanceSubtype],
                  ['Gravidade', priority],
                  ['Sistema', affectedSystem || '—'],
                  ['Subsistema', affectedSubsystem || '—'],
                ].map(([key, val]) => (
                  <div key={key} className="flex justify-between text-[12px] py-1 border-b border-white/5">
                    <span className="text-on-surface-variant/70">{key}:</span>
                    <span className="font-medium text-on-surface">{val}</span>
                  </div>
                ))}
              </div>
              {reportedSymptom && (
                <div className={sectionCls}>
                  <label className={labelCls}>Sintoma</label>
                  <p className="text-[12px] text-on-surface/80">{reportedSymptom}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-3 px-6 py-4 border-t border-white/8 flex-shrink-0">
          <button
            onClick={() => step > 1 ? setStep((s) => (s - 1) as Step) : onClose()}
            className="px-4 py-2 rounded-md bg-surface-container-highest border border-white/10 text-on-surface-variant hover:text-on-surface text-[13px] transition-all"
          >
            {step > 1 ? '← Voltar' : 'Cancelar'}
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={step === 1 && !equipment}
              className="px-5 py-2 rounded-md bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-[13px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Próximo →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!equipment || !responsible}
              className="px-5 py-2 rounded-md bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-[13px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Criar Ordem de Serviço
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
