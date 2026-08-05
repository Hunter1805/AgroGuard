import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'underline',
  className = '',
}) => {
  if (variant === 'pills') {
    return (
      <div className={`flex gap-1 flex-wrap ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary/10 text-primary'
                : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
            }`}
          >
            {tab.icon && <span className="opacity-80">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono-label ${
                activeTab === tab.id
                  ? 'bg-primary/20 text-primary'
                  : 'bg-error/10 text-error'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'default') {
    return (
      <div className={`flex gap-0.5 flex-wrap p-1 bg-surface-container rounded-lg ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-surface-container-highest text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.icon && <span className="opacity-80">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="bg-error/10 text-error text-[10px] px-1.5 py-0.5 rounded-full font-mono-label">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // variant === 'underline' (default)
  return (
    <div className={`border-b border-white/10 ${className}`}>
      <div className="flex gap-0 flex-wrap -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-white/20'
            }`}
          >
            {tab.icon && <span className="opacity-80">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="bg-error/10 text-error text-[10px] px-1.5 py-0.5 rounded-full font-mono-label">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
