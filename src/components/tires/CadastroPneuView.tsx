import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Disc, AlertCircle } from 'lucide-react';
import { useTireForm } from '../../hooks/useTireForm';
import { tiresService } from '../../services/tires.service';
import { Button } from '../ui/Button';
import { PageHeader } from '../ui/PageHeader';
import { ROUTES } from '../../types/routes';

export const CadastroPneuView: React.FC = () => {
  const navigate = useNavigate();
  const { tireId } = useParams<{ tireId: string }>();
  const [searchParams] = useSearchParams();
  const queryEquipmentId = searchParams.get('equipmentId');

  const isEditing = Boolean(tireId);

  const [internalCode, setInternalCode] = useState('');
  const [brand, setBrand] = useState('Pirelli');
  const [model, setModel] = useState('');
  const [size, setSize] = useState('18.4-30');
  const [constructionType, setConstructionType] = useState<'radial' | 'diagonal'>('diagonal');
  const [application, setApplication] = useState('Trator Traseiro');
  const [serialNumber, setSerialNumber] = useState('');
  const [dotCode, setDotCode] = useState('');
  const [manufacturingDate, setManufacturingDate] = useState('');

  const [acquisitionDate, setAcquisitionDate] = useState(new Date().toISOString().split('T')[0]);
  const [acquisitionValue, setAcquisitionValue] = useState<number | ''>(4500);
  const [warrantyEndDate, setWarrantyEndDate] = useState('');

  const [initialTreadDepth, setInitialTreadDepth] = useState<number | ''>(35);
  const [currentTreadDepth, setCurrentTreadDepth] = useState<number | ''>(35);
  const [minimumTreadDepth, setMinimumTreadDepth] = useState<number | ''>(8);

  const [recommendedMinimumPressure, setRecommendedMinimumPressure] = useState<number | ''>(28);
  const [recommendedMaximumPressure, setRecommendedMaximumPressure] = useState<number | ''>(34);
  const [pressureUnit, setPressureUnit] = useState<'psi' | 'bar' | 'kpa'>('psi');

  const [hasTube, setHasTube] = useState(true);
  const [usesWaterBallast, setUsesWaterBallast] = useState(true);
  const [maximumRetreads, setMaximumRetreads] = useState<number | ''>(2);
  const [notes, setNotes] = useState('');

  const [initialTire, setInitialTire] = useState<any>(undefined);
  const { loading, error, setError, saveTire } = useTireForm(initialTire, () => navigate(ROUTES.PNEUS));

  useEffect(() => {
    if (isEditing && tireId) {
      tiresService.getTireById(tireId).then(t => {
        if (t) {
          setInitialTire(t);
          setInternalCode(t.internalCode);
          setBrand(t.brand || '');
          setModel(t.model || '');
          setSize(t.size);
          setConstructionType(t.constructionType || 'diagonal');
          setApplication(t.application || '');
          setSerialNumber(t.serialNumber || '');
          setDotCode(t.dotCode || '');
          setManufacturingDate(t.manufacturingDate || '');
          setAcquisitionDate(t.acquisitionDate || '');
          setAcquisitionValue(t.acquisitionValue ?? '');
          setWarrantyEndDate(t.warrantyEndDate || '');
          setInitialTreadDepth(t.initialTreadDepth ?? '');
          setCurrentTreadDepth(t.currentTreadDepth ?? '');
          setMinimumTreadDepth(t.minimumTreadDepth ?? '');
          setRecommendedMinimumPressure(t.recommendedMinimumPressure ?? '');
          setRecommendedMaximumPressure(t.recommendedMaximumPressure ?? '');
          setPressureUnit(t.pressureUnit || 'psi');
          setHasTube(t.hasTube);
          setUsesWaterBallast(t.usesWaterBallast);
          setMaximumRetreads(t.maximumRetreads ?? '');
          setNotes(t.notes || '');
        }
      });
    } else {
      // Sugere código interno único
      setInternalCode(`PN-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [isEditing, tireId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalCode || !size) {
      setError('Código Interno e Medida do Pneu são obrigatórios.');
      return;
    }

    await saveTire({
      internalCode,
      brand,
      model,
      size,
      constructionType,
      application,
      serialNumber,
      dotCode,
      manufacturingDate: manufacturingDate || undefined,
      acquisitionDate: acquisitionDate || undefined,
      acquisitionValue: acquisitionValue === '' ? undefined : Number(acquisitionValue),
      warrantyEndDate: warrantyEndDate || undefined,
      initialTreadDepth: initialTreadDepth === '' ? undefined : Number(initialTreadDepth),
      currentTreadDepth: currentTreadDepth === '' ? undefined : Number(currentTreadDepth),
      minimumTreadDepth: minimumTreadDepth === '' ? undefined : Number(minimumTreadDepth),
      recommendedMinimumPressure: recommendedMinimumPressure === '' ? undefined : Number(recommendedMinimumPressure),
      recommendedMaximumPressure: recommendedMaximumPressure === '' ? undefined : Number(recommendedMaximumPressure),
      pressureUnit,
      hasTube,
      usesWaterBallast,
      maximumRetreads: maximumRetreads === '' ? undefined : Number(maximumRetreads),
      notes: notes || undefined,
      currentEquipmentId: queryEquipmentId || undefined,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-14 animate-fade-in">
      <PageHeader
        title={isEditing ? `Editar Pneu ${internalCode}` : 'Cadastrar Novo Pneu'}
        subtitle="Registro de dados de identificação, aquisição, especificações e limites de calibração"
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.PNEUS)}>
            <ArrowLeft size={16} className="mr-1" /> Voltar
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Identificação */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2 border-b border-white/5 pb-2">
            <Disc className="text-primary" size={18} /> 1. Identificação do Pneu
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Código Interno (ID do pneu) *</label>
              <input
                type="text"
                value={internalCode}
                onChange={e => setInternalCode(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold text-sm"
                required
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Marca *</label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
                required
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Modelo</label>
              <input
                type="text"
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Medida *</label>
              <input
                type="text"
                placeholder="Ex: 18.4-30, 295/80 R22.5"
                value={size}
                onChange={e => setSize(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Tipo de Construção</label>
              <select
                value={constructionType}
                onChange={e => setConstructionType(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              >
                <option value="diagonal">Diagonal</option>
                <option value="radial">Radial</option>
              </select>
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Aplicação Recomendada</label>
              <input
                type="text"
                placeholder="Ex: Trator Traseiro, Direcional"
                value={application}
                onChange={e => setApplication(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Nº de Série</label>
              <input
                type="text"
                value={serialNumber}
                onChange={e => setSerialNumber(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Código DOT</label>
              <input
                type="text"
                value={dotCode}
                onChange={e => setDotCode(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Data de Fabricação</label>
              <input
                type="date"
                value={manufacturingDate}
                onChange={e => setManufacturingDate(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
          </div>
        </div>

        {/* 2. Especificações Técnicas e Pressão */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
          <h3 className="font-bold text-on-surface text-sm border-b border-white/5 pb-2">
            2. Profundidade do Sulco e Diretrizes de Pressão
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Sulco Inicial (mm) *</label>
              <input
                type="number"
                step="0.1"
                value={initialTreadDepth}
                onChange={e => setInitialTreadDepth(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
                required
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Sulco Atual (mm) *</label>
              <input
                type="number"
                step="0.1"
                value={currentTreadDepth}
                onChange={e => setCurrentTreadDepth(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
                required
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Sulco Mínimo Permitido (mm) *</label>
              <input
                type="number"
                step="0.1"
                value={minimumTreadDepth}
                onChange={e => setMinimumTreadDepth(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Pressão Mínima Recomendada</label>
              <input
                type="number"
                value={recommendedMinimumPressure}
                onChange={e => setRecommendedMinimumPressure(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Pressão Máxima Recomendada</label>
              <input
                type="number"
                value={recommendedMaximumPressure}
                onChange={e => setRecommendedMaximumPressure(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Unidade de Pressão *</label>
              <select
                value={pressureUnit}
                onChange={e => setPressureUnit(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              >
                <option value="psi">PSI</option>
                <option value="bar">BAR</option>
                <option value="kpa">KPA</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasTube"
                checked={hasTube}
                onChange={e => setHasTube(e.target.checked)}
                className="rounded bg-surface-container border-white/10 text-primary"
              />
              <label htmlFor="hasTube" className="text-on-surface font-medium cursor-pointer">Possui Câmara de Ar</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="usesWaterBallast"
                checked={usesWaterBallast}
                onChange={e => setUsesWaterBallast(e.target.checked)}
                className="rounded bg-surface-container border-white/10 text-primary"
              />
              <label htmlFor="usesWaterBallast" className="text-on-surface font-medium cursor-pointer">Utiliza Lastro de Água</label>
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Máx. de Recapagens</label>
              <input
                type="number"
                value={maximumRetreads}
                onChange={e => setMaximumRetreads(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
          </div>
        </div>

        {/* 3. Dados de Aquisição */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
          <h3 className="font-bold text-on-surface text-sm border-b border-white/5 pb-2">3. Dados de Aquisição e Observações</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Data de Aquisição</label>
              <input
                type="date"
                value={acquisitionDate}
                onChange={e => setAcquisitionDate(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Valor de Compra (R$)</label>
              <input
                type="number"
                step="0.01"
                value={acquisitionValue}
                onChange={e => setAcquisitionValue(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Fim da Garantia</label>
              <input
                type="date"
                value={warrantyEndDate}
                onChange={e => setWarrantyEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono-label text-on-surface-variant mb-1">Observações Gerais</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              placeholder="Informações adicionais sobre o pneu..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.PNEUS)}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading} className="flex items-center gap-2">
            <Save size={16} /> {isEditing ? 'Salvar Alterações' : 'Cadastrar Pneu'}
          </Button>
        </div>
      </form>
    </div>
  );
};
