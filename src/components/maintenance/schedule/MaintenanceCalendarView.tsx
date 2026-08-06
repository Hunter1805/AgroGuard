import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, Wrench, CheckCircle2, 
  ChevronLeft, ChevronRight, Filter, Search, User, 
  MapPin, X, ExternalLink, CalendarDays, List, RotateCcw
} from 'lucide-react';
import { useMaintenanceSchedule } from '../../../hooks/useMaintenanceSchedule';
import { Button } from '../../ui/Button';
import { PageHeader } from '../../ui/PageHeader';
import { useNavigate } from 'react-router-dom';
import type { MaintenanceSchedule } from '../../../types/maintenance-schedule';

export const MaintenanceCalendarView: React.FC = () => {
  const navigate = useNavigate();
  const {
    schedules,
    filters,
    actionMessage,
    clearMessage,
    updateFilters,
    resetFilters,
    handleReschedule,
    handleCancelSchedule,
    handleCreatePreventiveOS,
    refresh,
  } = useMaintenanceSchedule();

  const [viewMode, setViewMode] = useState<'semana' | 'mes' | 'lista'>('semana');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date('2026-08-05'));
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MaintenanceSchedule | null>(null);
  
  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  
  // Reschedule / Cancel Form States
  const [newDateStr, setNewDateStr] = useState('');
  const [newTimeStr, setNewTimeStr] = useState('08:00');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  // Sincronizar data do form quando muda o evento selecionado
  useEffect(() => {
    if (selectedEvent) {
      setNewDateStr(selectedEvent.scheduledDate);
      setNewTimeStr(selectedEvent.scheduledTime || '08:00');
      setRescheduleReason('');
      setCancelReason('');
    }
  }, [selectedEvent]);

  // Calcular dias da semana selecionada (Dom - Sáb)
  const weekDays = useMemo(() => {
    const start = new Date(selectedDate);
    const day = start.getDay();
    const diff = start.getDate() - day; // ajustar para o domingo anterior
    const sunday = new Date(start.getFullYear(), start.getMonth(), diff);
    
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  const weekRangeStr = useMemo(() => {
    const start = weekDays[0];
    const end = weekDays[6];
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return `${start.toLocaleDateString('pt-BR', { day: '2-digit' })} a ${end.toLocaleDateString('pt-BR', options)}`;
  }, [weekDays]);

  const handlePrevWeek = () => {
    setSelectedDate(prev => {
      const d = new Date(prev);
      d.setDate(prev.getDate() - 7);
      return d;
    });
  };

  const handleNextWeek = () => {
    setSelectedDate(prev => {
      const d = new Date(prev);
      d.setDate(prev.getDate() + 7);
      return d;
    });
  };

  const handleToday = () => {
    setSelectedDate(new Date('2026-08-05'));
  };

  // Grade horária de 06:00 a 20:00
  const hours = Array.from({ length: 15 }).map((_, i) => {
    const h = i + 6;
    return `${h.toString().padStart(2, '0')}:00`;
  });

  // Filtra schedules do dia no grid
  const getSchedulesForDay = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    const key = `${yyyy}-${mm}-${dd}`;
    return schedules.filter(s => s.scheduledDate === key && s.status !== 'cancelada');
  };

  // Formata hora de exibição
  const getEventTimeStr = (sch: MaintenanceSchedule) => {
    const start = sch.scheduledTime || '08:00';
    const [h, m] = start.split(':').map(Number);
    const duration = sch.estimatedDurationMinutes || 60;
    const endMinutes = h * 60 + m + duration;
    const endH = Math.floor(endMinutes / 60) % 24;
    const endM = endMinutes % 60;
    return `${start}–${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
  };

  // Cores semânticas por prioridade / status
  const getEventStyles = (sch: MaintenanceSchedule) => {
    if (sch.status === 'concluida' || sch.status === 'cancelada') {
      return 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400';
    }
    if (sch.priority === 'critica') {
      return 'bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-400';
    }
    if (sch.status === 'em_execucao') {
      return 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400';
    }
    if (sch.status === 'planejada') {
      return 'bg-blue-50 border-blue-300 text-blue-800 dark:bg-blue-950/20 dark:border-blue-900/50 dark:text-blue-400';
    }
    return 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-400';
  };

  // Posicionamento absoluto no grid semanal
  const getEventPositionStyles = (sch: MaintenanceSchedule) => {
    const start = sch.scheduledTime || '08:00';
    const [h, m] = start.split(':').map(Number);
    const minutesFrom06 = (h - 6) * 60 + m;
    const duration = sch.estimatedDurationMinutes || 120;
    
    // Altura proporcional: 60px por hora = 1px por minuto. Total 14 horas = 900px
    const top = Math.max(0, minutesFrom06);
    const height = Math.max(35, duration);
    
    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  // Carteira de Manutenções (Backlog)
  const backlogGroups = useMemo(() => {
    const vencidas = schedules.filter(s => s.status === 'programada' && s.scheduledDate < '2026-08-05');
    const semData = schedules.filter(s => !s.scheduledDate || s.scheduledDate === '');
    const semResp = schedules.filter(s => !s.responsibleName || s.responsibleName === 'Não atribuído' || s.responsibleName === '');
    const aguardandoRecurso = schedules.filter(s => s.status === 'aguardando_pecas');
    const naoProgramadas = schedules.filter(s => s.status === 'planejada');

    return { vencidas, semData, semResp, aguardandoRecurso, naoProgramadas };
  }, [schedules]);

  // Ações do Drawer
  const handleOpenEvent = (event: MaintenanceSchedule) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
    setIsRescheduling(false);
    setIsCanceling(false);
  };

  const executeReschedule = async () => {
    if (!selectedEvent) return;
    const success = await handleReschedule(selectedEvent.id, newDateStr, rescheduleReason, newTimeStr);
    if (success) {
      setDrawerOpen(false);
      refresh();
    }
  };

  const executeCancel = async () => {
    if (!selectedEvent) return;
    const success = await handleCancelSchedule(selectedEvent.id, cancelReason);
    if (success) {
      setDrawerOpen(false);
      refresh();
    }
  };


  const executeCreateOS = async () => {
    if (!selectedEvent) return;
    const osId = await handleCreatePreventiveOS(selectedEvent.id);
    if (osId) {
      setDrawerOpen(false);
      refresh();
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-14 animate-fade-in text-[var(--color-text-primary)]">
      {/* Cabeçalho da Página */}
      <PageHeader
        title="Agenda de Manutenções"
        subtitle="Visualização e controle inteligente de alocações da oficina e paradas da frota"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 shadow-sm">
              <button 
                onClick={() => setViewMode('semana')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'semana' ? 'bg-[var(--color-brand-light)] text-[var(--color-brand)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" /> Semana
              </button>
              <button 
                onClick={() => setViewMode('mes')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'mes' ? 'bg-[var(--color-brand-light)] text-[var(--color-brand)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" /> Mês
              </button>
              <button 
                onClick={() => setViewMode('lista')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'lista' ? 'bg-[var(--color-brand-light)] text-[var(--color-brand)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <List className="w-3.5 h-3.5" /> Lista
              </button>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleToday}
              className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold"
            >
              Hoje
            </Button>
            <div className="flex items-center border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] shadow-sm">
              <button onClick={handlePrevWeek} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border-r border-[var(--color-border)] cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={handleNextWeek} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
      />

      {/* Título de Período */}
      <div className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] px-5 py-3 rounded-xl shadow-sm">
        <h2 className="text-base font-bold text-[var(--color-text-primary)]">
          {viewMode === 'semana' ? weekRangeStr : 'Calendário Mensal Completo'}
        </h2>
        <span className="text-xs text-[var(--color-text-secondary)] font-semibold">
          {schedules.length} reservas registradas
        </span>
      </div>

      {/* Mensagem de ação do Hook */}
      {actionMessage && (
        <div className="bg-[var(--color-success-light)] border border-[var(--color-success)]/30 p-4 rounded-xl flex items-center justify-between text-xs font-bold text-[var(--color-success)] shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={clearMessage} className="text-[var(--color-success)] hover:underline uppercase">Fechar</button>
        </div>
      )}

      {/* Barra de Filtros Sintética */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Busca por equipamento, responsável ou código..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full pl-9 pr-4 py-2 text-xs bg-[var(--color-surface-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] text-[var(--color-text-primary)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-[var(--color-surface-secondary)] px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs">
              <span className="text-[var(--color-text-secondary)] font-bold">Status:</span>
              <select
                value={filters.status}
                onChange={(e) => updateFilters({ status: e.target.value })}
                className="bg-transparent text-[var(--color-text-primary)] font-bold focus:outline-none cursor-pointer"
              >
                <option value="todos">Todos</option>
                <option value="planejada">Planejada</option>
                <option value="programada">Programada</option>
                <option value="em_execucao">Em Execução</option>
                <option value="atrasada">Atrasada</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-[var(--color-surface-secondary)] px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs">
              <User className="w-3.5 h-3.5 text-[var(--color-brand)]" />
              <span className="text-[var(--color-text-secondary)] font-bold">Responsável:</span>
              <select
                value={filters.responsible}
                onChange={(e) => updateFilters({ responsible: e.target.value })}
                className="bg-transparent text-[var(--color-text-primary)] font-bold focus:outline-none cursor-pointer"
              >
                <option value="todos">Todos</option>
                <option value="carlos">Carlos Roberto</option>
                <option value="roberto">Roberto Campos</option>
                <option value="jd">Técnico Concessionária</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-[var(--color-surface-secondary)] px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs">
              <MapPin className="w-3.5 h-3.5 text-[var(--color-brand)]" />
              <span className="text-[var(--color-text-secondary)] font-bold">Oficina:</span>
              <select
                value={filters.workshop}
                onChange={(e) => updateFilters({ workshop: e.target.value })}
                className="bg-transparent text-[var(--color-text-primary)] font-bold focus:outline-none cursor-pointer"
              >
                <option value="todos">Todas</option>
                <option value="central">Oficina Sede</option>
                <option value="caminhao">Caminhão Comboio</option>
                <option value="externa">Concessionária</option>
              </select>
            </div>

            <button 
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)] text-xs font-semibold cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[var(--color-brand)]" /> Mais Filtros
            </button>

            <button onClick={resetFilters} className="p-2 rounded-xl hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] cursor-pointer">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showMoreFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[var(--color-border)] animate-fadeIn">
            <div className="flex flex-col gap-1 text-xs">
              <span className="text-[var(--color-text-secondary)] font-bold">Prioridade:</span>
              <select
                value={filters.priority}
                onChange={(e) => updateFilters({ priority: e.target.value })}
                className="p-2 bg-[var(--color-surface-secondary)] border border-[var(--color-border)] rounded-xl"
              >
                <option value="todos">Todas</option>
                <option value="critica">Crítica</option>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <span className="text-[var(--color-text-secondary)] font-bold">Período de Vencimento:</span>
              <select
                value={filters.period}
                onChange={(e) => updateFilters({ period: e.target.value as any })}
                className="p-2 bg-[var(--color-surface-secondary)] border border-[var(--color-border)] rounded-xl"
              >
                <option value="todos">Todos</option>
                <option value="semana">Esta Semana</option>
                <option value="mes">Este Mês</option>
                <option value="atrasadas">Atrasadas</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Split Layout: Calendar (75%) vs Backlog (25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Lado Esquerdo: Agenda de Oficina */}
        <div className="lg:col-span-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm p-4 overflow-hidden flex flex-col min-h-[600px]">
          {viewMode === 'lista' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] font-bold uppercase bg-[var(--color-surface-secondary)]">
                    <th className="p-3">Equipamento</th>
                    <th className="p-3">Manutenção / Plano</th>
                    <th className="p-3">Data</th>
                    <th className="p-3">Prioridade</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)] text-xs">
                  {schedules.map(sch => (
                    <tr key={sch.id} className="hover:bg-[var(--color-surface-secondary)] transition-colors">
                      <td className="p-3 font-bold">{sch.equipmentName}</td>
                      <td className="p-3">{sch.intervalName || sch.planName}</td>
                      <td className="p-3 font-semibold text-[var(--color-brand)]">{sch.scheduledDate} {sch.scheduledTime || '08:00'}</td>
                      <td className="p-3 uppercase font-extrabold">{sch.priority}</td>
                      <td className="p-3 uppercase font-bold">{sch.status}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleOpenEvent(sch)} className="text-[var(--color-brand)] hover:underline font-bold">Detalhes</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : viewMode === 'mes' ? (
            <div className="p-8 text-center text-[var(--color-text-secondary)]">
              <CalendarIcon className="w-12 h-12 mx-auto text-[var(--color-text-muted)] mb-3" />
              <h3 className="font-bold text-sm">Visualização Mensal indisponível nesta safra</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Utilize a visualização Semanal padrão para programações diárias e alocação na oficina.</p>
            </div>
          ) : (
            // Visualização Semanal de 7 Colunas e Grade de Horas
            <div className="flex-1 flex flex-col overflow-y-auto max-h-[850px] pr-2">
              <div className="grid grid-cols-8 border-b border-[var(--color-border)] pb-2 bg-[var(--color-surface)] sticky top-0 z-10">
                <div className="text-center font-bold text-xs text-[var(--color-text-muted)]">Hora</div>
                {weekDays.map((day, idx) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  return (
                    <div key={idx} className={`text-center py-1.5 rounded-lg ${isToday ? 'bg-[var(--color-brand-light)] border border-[var(--color-brand)]/20' : ''}`}>
                      <span className="block text-[10px] text-[var(--color-text-secondary)] font-bold uppercase">
                        {day.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3)}
                      </span>
                      <span className={`block text-xs font-bold ${isToday ? 'text-[var(--color-brand)] font-extrabold' : ''}`}>
                        {day.getDate().toString().padStart(2, '0')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Linhas da grade */}
              <div className="relative grid grid-cols-8" style={{ height: '900px' }}>
                {/* Coluna de Horas */}
                <div className="border-r border-[var(--color-border)] relative" style={{ height: '900px' }}>
                  {hours.map((hour, idx) => (
                    <div 
                      key={hour} 
                      className="text-[10px] font-bold text-[var(--color-text-muted)] text-right pr-2" 
                      style={{ position: 'absolute', top: `${idx * 60}px` }}
                    >
                      {hour}
                    </div>
                  ))}
                </div>

                {/* Colunas dos Dias da Semana */}
                {weekDays.map((day, dayIdx) => {
                  const dayEvents = getSchedulesForDay(day);
                  return (
                    <div key={dayIdx} className="relative border-r border-[var(--color-border)] last:border-r-0" style={{ height: '900px' }}>
                      {/* Linhas Horizontais de Fundo */}
                      {hours.map((_, idx) => (
                        <div 
                          key={idx} 
                          className="absolute w-full border-b border-[var(--color-border)]/40 pointer-events-none"
                          style={{ top: `${idx * 60}px`, height: '60px' }}
                        />
                      ))}

                      {/* Eventos do Dia */}
                      {dayEvents.map(sch => {
                        const eventStyles = getEventStyles(sch);
                        const posStyles = getEventPositionStyles(sch);
                        return (
                          <div
                            key={sch.id}
                            onClick={() => handleOpenEvent(sch)}
                            style={posStyles}
                            className={`absolute left-1 right-1 p-2 rounded-xl border border-l-4 shadow-sm cursor-pointer hover:shadow-md transition-all z-2 flex flex-col justify-between overflow-hidden ${eventStyles}`}
                          >
                            <div>
                              <p className="font-extrabold text-[10px] truncate">{sch.preventiveOrderId || sch.code}</p>
                              <p className="font-bold text-[11px] truncate leading-tight mt-0.5">{sch.equipmentCode || sch.equipmentName}</p>
                              <p className="text-[9px] truncate opacity-85 mt-0.5">{sch.intervalName || sch.planName}</p>
                            </div>
                            <span className="text-[9px] font-bold mt-1 block">
                              {getEventTimeStr(sch)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Lado Direito: Carteira de Manutenções (Backlog) */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm p-4 flex flex-col w-full xl:w-[320px] shrink-0 min-h-[600px] text-xs">
          <div className="border-b border-[var(--color-border)] pb-3 mb-4 flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-[var(--color-brand)]" /> Carteira de Manutenções
            </h3>
            <span className="text-[10px] bg-[var(--color-brand-light)] text-[var(--color-brand)] font-bold px-2 py-0.5 rounded-full">
              Backlog
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[750px]">
            {/* Vencidas */}
            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="font-bold text-[11px] text-[var(--color-danger)] uppercase">Vencidas</span>
                <span className="text-[10px] bg-rose-50 dark:bg-rose-950/40 text-[var(--color-danger)] font-bold px-1.5 py-0.2 rounded-md">
                  {backlogGroups.vencidas.length}
                </span>
              </div>
              <div className="space-y-2">
                {backlogGroups.vencidas.map(sch => (
                  <div key={sch.id} onClick={() => handleOpenEvent(sch)} className="p-2.5 bg-[var(--color-surface-secondary)] border-l-4 border-[var(--color-danger)] rounded-lg hover:shadow-sm cursor-pointer transition-all border border-[var(--color-border)]">
                    <div className="flex justify-between font-bold">
                      <span>{sch.equipmentCode || sch.equipmentName}</span>
                      <span className="text-[var(--color-danger)]">{sch.code}</span>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 truncate">{sch.intervalName || sch.planName}</p>
                    <div className="flex justify-between text-[9px] text-[var(--color-text-muted)] font-bold mt-1.5">
                      <span>Parada: {sch.estimatedDurationMinutes}min</span>
                      <span>Prazo: {sch.scheduledDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sem Data Definida */}
            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="font-bold text-[11px] text-[var(--color-info)] uppercase">Sem data definida</span>
                <span className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-[var(--color-info)] font-bold px-1.5 py-0.2 rounded-md">
                  {backlogGroups.semData.length}
                </span>
              </div>
              <div className="space-y-2">
                {backlogGroups.semData.map(sch => (
                  <div key={sch.id} onClick={() => handleOpenEvent(sch)} className="p-2.5 bg-[var(--color-surface-secondary)] border-l-4 border-[var(--color-info)] rounded-lg hover:shadow-sm cursor-pointer transition-all border border-[var(--color-border)]">
                    <div className="flex justify-between font-bold">
                      <span>{sch.equipmentCode || sch.equipmentName}</span>
                      <span className="text-[var(--color-info)]">{sch.code}</span>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 truncate">{sch.intervalName || sch.planName}</p>
                    <div className="flex justify-between text-[9px] text-[var(--color-text-muted)] font-bold mt-1.5">
                      <span>Parada: {sch.estimatedDurationMinutes}min</span>
                      <span>S/ data agendada</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sem Responsável */}
            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="font-bold text-[11px] text-[var(--color-warning)] uppercase">Sem executor</span>
                <span className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-[var(--color-warning)] font-bold px-1.5 py-0.2 rounded-md">
                  {backlogGroups.semResp.length}
                </span>
              </div>
              <div className="space-y-2">
                {backlogGroups.semResp.map(sch => (
                  <div key={sch.id} onClick={() => handleOpenEvent(sch)} className="p-2.5 bg-[var(--color-surface-secondary)] border-l-4 border-[var(--color-warning)] rounded-lg hover:shadow-sm cursor-pointer transition-all border border-[var(--color-border)]">
                    <div className="flex justify-between font-bold">
                      <span>{sch.equipmentCode || sch.equipmentName}</span>
                      <span className="text-[var(--color-warning)]">{sch.code}</span>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 truncate">{sch.intervalName || sch.planName}</p>
                    <div className="flex justify-between text-[9px] text-[var(--color-text-muted)] font-bold mt-1.5">
                      <span>Parada: {sch.estimatedDurationMinutes}min</span>
                      <span>S/ executor definido</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Não Programadas */}
            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="font-bold text-[11px] text-[var(--color-text-secondary)] uppercase">Não Programadas</span>
                <span className="text-[10px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] font-bold px-1.5 py-0.2 rounded-md">
                  {backlogGroups.naoProgramadas.length}
                </span>
              </div>
              <div className="space-y-2">
                {backlogGroups.naoProgramadas.map(sch => (
                  <div key={sch.id} onClick={() => handleOpenEvent(sch)} className="p-2.5 bg-[var(--color-surface-secondary)] border-l-4 border-gray-400 rounded-lg hover:shadow-sm cursor-pointer transition-all border border-[var(--color-border)]">
                    <div className="flex justify-between font-bold">
                      <span>{sch.equipmentCode || sch.equipmentName}</span>
                      <span>{sch.code}</span>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 truncate">{sch.intervalName || sch.planName}</p>
                    <div className="flex justify-between text-[9px] text-[var(--color-text-muted)] font-bold mt-1.5">
                      <span>Parada: {sch.estimatedDurationMinutes}min</span>
                      <span>Gatilho: {sch.meterType || 'tempo'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Drawer Lateral Direito de Detalhes do Evento */}
      {drawerOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 overflow-hidden text-xs">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={() => setDrawerOpen(false)} />

          <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-xl flex flex-col justify-between animate-slide-in-right">
              
              {/* Topo do Drawer */}
              <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-secondary)]">
                <div>
                  <h2 className="text-sm font-bold text-[var(--color-text-primary)]">Detalhes da Programação</h2>
                  <p className="text-[10px] text-[var(--color-text-muted)] font-extrabold uppercase mt-0.5">{selectedEvent.code} ({selectedEvent.status})</p>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-1 rounded-lg hover:bg-[var(--color-border)] text-[var(--color-text-secondary)] cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Conteúdo do Drawer */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Ativo / Equipamento</span>
                    <span className="font-bold text-xs">{selectedEvent.equipmentName} ({selectedEvent.equipmentCode || 'TR'})</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Tipo da Manutenção</span>
                    <span className="font-semibold text-xs">{selectedEvent.intervalName || 'Preventiva Regular'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Ordem de Serviço (OS)</span>
                    {selectedEvent.preventiveOrderId ? (
                      <span className="font-extrabold text-[var(--color-brand)] flex items-center gap-1">
                        {selectedEvent.preventiveOrderId} <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-brand)]" />
                      </span>
                    ) : (
                      <span className="text-[var(--color-text-muted)] italic font-semibold">Nenhuma vinculada</span>
                    )}
                  </div>
                  <div>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Prioridade</span>
                    <span className={`font-extrabold uppercase ${selectedEvent.priority === 'critica' || selectedEvent.priority === 'alta' ? 'text-[var(--color-danger)]' : 'text-[var(--color-brand)]'}`}>
                      {selectedEvent.priority}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Data Agendada</span>
                    <span className="font-bold">{selectedEvent.scheduledDate}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Horário / Parada</span>
                    <span className="font-bold">{selectedEvent.scheduledTime || '08:00'} ({selectedEvent.estimatedDurationMinutes} minutos)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Responsável</span>
                    <span className="font-bold">{selectedEvent.responsibleName || 'Não atribuído'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Oficina</span>
                    <span className="font-bold">{selectedEvent.workshopName || 'Sede Central'}</span>
                  </div>
                </div>

                {selectedEvent.observations && (
                  <div>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Observações Operacionais</span>
                    <p className="p-2.5 bg-[var(--color-surface-secondary)] border border-[var(--color-border)] rounded-xl italic mt-1 text-[var(--color-text-secondary)]">
                      "{selectedEvent.observations}"
                    </p>
                  </div>
                )}

                {/* Subformulário: Reprogramar */}
                {isRescheduling && (
                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl space-y-3 animate-fadeIn">
                    <h4 className="font-bold text-xs text-blue-800 dark:text-blue-300">Reprogramar Agendamento</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="date" 
                        value={newDateStr}
                        onChange={e => setNewDateStr(e.target.value)}
                        className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg font-bold" 
                      />
                      <input 
                        type="time" 
                        value={newTimeStr}
                        onChange={e => setNewTimeStr(e.target.value)}
                        className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg font-bold" 
                      />
                    </div>
                    <textarea
                      placeholder="Justificativa de adiamento / reprogramação (mín. 5 caract.)..."
                      value={rescheduleReason}
                      onChange={e => setRescheduleReason(e.target.value)}
                      className="w-full p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs"
                      rows={2}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setIsRescheduling(false)}>Cancelar</Button>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={executeReschedule}
                        disabled={rescheduleReason.trim().length < 5}
                        className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white"
                      >
                        Confirmar Reagendamento
                      </Button>
                    </div>
                  </div>
                )}

                {/* Subformulário: Cancelar */}
                {isCanceling && (
                  <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl space-y-3 animate-fadeIn">
                    <h4 className="font-bold text-xs text-rose-800 dark:text-rose-300">Cancelar Programação</h4>
                    <textarea
                      placeholder="Justificativa estrita de cancelamento (mín. 5 caract.)..."
                      value={cancelReason}
                      onChange={e => setCancelReason(e.target.value)}
                      className="w-full p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs"
                      rows={2}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setIsCanceling(false)}>Voltar</Button>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={executeCancel}
                        disabled={cancelReason.trim().length < 5}
                        className="bg-[var(--color-danger)] hover:bg-[var(--color-danger-light)] text-white"
                      >
                        Confirmar Cancelamento
                      </Button>
                    </div>
                  </div>
                )}

                {/* Recursos de Peças / Ferramentas */}
                {((selectedEvent.parts && selectedEvent.parts.length > 0) || (selectedEvent.tools && selectedEvent.tools.length > 0)) && (
                  <div className="border-t border-[var(--color-border)] pt-4 space-y-3">
                    <h4 className="font-bold text-xs text-[var(--color-text-secondary)]">Recursos Planejados</h4>
                    
                    {selectedEvent.parts && selectedEvent.parts.length > 0 && (
                      <div>
                        <span className="block text-[10px] text-[var(--color-text-muted)] font-bold mb-1">Peças e Insumos</span>
                        <div className="space-y-1.5">
                          {selectedEvent.parts.map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-[var(--color-surface-secondary)] px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] text-[11px]">
                              <span>{p.name}</span>
                              <span className="font-bold">Qtd: {p.quantity || 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Ações do Drawer no Rodapé */}
              <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {!selectedEvent.preventiveOrderId ? (
                    <Button 
                      variant="primary" 
                      onClick={executeCreateOS}
                      className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold text-xs py-2 flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Wrench className="w-4 h-4" /> Emitir Ordem de Serviço
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/ordens-servico/${selectedEvent.preventiveOrderId}`)}
                      className="w-full text-xs py-2 flex items-center justify-center gap-1 font-bold border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-secondary)]"
                    >
                      Ver O.S. Vinculada <ExternalLink className="w-3.5 h-3.5 text-[var(--color-brand)]" />
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsRescheduling(!isRescheduling);
                      setIsCanceling(false);
                    }}
                    className="w-full text-xs font-semibold border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-secondary)]"
                  >
                    Reprogramar
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsCanceling(!isCanceling);
                      setIsRescheduling(false);
                    }}
                    className="w-full text-[var(--color-danger)] border border-[var(--color-border)] hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold"
                  >
                    Cancelar Agendamento
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/equipamentos/${selectedEvent.equipmentId}`)}
                    className="w-full text-xs font-semibold border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-secondary)]"
                  >
                    Ficha do Equipamento
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
