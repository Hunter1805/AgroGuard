import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { EquipmentFormData, FormStep } from '../../types/equipment-form';
import { equipmentService } from '../../services/equipment.service';
import { FormHeader } from './form/FormHeader';
import { FormStepIndicator } from './form/FormStepIndicator';
import { FormFooter } from './form/FormFooter';
import { UnsavedChangesModal } from './form/UnsavedChangesModal';
import { Step1Identification } from './form/Step1Identification';
import { Step2Location } from './form/Step2Location';
import { Step3StatusMeters } from './form/Step3StatusMeters';
import { Step4TechnicalInfo } from './form/Step4TechnicalInfo';
import { Step5TiresMaintenance } from './form/Step5TiresMaintenance';
import { Step6DocsReview } from './form/Step6DocsReview';

const DEFAULT_FORM_DATA: EquipmentFormData = {
  assetType: 'Trator',
  name: '',
  brand: 'Massey Ferguson',
  model: '',
  year: '2026',
  plateOrCode: '',
  patrimony: '',
  serialNumber: '',
  farm: 'Fazenda São João',
  sector: 'Café',
  location: 'Talhão 1',
  operatorName: '',
  status: 'operante',
  fuelLevel: 100,
  meterType: 'horimetro',
  currentHours: 0,
  meters: [
    { id: 'm-init', type: 'horimetro', label: 'Horímetro Principal', currentValue: 0, unit: 'h', lastReadingDate: new Date().toLocaleDateString('pt-BR') }
  ],
  fuelType: 'Diesel S10',
  enginePower: '',
  transmissionType: '',
  tankCapacity: '',
  operatingWeight: '',
  notes: '',
  tireConfig: '',
  maintenancePlanId: '',
  maintenancePlanName: '',
  documents: [],
  images: [],
};

export const CadastroEquipamentoView: React.FC = () => {
  const navigate = useNavigate();
  const { id: routeId, equipmentId } = useParams<{ id?: string; equipmentId?: string }>();
  const activeId = equipmentId || routeId;
  const isEditing = Boolean(activeId && activeId !== 'novo');

  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<EquipmentFormData>(DEFAULT_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Carregar dados existentes se for edição ou rascunho se for novo
  useEffect(() => {
    async function load() {
      if (isEditing && activeId) {
        const item = await equipmentService.getEquipmentById(activeId);
        if (item) {
          setFormData({
            id: item.id,
            assetType: item.assetType,
            name: item.name,
            brand: item.brand,
            model: item.model,
            year: item.year || '',
            plateOrCode: item.plateOrCode,
            patrimony: item.patrimony || '',
            serialNumber: item.serialNumber || '',
            farm: item.farm || 'Fazenda São João',
            sector: item.sector || 'Café',
            location: item.location || 'Talhão 1',
            operatorName: item.operatorName || '',
            status: item.status,
            fuelLevel: item.fuelLevel,
            meterType: item.meterType || 'horimetro',
            currentHours: item.currentHours,
            meters: item.meters || [],
            fuelType: item.fuelType || 'Diesel S10',
            enginePower: item.enginePower || '',
            transmissionType: item.transmissionType || '',
            tankCapacity: item.tankCapacity || '',
            operatingWeight: item.operatingWeight || '',
            notes: item.notes || '',
            tireConfig: item.tireConfig || '',
            maintenancePlanId: item.maintenancePlanId || '',
            maintenancePlanName: item.maintenancePlanName || '',
            maintenanceInterval: item.maintenanceInterval,
            lastMaintenanceDate: item.lastMaintenanceDate,
            nextMaintenanceDate: item.nextMaintenanceDate,
            documents: item.documents || [],
            images: item.images || [],
          });
        }
      } else {
        const draft = equipmentService.getDraft();
        if (draft) {
          setFormData((prev: EquipmentFormData) => ({ ...prev, ...draft }));
          setIsDraftSaved(true);
        }
      }
    }
    load();
  }, [activeId, isEditing]);

  const handleFieldChange = (field: keyof EquipmentFormData, value: any) => {
    setFormData((prev: EquipmentFormData) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setErrorMsg(null);
  };

  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.brand.trim() || !formData.model.trim() || !formData.plateOrCode.trim()) {
        setErrorMsg('Preencha os campos obrigatórios (*) da identificação.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.farm.trim() || !formData.sector.trim() || !formData.location.trim()) {
        setErrorMsg('Preencha a fazenda, setor e localização.');
        return false;
      }
    }
    setErrorMsg(null);
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < 6) {
      setCurrentStep((prev: FormStep) => (prev + 1) as FormStep);
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    if (currentStep > 1) {
      setCurrentStep((prev: FormStep) => (prev - 1) as FormStep);
    }
  };

  const handleSaveDraft = () => {
    equipmentService.saveDraft(formData);
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      if (isEditing && activeId) {
        await equipmentService.updateEquipment(activeId, formData);
      } else {
        await equipmentService.createEquipment(formData);
      }
      setIsDirty(false);
      navigate('/equipamentos');
    } catch {
      setErrorMsg('Erro ao salvar o equipamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isDirty) {
      setShowExitModal(true);
    } else {
      navigate('/equipamentos');
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-background text-on-background flex flex-col overflow-hidden animate-fade-in">
      <FormHeader
        isEditing={isEditing}
        equipmentCode={formData.plateOrCode}
        isDraftSaved={isDraftSaved}
        onClose={handleClose}
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="max-w-5xl mx-auto space-y-6 pb-6">
          <div className="glass-card rounded-xl border border-white/5 p-4">
            <FormStepIndicator
              currentStep={currentStep}
              onStepClick={(step: FormStep) => {
                if (validateCurrentStep()) setCurrentStep(step);
              }}
            />
          </div>

          {errorMsg && (
            <div className="bg-error/10 border border-error/30 text-error p-3.5 rounded-lg text-[13px] animate-fade-in">
              ⚠ {errorMsg}
            </div>
          )}

          <div className="glass-card rounded-xl border border-white/5 p-6 shadow-xl">
            {currentStep === 1 && <Step1Identification data={formData} onChange={handleFieldChange} />}
            {currentStep === 2 && <Step2Location data={formData} onChange={handleFieldChange} />}
            {currentStep === 3 && <Step3StatusMeters data={formData} onChange={handleFieldChange} />}
            {currentStep === 4 && <Step4TechnicalInfo data={formData} onChange={handleFieldChange} />}
            {currentStep === 5 && <Step5TiresMaintenance data={formData} onChange={handleFieldChange} />}
            {currentStep === 6 && <Step6DocsReview data={formData} onChange={handleFieldChange} />}
          </div>
        </div>
      </main>

      <FormFooter
        currentStep={currentStep}
        isSubmitting={isSubmitting}
        onPrev={handlePrev}
        onNext={handleNext}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
      />

      <UnsavedChangesModal
        isOpen={showExitModal}
        onConfirmLeave={() => navigate('/equipamentos')}
        onCancel={() => setShowExitModal(false)}
        onSaveDraftAndLeave={() => {
          handleSaveDraft();
          navigate('/equipamentos');
        }}
      />
    </div>
  );
};
