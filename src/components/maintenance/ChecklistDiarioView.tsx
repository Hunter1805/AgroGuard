import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Send, RotateCcw } from 'lucide-react';
import { useChecklist } from '../../hooks/useChecklist';
import { useEquipments } from '../../hooks/useEquipments';
import type { ChecklistItemEntry, ChecklistItemStatus } from '../../types/checklist';

const StatusButton: React.FC<{
  active: boolean;
  variant: 'ok' | 'nok';
  onClick: () => void;
}> = ({ active, variant, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
      active
        ? variant === 'ok'
          ? 'bg-primary/20 text-primary border border-primary/40'
          : 'bg-error/20 text-error border border-error/40'
        : 'bg-surface-container-highest border border-white/10 text-on-surface-variant hover:border-white/20'
    }`}
  >
    {variant === 'ok' ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
    {variant === 'ok' ? 'OK' : 'NOK'}
  </button>
);

export const ChecklistDiarioView: React.FC = () => {
  const { items, sessions, loading, submitSession, buildNewSession } = useChecklist();
  const { equipments } = useEquipments();

  const [mode, setMode] = useState<'form' | 'history'>('form');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [horimeter, setHorimeter] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [entries, setEntries] = useState<Record<number, ChecklistItemEntry>>({});
  const [submitted, setSubmitted] = useState(false);

  const updateEntry = (itemId: number, status: ChecklistItemStatus, observation?: string) => {
    setEntries((prev) => ({
      ...prev,
      [itemId]: { itemId, status, observation: observation ?? prev[itemId]?.observation },
    }));
  };

  const handleSubmit = async () => {
    if (!selectedEquipmentId || !operatorName || !horimeter) return;
    const equipment = equipments.find((e) => e.id === selectedEquipmentId);
    if (!equipment) return;

    const allEntries = items.map((item) =>
      entries[item.id] ?? { itemId: item.id, status: 'pendente' as ChecklistItemStatus }
    );

    const session = buildNewSession(
      equipment.id,
      equipment.name,
      operatorName,
      Number(horimeter),
      allEntries
    );
    (session as any).timeSpentMinutes = timeSpent ? Number(timeSpent) : undefined;

    await submitSession(session);
    setSubmitted(true);
  };

  const handleReset = () => {
    setEntries({});
    setSubmitted(false);
    setHorimeter('');
    setTimeSpent('');
    setOperatorName('');
    setSelectedEquipmentId('');
  };

  const dailyItems = items.filter((i) => i.frequency === 'daily');
  const weeklyItems = items.filter((i) => i.frequency === 'weekly');
  const nokCount = Object.values(entries).filter((e) => e.status === 'nok').length;
  const selectedEquip = equipments.find((e) => e.id === selectedEquipmentId);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-title-md text-[24px] font-semibold text-on-surface tracking-tight">Checklist Diário</h2>
          <p className="font-body-sm text-[13px] text-on-surface-variant/70 mt-0.5">
            Inspeção diária de equipamentos — 12 itens diários + 2 semanais.
          </p>
        </div>
        <div className="flex gap-2">
          {(['form', 'history'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                mode === m
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'bg-surface-container-highest border border-white/10 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {m === 'form' ? 'Novo Checklist' : 'Histórico'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'form' && (
        <>
          {submitted ? (
            <div className="glass-card rounded-xl p-8 text-center space-y-4 border border-primary/20">
              <CheckCircle2 size={40} className="text-primary mx-auto" />
              <div>
                <h3 className="text-[18px] font-bold text-on-surface">Checklist enviado!</h3>
                <p className="text-[13px] text-on-surface-variant/70 mt-1">
                  {selectedEquip?.name} · {new Date().toLocaleDateString('pt-BR')}
                </p>
                {nokCount > 0 && (
                  <p className="text-[13px] text-error mt-2 flex items-center justify-center gap-1.5">
                    <AlertTriangle size={14} />
                    {nokCount} item(ns) NOK — pendências registradas.
                  </p>
                )}
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-primary/10 text-primary rounded-md text-[13px] font-medium hover:bg-primary/20 transition-all"
              >
                <RotateCcw size={14} />
                Novo Checklist
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cabeçalho do formulário */}
              <div className="glass-card rounded-xl p-4 border border-white/8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="text-[11px] font-medium text-on-surface-variant/70 uppercase tracking-wide">Equipamento</label>
                  <select
                    value={selectedEquipmentId}
                    onChange={(e) => setSelectedEquipmentId(e.target.value)}
                    className="w-full mt-1 bg-surface-container-highest border border-white/10 rounded-md py-1.5 px-3 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
                  >
                    <option value="">Selecionar equipamento...</option>
                    {equipments.filter((e) => e.assetType === 'Trator' || e.assetType === 'Colhedora').map((e) => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-on-surface-variant/70 uppercase tracking-wide">Horímetro</label>
                  <input
                    type="number"
                    placeholder="Ex: 6800"
                    value={horimeter}
                    onChange={(e) => setHorimeter(e.target.value)}
                    className="w-full mt-1 bg-surface-container-highest border border-white/10 rounded-md py-1.5 px-3 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-on-surface-variant/70 uppercase tracking-wide">
                    <Clock size={11} className="inline mr-1" />Tempo gasto (min)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 25"
                    value={timeSpent}
                    onChange={(e) => setTimeSpent(e.target.value)}
                    className="w-full mt-1 bg-surface-container-highest border border-white/10 rounded-md py-1.5 px-3 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-medium text-on-surface-variant/70 uppercase tracking-wide">Operador</label>
                  <input
                    type="text"
                    placeholder="Nome do funcionário"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="w-full mt-1 bg-surface-container-highest border border-white/10 rounded-md py-1.5 px-3 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              {/* Itens Diários */}
              <div className="glass-card rounded-xl border border-white/8 overflow-hidden">
                <div className="px-5 py-3 bg-surface-container-high/60 border-b border-white/8 flex justify-between items-center">
                  <span className="text-[13px] font-semibold text-on-surface">Itens a verificar diariamente</span>
                  <span className="text-[11px] text-on-surface-variant/60">{dailyItems.length} itens</span>
                </div>
                <div className="divide-y divide-white/5">
                  {dailyItems.map((item) => {
                    const entry = entries[item.id];
                    return (
                      <div key={item.id} className={`px-5 py-3 space-y-2 transition-colors ${entry?.status === 'nok' ? 'bg-error/5' : ''}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] font-mono-label text-on-surface-variant/50 mr-1">{item.id}.</span>
                            <span className="text-[13px] text-on-surface">{item.description}</span>
                            {item.supply && (
                              <span className="ml-2 text-[10px] text-tertiary font-mono-label bg-tertiary/10 px-1.5 py-0.5 rounded">
                                {item.supply}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <StatusButton active={entry?.status === 'ok'} variant="ok" onClick={() => updateEntry(item.id, 'ok')} />
                            <StatusButton active={entry?.status === 'nok'} variant="nok" onClick={() => updateEntry(item.id, 'nok')} />
                          </div>
                        </div>
                        {entry?.status === 'nok' && (
                          <input
                            type="text"
                            placeholder="Descreva a pendência..."
                            defaultValue={entry.observation}
                            onChange={(e) => updateEntry(item.id, 'nok', e.target.value)}
                            className="w-full bg-surface-container-highest border border-error/30 rounded-md py-1 px-3 text-[12px] text-on-surface focus:outline-none focus:border-error/60 placeholder-on-surface-variant/40"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Itens Semanais */}
              <div className="glass-card rounded-xl border border-white/8 overflow-hidden">
                <div className="px-5 py-3 bg-tertiary/10 border-b border-white/8 flex justify-between items-center">
                  <span className="text-[13px] font-semibold text-tertiary">Realizar Semanalmente — Segunda-Feira</span>
                  <span className="text-[11px] text-on-surface-variant/60">{weeklyItems.length} itens</span>
                </div>
                <div className="divide-y divide-white/5">
                  {weeklyItems.map((item) => {
                    const entry = entries[item.id];
                    return (
                      <div key={item.id} className={`px-5 py-3 space-y-2 ${entry?.status === 'nok' ? 'bg-error/5' : ''}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] font-mono-label text-on-surface-variant/50 mr-1">{item.id}.</span>
                            <span className="text-[13px] text-on-surface">{item.description}</span>
                            {item.supply && (
                              <span className="ml-2 text-[10px] text-tertiary font-mono-label bg-tertiary/10 px-1.5 py-0.5 rounded">{item.supply}</span>
                            )}
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <StatusButton active={entry?.status === 'ok'} variant="ok" onClick={() => updateEntry(item.id, 'ok')} />
                            <StatusButton active={entry?.status === 'nok'} variant="nok" onClick={() => updateEntry(item.id, 'nok')} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!selectedEquipmentId || !operatorName || !horimeter}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-[14px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                Enviar Checklist
              </button>
            </div>
          )}
        </>
      )}

      {mode === 'history' && (
        <div className="glass-card rounded-xl border border-white/8 overflow-hidden">
          <div className="px-5 py-3 border-b border-white/8">
            <span className="text-[13px] font-semibold text-on-surface">Histórico de Checklists</span>
          </div>
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant text-[13px]">Carregando...</div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant text-[13px]">Nenhum checklist registrado.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {sessions.map((s) => {
                const nokItems = s.items.filter((i) => i.status === 'nok').length;
                return (
                  <div key={s.id} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[13px] font-semibold text-on-surface">{s.equipmentName}</p>
                      <p className="text-[11px] text-on-surface-variant/60 mt-0.5">
                        {new Date(s.date).toLocaleDateString('pt-BR')} · {s.operatorName} · {s.horimeter}h
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {nokItems > 0 && (
                        <span className="text-[11px] text-error bg-error/10 px-2 py-0.5 rounded-full font-mono-label">
                          {nokItems} NOK
                        </span>
                      )}
                      <span
                        className={`text-[11px] font-mono-label px-2 py-0.5 rounded-full ${
                          s.status === 'concluido'
                            ? 'bg-primary/10 text-primary'
                            : s.status === 'com_pendencias'
                            ? 'bg-error/10 text-error'
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        {s.status === 'concluido' ? 'Concluído' : s.status === 'com_pendencias' ? 'Com Pendências' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
