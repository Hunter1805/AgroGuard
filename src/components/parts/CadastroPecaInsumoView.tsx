import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Package, AlertCircle } from 'lucide-react';
import { useStockItemForm } from '../../hooks/useStockItemForm';
import { partsService } from '../../services/parts.service';
import { Button } from '../ui/Button';
import { PageHeader } from '../ui/PageHeader';
import { ROUTES } from '../../types/routes';
import type { StockItemType } from '../../types/parts';

export const CadastroPecaInsumoView: React.FC = () => {
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();
  const isEditing = Boolean(itemId);

  const [internalCode, setInternalCode] = useState('');
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<StockItemType>('peca');
  const [categoryName, setCategoryName] = useState('Filtros de Motor');
  const [brand, setBrand] = useState('Mann Filter');
  const [manufacturerCode, setManufacturerCode] = useState('');

  const [controlUnit, setControlUnit] = useState('Unidade');
  const [allowsFractionalQuantity, setAllowsFractionalQuantity] = useState(false);

  const [currentQuantity, setCurrentQuantity] = useState<number>(10);
  const [minimumQuantity, setMinimumQuantity] = useState<number>(5);
  const [maximumQuantity, setMaximumQuantity] = useState<number>(50);
  const [reorderPoint, setReorderPoint] = useState<number>(8);

  const [averageCost, setAverageCost] = useState<number | ''>(65.50);

  const [warehouseName, setWarehouseName] = useState('Almoxarifado Central');
  const [shelf, setShelf] = useState('Prateleira B');
  const [bin, setBin] = useState('Gaveta B3');

  const [controlsLot, setControlsLot] = useState(false);
  const [controlsExpiration, setControlsExpiration] = useState(false);
  const [requiresWorkOrderLink, setRequiresWorkOrderLink] = useState(true);

  const [initialItem, setInitialItem] = useState<any>(undefined);
  const { loading, error, setError, saveItem } = useStockItemForm(initialItem, () => navigate(ROUTES.PECAS_INSUMOS));

  useEffect(() => {
    if (isEditing && itemId) {
      partsService.getStockItemById(itemId).then(i => {
        if (i) {
          setInitialItem(i);
          setInternalCode(i.internalCode);
          setBarcode(i.barcode || '');
          setName(i.name);
          setDescription(i.description || '');
          setType(i.type);
          setCategoryName(i.categoryName || 'Geral');
          setBrand(i.brand || '');
          setManufacturerCode(i.manufacturerCode || '');
          setControlUnit(i.controlUnit);
          setAllowsFractionalQuantity(Boolean(i.allowsFractionalQuantity));
          setCurrentQuantity(i.currentQuantity);
          setMinimumQuantity(i.minimumQuantity);
          setMaximumQuantity(i.maximumQuantity || 100);
          setReorderPoint(i.reorderPoint || i.minimumQuantity);
          setAverageCost(i.averageCost);
          setWarehouseName(i.location?.warehouseName || 'Almoxarifado Central');
          setShelf(i.location?.shelf || '');
          setBin(i.location?.bin || '');
          setControlsLot(Boolean(i.controlsLot));
          setControlsExpiration(Boolean(i.controlsExpiration));
          setRequiresWorkOrderLink(Boolean(i.requiresWorkOrderLink));
        }
      });
    } else {
      setInternalCode(`FLT-${Math.floor(1000 + Math.random() * 9000)}`);
      setBarcode(`789${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    }
  }, [isEditing, itemId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalCode || !name || !type) {
      setError('Código interno, Nome e Tipo de insumo são obrigatórios.');
      return;
    }

    await saveItem({
      internalCode,
      barcode: barcode || undefined,
      name,
      description: description || undefined,
      type,
      categoryName,
      brand: brand || undefined,
      manufacturerCode: manufacturerCode || undefined,
      controlUnit,
      allowsFractionalQuantity,
      currentQuantity: Number(currentQuantity),
      reservedQuantity: initialItem?.reservedQuantity || 0,
      minimumQuantity: Number(minimumQuantity),
      maximumQuantity: Number(maximumQuantity),
      reorderPoint: Number(reorderPoint),
      averageCost: averageCost === '' ? 0 : Number(averageCost),
      location: {
        warehouseName,
        shelf,
        bin,
        detailedLocation: `${warehouseName} — ${shelf} (${bin})`,
      },
      controlsLot,
      controlsExpiration,
      requiresWorkOrderLink,
      status: currentQuantity <= 0 ? 'sem_estoque' : currentQuantity <= minimumQuantity ? 'estoque_baixo' : 'ativo',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-14 animate-fade-in text-xs">
      <PageHeader
        title={isEditing ? `Editar Item ${internalCode}` : 'Cadastrar Peça / Insumo'}
        subtitle="Registro de dados cadastrais, almoxarifado, custos e controle de lotes"
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.PECAS_INSUMOS)}>
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

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2 border-b border-white/5 pb-2">
            <Package className="text-primary" size={18} /> 1. Identificação do Item
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Código Interno *</label>
              <input
                type="text"
                value={internalCode}
                onChange={e => setInternalCode(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Nome do Item / Peça *</label>
              <input
                type="text"
                placeholder="Ex: Filtro de Óleo Lubrificante"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Código de Barras (EAN)</label>
              <input
                type="text"
                value={barcode}
                onChange={e => setBarcode(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Tipo de Insumo *</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-bold"
              >
                <option value="peca">Peça de Reposição</option>
                <option value="filtro">Filtro</option>
                <option value="oleo">Óleo Lubrificante</option>
                <option value="graxa">Graxa</option>
                <option value="fluido">Fluido</option>
                <option value="combustivel_auxiliar">Combustível Auxiliar</option>
                <option value="material_consumo">Material de Consumo</option>
                <option value="componente_eletrico">Componente Elétrico</option>
                <option value="componente_hidraulico">Componente Hidráulico</option>
                <option value="item_seguranca">EPI / Segurança</option>
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
              <label className="block font-mono-label text-on-surface-variant mb-1">Código Fabricante</label>
              <input
                type="text"
                value={manufacturerCode}
                onChange={e => setManufacturerCode(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Unidade de Controle *</label>
              <select
                value={controlUnit}
                onChange={e => setControlUnit(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-bold"
              >
                <option value="Unidade">Unidade</option>
                <option value="Litro">Litro</option>
                <option value="Balde">Balde</option>
                <option value="Tambor">Tambor</option>
                <option value="Quilograma">Quilograma</option>
                <option value="Caixa">Caixa</option>
                <option value="Kit">Kit</option>
                <option value="Jogo">Jogo</option>
              </select>
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-on-surface font-semibold">
                <input
                  type="checkbox"
                  checked={allowsFractionalQuantity}
                  onChange={e => setAllowsFractionalQuantity(e.target.checked)}
                  className="rounded bg-surface-container border-white/10 text-primary"
                />
                Permite Quantidade Fracionada (Decimais)
              </label>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
          <h3 className="font-bold text-on-surface text-sm border-b border-white/5 pb-2">2. Quantidades, Custos & Localização</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Qtd Inicial *</label>
              <input
                type="number"
                step={allowsFractionalQuantity ? '0.01' : '1'}
                min="0"
                value={currentQuantity}
                onChange={e => setCurrentQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Estoque Mínimo *</label>
              <input
                type="number"
                step={allowsFractionalQuantity ? '0.01' : '1'}
                min="0"
                value={minimumQuantity}
                onChange={e => setMinimumQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Estoque Máximo</label>
              <input
                type="number"
                step={allowsFractionalQuantity ? '0.01' : '1'}
                min="0"
                value={maximumQuantity}
                onChange={e => setMaximumQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Custo Médio Inicial (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={averageCost}
                onChange={e => setAverageCost(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Almoxarifado</label>
              <input
                type="text"
                value={warehouseName}
                onChange={e => setWarehouseName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Prateleira</label>
              <input
                type="text"
                value={shelf}
                onChange={e => setShelf(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Gaveta / Posição</label>
              <input
                type="text"
                value={bin}
                onChange={e => setBin(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-on-surface font-semibold">
              <input
                type="checkbox"
                checked={controlsLot}
                onChange={e => setControlsLot(e.target.checked)}
                className="rounded bg-surface-container border-white/10 text-primary"
              />
              Exige Controle de Lote na Entrada
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-on-surface font-semibold">
              <input
                type="checkbox"
                checked={controlsExpiration}
                onChange={e => setControlsExpiration(e.target.checked)}
                className="rounded bg-surface-container border-white/10 text-primary"
              />
              Exige Controle de Data de Validade
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.PECAS_INSUMOS)}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading} className="flex items-center gap-2">
            <Save size={16} /> {isEditing ? 'Salvar Alterações' : 'Cadastrar Item'}
          </Button>
        </div>
      </form>
    </div>
  );
};
