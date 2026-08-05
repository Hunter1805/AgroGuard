import { useEffect, useState } from 'react';
import type { Equipment, MeterConfig } from '../types/equipment';
import type { MeterReadingSource, ReadingValidationResult } from '../types/equipment-readings';
import { equipmentService } from '../services/equipment.service';
import { equipmentReadingsService } from '../services/equipment-readings.service';

interface UseReadingFormProps {
  initialEquipmentId?: string;
  onSuccess?: () => void;
}

export function useReadingForm({ initialEquipmentId, onSuccess }: UseReadingFormProps = {}) {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>(initialEquipmentId || '');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const [availableMeters, setAvailableMeters] = useState<MeterConfig[]>([]);
  const [selectedMeterId, setSelectedMeterId] = useState<string>('');
  const [selectedMeter, setSelectedMeter] = useState<MeterConfig | null>(null);

  const [previousValue, setPreviousValue] = useState<number>(0);
  const [value, setValue] = useState<string>('');
  const [readingAt, setReadingAt] = useState<string>(
    new Date().toISOString().slice(0, 16).replace('T', ' ')
  );
  const [source, setSource] = useState<MeterReadingSource>('manual');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState<string>('');
  const [justification, setJustification] = useState<string>('');

  const [validation, setValidation] = useState<ReadingValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Carregar lista de equipamentos
  useEffect(() => {
    equipmentService.getAllEquipments().then((data) => {
      setEquipments(data);
      if (initialEquipmentId) {
        const found = data.find((e) => e.id === initialEquipmentId);
        if (found) {
          setSelectedEquipmentId(found.id);
          setSelectedEquipment(found);
        }
      }
    });
  }, [initialEquipmentId]);

  // Ao alterar equipamento selecionado
  useEffect(() => {
    if (!selectedEquipmentId) {
      setSelectedEquipment(null);
      setAvailableMeters([]);
      setSelectedMeterId('');
      setSelectedMeter(null);
      setPreviousValue(0);
      return;
    }

    equipmentService.getEquipmentById(selectedEquipmentId).then((eq) => {
      if (!eq) return;
      setSelectedEquipment(eq);

      const meters: MeterConfig[] = eq.meters || [
        {
          id: 'm-default',
          type: eq.meterType === 'odometro' ? 'odometro' : 'horimetro',
          label: eq.meterType === 'odometro' ? 'Odômetro Principal' : 'Horímetro Principal',
          currentValue: eq.currentHours || 0,
          unit: eq.meterType === 'odometro' ? 'km' : 'h',
        },
      ];

      setAvailableMeters(meters);
      if (meters.length > 0) {
        setSelectedMeterId(meters[0].id);
        setSelectedMeter(meters[0]);
        setPreviousValue(meters[0].currentValue);
      }
    });
  }, [selectedEquipmentId]);

  // Ao alterar medidor selecionado
  const handleMeterChange = (meterId: string) => {
    setSelectedMeterId(meterId);
    const m = availableMeters.find((item) => item.id === meterId) || null;
    setSelectedMeter(m);
    if (m) setPreviousValue(m.currentValue);
  };

  // Re-validar ao alterar o valor digitado
  useEffect(() => {
    const numVal = parseFloat(value);
    if (isNaN(numVal) || !selectedMeter) {
      setValidation(null);
      return;
    }

    const valResult = equipmentReadingsService.validateReading({
      previousValue,
      value: numVal,
      meterType: selectedMeter.type === 'odometro' ? 'odometro' : 'horimetro',
      readingAt,
    });

    setValidation(valResult);
  }, [value, previousValue, selectedMeter, readingAt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipmentId || !selectedMeterId || !selectedMeter) {
      setSubmitError('Selecione um equipamento e medidor válidos.');
      return;
    }

    const numVal = parseFloat(value);
    if (isNaN(numVal)) {
      setSubmitError('Informe um valor de leitura numérico válido.');
      return;
    }

    if (validation?.requiresJustification && !justification.trim()) {
      setSubmitError('Informe uma justificativa obrigatória para registrar esta leitura.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await equipmentReadingsService.createReading({
        equipmentId: selectedEquipmentId,
        meterId: selectedMeterId,
        meterType: selectedMeter.type === 'odometro' ? 'odometro' : 'horimetro',
        unit: selectedMeter.unit === 'km' ? 'km' : 'h',
        previousValue,
        value: numVal,
        readingAt,
        source,
        photoUrl,
        notes: notes.trim() || undefined,
        justification: justification.trim() || undefined,
        createdBy: 'Operador Atual',
      });

      if (onSuccess) onSuccess();
    } catch {
      setSubmitError('Erro ao registrar a leitura. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const numericValue = parseFloat(value) || 0;
  const difference = numericValue - previousValue;

  return {
    equipments,
    selectedEquipmentId,
    setSelectedEquipmentId,
    selectedEquipment,
    availableMeters,
    selectedMeterId,
    handleMeterChange,
    selectedMeter,
    previousValue,
    value,
    setValue,
    difference,
    readingAt,
    setReadingAt,
    source,
    setSource,
    photoUrl,
    setPhotoUrl,
    notes,
    setNotes,
    justification,
    setJustification,
    validation,
    isSubmitting,
    submitError,
    handleSubmit,
  };
}
