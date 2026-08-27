import React, { useState, useEffect, useMemo } from 'react';
import {
  TabType,
  PeriodFilter,
  CustomDateRange,
  Sale,
  SalesGoal,
  UserProfile,
  ToastMessage,
} from './types';
import { StorageService } from './services/storage';
import { calculateMetricsForPeriod, calculateWalletStats } from './utils/metrics';
import { getTodayString } from './utils/dateHelpers';
import { playSuccessSound } from './utils/audio';

// Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { WalletCard } from './components/WalletCard';
import { MetricCards } from './components/MetricCards';
import { GoalSection } from './components/GoalSection';
import { RevenueChart } from './components/RevenueChart';
import { SalesCountChart } from './components/SalesCountChart';
import { PeriodSummaries } from './components/PeriodSummaries';
import { SalesTable } from './components/SalesTable';
import { ReportsView } from './components/ReportsView';
import { GoalsView } from './components/GoalsView';
import { SettingsView } from './components/SettingsView';
import { SaleModal } from './components/SaleModal';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer } from './components/Toast';
import { AuthView } from './components/AuthView';

export default function App() {
  // Authentication State
  const [auth, setAuth] = useState(() => StorageService.getAuth());

  // Core App State
  const [sales, setSales] = useState<Sale[]>(() => StorageService.getSales());
  const [goal, setGoal] = useState<SalesGoal>(() => StorageService.getGoal());
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());

  // Navigation & Filtering State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [period, setPeriod] = useState<PeriodFilter>('this_month');
  const [customRange, setCustomRange] = useState<CustomDateRange>({
    startDate: getTodayString(),
    endDate: getTodayString(),
  });

  // Modals & Feedback State
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState<Sale | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Helpers for Toast notifications
  const addToast = (
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    description?: string
  ) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    if (type === 'success' && profile.soundEnabled) {
      playSuccessSound();
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Calculated Metrics
  const currentMetrics = useMemo(() => {
    return calculateMetricsForPeriod(sales, period, customRange);
  }, [sales, period, customRange]);

  const walletStats = useMemo(() => {
    return calculateWalletStats(sales);
  }, [sales]);

  const periodLabels: Record<PeriodFilter, string> = {
    today: 'Hoje',
    '7days': 'Últimos 7 dias',
    this_week: 'Semana atual',
    '30days': 'Últimos 30 dias',
    this_month: 'Mês atual',
    last_month: 'Mês anterior',
    custom: 'Personalizado',
  };

  // Handlers for Sale Operations
  const handleSaveSale = (
    saleData: Omit<Sale, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId) {
      const updated = StorageService.updateSale(editingId, saleData);
      if (updated) {
        setSales(StorageService.getSales());
        addToast(
          'success',
          'Venda atualizada com sucesso!',
          `Conta "${saleData.accountName}" foi modificada.`
        );
      }
    } else {
      const created = StorageService.addSale(saleData);
      setSales(StorageService.getSales());
      addToast(
        'success',
        'Venda registrada com sucesso! 💰',
        `Conta "${saleData.accountName}" foi adicionada ao seu controle.`
      );
    }
    setSaleToEdit(null);
  };

  const handleEditSale = (sale: Sale) => {
    setSaleToEdit(sale);
    setIsSaleModalOpen(true);
  };

  const handleDeleteSale = (sale: Sale) => {
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Venda de Conta?',
      message: `Tem certeza que deseja excluir o registro de "${sale.accountName}" no valor de R$ ${sale.amount.toFixed(
        2
      )}? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir Venda',
      isDestructive: true,
      onConfirm: () => {
        StorageService.deleteSale(sale.id);
        setSales(StorageService.getSales());
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        addToast('info', 'Registro excluído', 'A venda foi removida do sistema.');
      },
    });
  };

  const handleUpdateGoal = (newGoal: SalesGoal) => {
    StorageService.saveGoal(newGoal);
    setGoal(newGoal);
    addToast('success', 'Metas salvas com sucesso!');
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    StorageService.saveProfile(newProfile);
    setProfile(newProfile);
  };

  const handleClearSales = () => {
    StorageService.clearAllSales();
    setSales([]);
  };

  const handleLoadDemoData = () => {
    const demo = StorageService.loadDemoSales();
    setSales(demo);
  };

  const handleLogout = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Sair da conta?',
      message: 'Deseja encerrar a sessão do VaultPay?',
      confirmText: 'Sair',
      isDestructive: false,
      onConfirm: () => {
        const loggedOutAuth = { isAuthenticated: false, user: { name: '', email: '' } };
        StorageService.saveAuth(loggedOutAuth);
        setAuth(loggedOutAuth);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // If not authenticated, render Login Screen
  if (!auth.isAuthenticated) {
    return (
      <AuthView
        onLoginSuccess={(user) => {
          setAuth({ isAuthenticated: true, user });
          setProfile((prev) => ({ ...prev, name: user.name, email: user.email }));
        }}
      />
    );
  }

  return (
    <div id="vaultpay-app" className="min-h-screen bg-[#060910] text-slate-100 flex flex-col lg:flex-row">
      {/* Desktop Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        profile={profile}
        accumulatedBalance={walletStats.accumulatedBalance}
        totalSalesCount={walletStats.totalSalesCount}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-12">
        {/* Header with Greetings and Period Filter */}
        <Header
          userName={profile.name}
          period={period}
          onPeriodChange={setPeriod}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
          onOpenSaleModal={() => {
            setSaleToEdit(null);
            setIsSaleModalOpen(true);
          }}
          totalSalesToday={walletStats.todayCount}
        />

        {/* Dynamic Views by activeTab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* 1. Saldo / Carteira Card */}
            <WalletCard
              accumulatedBalance={walletStats.accumulatedBalance}
              totalSalesCount={walletStats.totalSalesCount}
              todayRevenue={walletStats.todayRevenue}
              todayCount={walletStats.todayCount}
              weekRevenue={walletStats.weekRevenue}
              weekCount={walletStats.weekCount}
              monthRevenue={walletStats.monthRevenue}
              monthCount={walletStats.monthCount}
              onOpenSaleModal={() => {
                setSaleToEdit(null);
                setIsSaleModalOpen(true);
              }}
            />

            {/* 2. Quatro Cards Principais (Faturamento, Contas Vendidas, Ticket Médio, Crescimento) */}
            <MetricCards
              metrics={currentMetrics}
              periodLabel={periodLabels[period]}
            />

            {/* 3. Meta de Vendas do Mês */}
            <GoalSection
              sales={sales}
              goal={goal}
              onUpdateGoal={handleUpdateGoal}
            />

            {/* 4. Gráficos de Faturamento e Vendas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart sales={sales} />
              <SalesCountChart sales={sales} />
            </div>

            {/* 5. Resumos Especiais: Resumo da Semana e Resumo do Mês */}
            <PeriodSummaries sales={sales} />

            {/* 6. Histórico de Vendas Recentes */}
            <SalesTable
              sales={sales}
              onEditSale={handleEditSale}
              onDeleteSale={handleDeleteSale}
              onOpenSaleModal={() => {
                setSaleToEdit(null);
                setIsSaleModalOpen(true);
              }}
              title="Vendas Recentes"
              subtitle="Últimas contas comercializadas cadastradas no sistema"
              limit={6}
              showPagination={false}
            />
          </div>
        )}

        {activeTab === 'vendas' && (
          <div className="space-y-6 animate-fade-in">
            <SalesTable
              sales={sales}
              onEditSale={handleEditSale}
              onDeleteSale={handleDeleteSale}
              onOpenSaleModal={() => {
                setSaleToEdit(null);
                setIsSaleModalOpen(true);
              }}
              title="Gestão Completa de Vendas"
              subtitle="Histórico integral com busca, filtros de pagamento e paginação"
              showPagination={true}
            />
          </div>
        )}

        {activeTab === 'relatorios' && (
          <ReportsView sales={sales} onNotify={addToast} />
        )}

        {activeTab === 'metas' && (
          <GoalsView
            sales={sales}
            goal={goal}
            onUpdateGoal={handleUpdateGoal}
            onNotify={addToast}
          />
        )}

        {activeTab === 'configuracoes' && (
          <SettingsView
            profile={profile}
            sales={sales}
            goal={goal}
            onUpdateProfile={handleUpdateProfile}
            onClearSales={handleClearSales}
            onLoadDemoData={handleLoadDemoData}
            onNotify={addToast}
            onRequestConfirm={(title, message, onConfirm) => {
              setConfirmModal({
                isOpen: true,
                title,
                message,
                onConfirm,
                confirmText: 'Confirmar',
                isDestructive: true,
              });
            }}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSaleModal={() => {
          setSaleToEdit(null);
          setIsSaleModalOpen(true);
        }}
      />

      {/* Sale Modal (Create & Edit) */}
      <SaleModal
        isOpen={isSaleModalOpen}
        onClose={() => {
          setIsSaleModalOpen(false);
          setSaleToEdit(null);
        }}
        onSave={handleSaveSale}
        saleToEdit={saleToEdit}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Toast Feedback Messages */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
