import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  Plus,
  BarChart3,
  Target,
  Settings,
} from 'lucide-react';
import { TabType } from '../types';

interface MobileNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenSaleModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenSaleModal,
}) => {
  const items: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Início', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'vendas', label: 'Vendas', icon: <ReceiptText className="w-5 h-5" /> },
    { id: 'relatorios', label: 'Relatórios', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'metas', label: 'Metas', icon: <Target className="w-5 h-5" /> },
    { id: 'configuracoes', label: 'Ajustes', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070c16]/95 border-t border-white/10 backdrop-blur-xl px-2 py-1.5 safe-area-pb"
    >
      <div className="flex items-center justify-around relative">
        {items.map((item, index) => {
          const isActive = activeTab === item.id;

          // Insert the floating action button in the center
          if (index === 2) {
            return (
              <React.Fragment key="center-with-fab">
                <button
                  id="btn-mobile-quick-sale"
                  type="button"
                  onClick={onOpenSaleModal}
                  className="-mt-6 w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/40 border border-emerald-300/30 active:scale-95 transition-transform cursor-pointer"
                  aria-label="Registrar nova venda"
                >
                  <Plus className="w-6 h-6 stroke-[3]" />
                </button>

                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="mt-0.5">{item.label}</span>
                </button>
              </React.Fragment>
            );
          }

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
