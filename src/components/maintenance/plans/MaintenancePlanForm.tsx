import React from 'react';
import { ArrowLeft, ArrowRight, X, FileText } from 'lucide-react';
import { useMaintenancePlanForm } from '../../../hooks/useMaintenancePlanForm';
import { MaintenancePlanStepper } from './MaintenancePlanStepper';
import { MaintenanceIntervalBuilder } from './MaintenanceIntervalBuilder';
import { MaintenanceTaskBuilder } from './MaintenanceTaskBuilder';
import { MaintenancePlanReview } from './MaintenancePlanReview';
import { MaintenancePlanVersionHistory } from './MaintenancePlanVersionHistory';
import { Button } from '../../ui/Button';

interface MaintenancePlanFormProps {
  planId?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const MaintenancePlanForm: React.FC<MaintenancePlanFormProps> = ({ planId, onCancel, onSuccess }) => {
  const {
    currentStep,
    setCurrentStep,
    formData,
    loading,
    saving,
    error,
    hasHistoryWarning,
    updateField,
    addInterval,
    removeInterval,
    addTaskToInterval,
    nextStep,
    prevStep,
    submitForm,
  } = useMaintenancePlanForm(planId);

  const handleSubmit = async () => {
    try {
      await submitForm();
      onSuccess();
    } catch {
      // erro capturado e exibido reativamente na view
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 animate-pulse font-extrabold text-sm">Carregando matriz do plano...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white/70 dark:bg-gray-900/70 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onCancel} title="Voltar" className="rounded-xl">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Button>
          <div>
            <h2 className="font-extrabold text-lg text-gray-900 dark:text-white">
              {planId ? `Editar Plano: ${formData.name || planId}` : 'Criar Nova Matriz de Plano Preventivo'}
            </h2>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">Construtor Profissional AgroGuard • Passo {currentStep} de 6</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-500 font-semibold text-xs">
          <X className="w-4 h-4 mr-1" /> Cancelar
        </Button>
      </div>

      <MaintenancePlanStepper currentStep={currentStep} onStepClick={(s) => setCurrentStep(s)} />

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl font-bold text-xs">{error}</div>}

      <div className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md">
        {currentStep === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" /> Identificação e Dados Básicos do Plano
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Código da Matriz</label>
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) => updateField('code', e.target.value)}
                  placeholder="Ex: PLN-JD-8R-26"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Nome do Plano Preventivo</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Ex: Plano Preventivo Colheitadeiras S700 - Safra 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900 text-sm font-semibold text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Descrição / Justificativa Técnica</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Descreva o escopo, normas e metas deste plano na fazenda..."
                rows={3}
                className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900 text-sm font-medium"
              />
            </div>
            {planId && <MaintenancePlanVersionHistory plan={formData} />}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Aplicação e Frota Alvo</h3>
            <p className="text-xs text-gray-500">Selecione os tipos ou modelos de máquinas que receberão este plano operacional.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {['Trator', 'Colhedora', 'Implemento', 'Caminhão'].map((t) => {
                const checked = formData.applicableEquipmentTypeIds?.includes(t);
                return (
                  <label key={t} className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${checked ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-extrabold' : 'border-gray-200 dark:border-gray-800 text-gray-500'}`}>
                    <input
                      type="checkbox"
                      checked={checked || false}
                      onChange={() => {
                        const curr = formData.applicableEquipmentTypeIds || [];
                        const updated = checked ? curr.filter((x) => x !== t) : [...curr, t];
                        updateField('applicableEquipmentTypeIds', updated);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{t}s</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <MaintenanceIntervalBuilder
            intervals={formData.intervals || []}
            onAddInterval={addInterval}
            onRemoveInterval={removeInterval}
          />
        )}

        {currentStep === 4 && (
          <MaintenanceTaskBuilder
            intervals={formData.intervals || []}
            onAddTask={(idx, tsk) => addTaskToInterval(idx, tsk)}
          />
        )}

        {currentStep === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Configurações de Tolerância & Alertas</h3>
            <p className="text-xs text-gray-500">A margem de tolerância impede disparos falsos de "Vencida" se a máquina atrasar algumas horas na lavoura.</p>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/50 rounded-2xl border border-purple-200 text-xs font-bold text-purple-900 dark:text-purple-300">
              ⚡ O motor preventivo avisará o operador com 10% de antecedência da leitura prevista no horímetro!
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <MaintenancePlanReview formData={formData} hasHistoryWarning={hasHistoryWarning} />
        )}
      </div>

      {/* Footer Nav */}
      <div className="flex justify-between items-center bg-white/80 dark:bg-gray-900/80 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md">
        <Button variant="outline" disabled={currentStep === 1 || saving} onClick={prevStep} className="font-bold text-xs">
          &larr; Etapa Anterior
        </Button>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={saving} className="text-xs font-semibold text-gray-500">
            Cancelar
          </Button>
          {currentStep < 6 ? (
            <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 shadow-md">
              Próxima Etapa <ArrowRight className="w-4 h-4 ml-1.5 inline" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={saving} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs px-8 shadow-lg shadow-emerald-500/20">
              {saving ? 'Gravando e Calculando...' : hasHistoryWarning ? 'Publicar Nova Versão (v2+)' : 'Confirmar & Publicar Plano'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
