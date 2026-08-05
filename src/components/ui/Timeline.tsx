import React from 'react';

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string; // ISO string
  icon?: React.ReactNode;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  user?: string;
  metadata?: React.ReactNode;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const colorClasses = {
  default: 'bg-surface-container-highest border-white/20 text-on-surface-variant',
  primary: 'bg-primary/10 border-primary/30 text-primary',
  success: 'bg-success/10 border-success/30 text-success',
  warning: 'bg-warning/10 border-warning/30 text-warning',
  error: 'bg-error/10 border-error/30 text-error',
};

const lineColorClasses = {
  default: 'bg-white/10',
  primary: 'bg-primary/20',
  success: 'bg-success/20',
  warning: 'bg-warning/20',
  error: 'bg-error/20',
};

function formatTimestamp(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export const Timeline: React.FC<TimelineProps> = ({ events, className = '' }) => {
  if (events.length === 0) {
    return (
      <div className={`text-center py-8 text-on-surface-variant text-[13px] ${className}`}>
        Nenhum evento registrado.
      </div>
    );
  }

  return (
    <div className={`space-y-0 ${className}`}>
      {events.map((event, index) => {
        const color = event.color ?? 'default';
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="flex gap-3 relative">
            {/* Linha vertical */}
            {!isLast && (
              <div
                className={`absolute left-[15px] top-8 bottom-0 w-px ${lineColorClasses[color]}`}
              />
            )}

            {/* Ícone/Dot */}
            <div className="shrink-0 mt-1">
              <div
                className={`w-8 h-8 rounded-full border flex items-center justify-center text-[12px] ${colorClasses[color]}`}
              >
                {event.icon ?? <span className="w-2 h-2 rounded-full bg-current" />}
              </div>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 pb-4 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-on-surface leading-tight">
                    {event.title}
                  </p>
                  {event.description && (
                    <p className="text-[12px] text-on-surface-variant/70 mt-0.5 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                  {event.user && (
                    <p className="text-[11px] text-on-surface-variant/50 mt-0.5">
                      por {event.user}
                    </p>
                  )}
                  {event.metadata && (
                    <div className="mt-1">{event.metadata}</div>
                  )}
                </div>
                <span className="text-[11px] text-on-surface-variant/50 font-mono-label whitespace-nowrap shrink-0">
                  {formatTimestamp(event.timestamp)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
