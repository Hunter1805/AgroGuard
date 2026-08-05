import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Wrench, AlertCircle } from 'lucide-react';
import { useToolForm } from '../../hooks/useToolForm';
import { toolsService } from '../../services/tools.service';
import { Button } from '../ui/Button';
import { PageHeader } from '../ui/PageHeader';
import { ROUTES } from '../../types/routes';
import type { ToolControlType, ToolCondition } from '../../types/tools';

export const CadastroFerramentaView: React.FC = () => {
  const navigate = useNavigate();
  const { toolId } = useParams<{ toolId: string }>();
  const isEditing = Boolean(toolId);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Chaves');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [technicalSpec, setTechnicalSpec] = useState('');
  const [controlType, setControlType] = useState<ToolControlType>('individual');
  const [brand, setBrand] = useState('Gedore Red');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [patrimonyNumber, setPatrimonyNumber] = useState('');

  const [totalQuantity, setTotalQuantity] = useState<number>(1);
  const [minimumQuantity, setMinimumQuantity] = useState<number>(1);
  const [unitOfMeasure, setUnitOfMeasure] = useState('UN');

  const [workshop, setWorkshop] = useState('Oficina Central');
  const [cabinet, setCabinet] = useState('Armário A1');

  const [acquisitionDate, setAcquisitionDate] = useState(new Date().toISOString().split('T')[0]);
  const [acquisitionValue, setAcquisitionValue] = useState<number | ''>(450);
  const [supplierName, setSupplierName] = useState('Ferramentas Kennedy');
  const [invoiceNumber, setInvoiceNumber] = useState('NF-2026-99');

  const [condition, setCondition] = useState<ToolCondition>('boa');
  const [requiresCalibration, setRequiresCalibration] = useState(false);
  const [calibrationType, setCalibrationType] = useState('Aferição de Precisão Standard');
  const [calibrationFrequencyValue, setCalibrationFrequencyValue] = useState<number>(6);

  const [initialTool, setInitialTool] = useState<any>(undefined);
  const { loading, error, setError, saveTool } = useToolForm(initialTool, () => navigate(ROUTES.FERRAMENTAS));

  useEffect(() => {
    if (isEditing && toolId) {
      toolsService.getToolById(toolId).then(t => {
        if (t) {
          setInitialTool(t);
          setCode(t.code);
          setName(t.name);
          setCategory(t.category);
          setSubcategory(t.subcategory || '');
          setDescription(t.description || '');
          setTechnicalSpec(t.technicalSpec || '');
          setControlType(t.controlType);
          setBrand(t.brand || '');
          setModel(t.model || '');
          setSerialNumber(t.serialNumber || '');
          setPatrimonyNumber(t.patrimonyNumber || '');
          setTotalQuantity(t.totalQuantity);
          setMinimumQuantity(t.minimumQuantity || 1);
          setUnitOfMeasure(t.unitOfMeasure || 'UN');
          setWorkshop(t.location?.workshop || 'Oficina Central');
          setCabinet(t.location?.cabinet || '');
          setAcquisitionDate(t.acquisitionDate || '');
          setAcquisitionValue(t.acquisitionValue ?? '');
          setSupplierName(t.supplierName || '');
          setInvoiceNumber(t.invoiceNumber || '');
          setCondition(t.condition);
          setRequiresCalibration(Boolean(t.requiresCalibration));
          setCalibrationType(t.calibrationType || '');
          setCalibrationFrequencyValue(t.calibrationFrequencyValue || 6);
        }
      });
    } else {
      setCode(`FER-${Math.floor(100 + Math.random() * 900)}`);
      setPatrimonyNumber(`PAT-${Math.floor(4000 + Math.random() * 900)}`);
    }
  }, [isEditing, toolId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !category) {
      setError('Código interno, Nome e Categoria da ferramenta são obrigatórios.');
      return;
    }

    await saveTool({
      code,
      name,
      category,
      subcategory: subcategory || undefined,
      description: description || undefined,
      technicalSpec: technicalSpec || undefined,
      controlType,
      brand: brand || undefined,
      model: model || undefined,
      serialNumber: serialNumber || undefined,
      patrimonyNumber: patrimonyNumber || undefined,
      totalQuantity: controlType === 'individual' ? 1 : totalQuantity,
      availableQuantity: controlType === 'individual' ? 1 : totalQuantity,
      minimumQuantity,
      unitOfMeasure,
      location: {
        company: 'AgroGuard',
        workshop,
        cabinet,
        detailedLocation: `${workshop} — ${cabinet}`,
      },
      acquisitionDate: acquisitionDate || undefined,
      acquisitionValue: acquisitionValue === '' ? undefined : Number(acquisitionValue),
      supplierName: supplierName || undefined,
      invoiceNumber: invoiceNumber || undefined,
      condition,
      requiresCalibration,
      calibrationType: requiresCalibration ? calibrationType : undefined,
      calibrationFrequencyValue: requiresCalibration ? calibrationFrequencyValue : undefined,
      calibrationFrequencyUnit: 'meses',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-14 animate-fade-in text-xs">
      <PageHeader
        title={isEditing ? `Editar Ferramenta ${code}` : 'Cadastrar Nova Ferramenta'}
        subtitle="Registro de dados cadastrais, patrimônio, calibrações e localização da oficina"
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.FERRAMENTAS)}>
            <ArrowLeft size={16} className="mr-1" /> Voltar
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Identificação */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2 border-b border-white/5 pb-2">
            <Wrench className="text-primary" size={18} /> 1. Identificação da Ferramenta
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Código Interno *</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Nome da Ferramenta *</label>
              <input
                type="text"
                placeholder="Ex: Torquímetro de Estalo 1/2"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Tipo de Controle *</label>
              <select
                value={controlType}
                onChange={e => setControlType(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-bold"
              >
                <option value="individual">Individual (Patrimônio / Série)</option>
                <option value="quantidade">Por Quantidade (Estoque)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Categoria *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-semibold"
                required
              >
                <option value="Chaves">Chaves</option>
                <option value="Medição">Medição</option>
                <option value="Elétrica">Elétrica</option>
                <option value="Pneumática">Pneumática</option>
                <option value="Solda">Solda</option>
                <option value="Segurança">Segurança (EPI)</option>
                <option value="Geral">Geral</option>
              </select>
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Marca</label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
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

          {controlType === 'individual' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono-label text-on-surface-variant mb-1">Nº de Patrimônio</label>
                <input
                  type="text"
                  placeholder="Ex: PAT-4401"
                  value={patrimonyNumber}
                  onChange={e => setPatrimonyNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold"
                />
              </div>
              <div>
                <label className="block font-mono-label text-on-surface-variant mb-1">Nº de Série</label>
                <input
                  type="text"
                  placeholder="Ex: SN-998822"
                  value={serialNumber}
                  onChange={e => setSerialNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-mono-label text-on-surface-variant mb-1">Quantidade Total *</label>
                <input
                  type="number"
                  min={1}
                  value={totalQuantity}
                  onChange={e => setTotalQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold"
                  required
                />
              </div>
              <div>
                <label className="block font-mono-label text-on-surface-variant mb-1">Estoque Mínimo</label>
                <input
                  type="number"
                  min={1}
                  value={minimumQuantity}
                  onChange={e => setMinimumQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
                />
              </div>
              <div>
                <label className="block font-mono-label text-on-surface-variant mb-1">Unidade de Medida</label>
                <input
                  type="text"
                  value={unitOfMeasure}
                  onChange={e => setUnitOfMeasure(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-mono-label text-on-surface-variant mb-1">Especificação Técnica / Descrição</label>
            <textarea
              rows={2}
              value={technicalSpec}
              onChange={e => setTechnicalSpec(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              placeholder="Descreva encaixes, capacidade, faixa de medição, etc..."
            />
          </div>
        </div>

        {/* Localização & Aquisição */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
          <h3 className="font-bold text-on-surface text-sm border-b border-white/5 pb-2">2. Localização & Dados de Aquisição</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Oficina / Almoxarifado</label>
              <input
                type="text"
                value={workshop}
                onChange={e => setWorkshop(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Armário / Gaveta</label>
              <input
                type="text"
                value={cabinet}
                onChange={e => setCabinet(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Valor de Aquisição (R$)</label>
              <input
                type="number"
                step="0.01"
                value={acquisitionValue}
                onChange={e => setAcquisitionValue(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Fornecedor</label>
              <input
                type="text"
                value={supplierName}
                onChange={e => setSupplierName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Nº Nota Fiscal</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={e => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="reqCal"
              checked={requiresCalibration}
              onChange={e => setRequiresCalibration(e.target.checked)}
              className="rounded bg-surface-container border-white/10 text-primary"
            />
            <label htmlFor="reqCal" className="text-on-surface font-semibold cursor-pointer">
              Esta ferramenta necessita de Calibração / Aferição Periódica
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.FERRAMENTAS)}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading} className="flex items-center gap-2">
            <Save size={16} /> {isEditing ? 'Salvar Alterações' : 'Cadastrar Ferramenta'}
          </Button>
        </div>
      </form>
    </div>
  );
};
