import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  BarChart3,
  Target,
  Settings,
  LogOut,
  Shield,
  Layers,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { TabType, UserProfile } from '../types';
import { formatCurrency } from '../utils/formatters';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  profile: UserProfile;
  accumulatedBalance: number;
  totalSalesCount: number;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  profile,
  accumulatedBalance,
  totalSalesCount,
  onLogout,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'vendas', label: 'Vendas', icon: <ReceiptText className="w-4 h-4" />, badge: `${totalSalesCount}` },
    { id: 'relatorios', label: 'Relatórios', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'metas', label: 'Metas', icon: <Target className="w-4 h-4" /> },
    { id: 'configuracoes', label: 'Configurações', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside
      id="desktop-sidebar"
      className="hidden lg:flex flex-col w-64 bg-[#080d17]/95 border-r border-white/10 p-5 shrink-0 min-h-screen sticky top-0 justify-between backdrop-blur-xl"
    >
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 text-slate-950 font-black text-lg tracking-tighter">
            VP
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-white tracking-tight">
                Vault<span className="text-emerald-400">Pay</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Controle de Contas</p>
          </div>
        </div>

        {/* Mini Wallet status in sidebar */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Wallet className="w-3 h-3 text-emerald-400" /> Saldo Registrado
            </span>
          </div>
          <div className="text-base font-black text-emerald-400 font-numeric truncate">
            {formatCurrency(accumulatedBalance)}
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Menu Principal
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-numeric">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile card & Logout */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-sm font-bold text-emerald-400">
            {profile.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{profile.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{profile.email}</p>
          </div>
        </div>

        <button
          id="btn-sidebar-logout"
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sair da conta</span>
        </button>
      </div>
    </aside>
  );
};
