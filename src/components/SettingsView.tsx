import React, { useState } from 'react';
import {
  User,
  Shield,
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Lock,
  Volume2,
  VolumeX,
  Building,
  Mail,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile, Sale, SalesGoal } from '../types';
import { StorageService } from '../services/storage';

interface SettingsViewProps {
  profile: UserProfile;
  sales: Sale[];
  goal: SalesGoal;
  onUpdateProfile: (profile: UserProfile) => void;
  onClearSales: () => void;
  onLoadDemoData: () => void;
  onNotify: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
  onRequestConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  sales,
  goal,
  onUpdateProfile,
  onClearSales,
  onLoadDemoData,
  onNotify,
  onRequestConfirm,
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [businessName, setBusinessName] = useState(profile.businessName);
  const [soundEnabled, setSoundEnabled] = useState(profile.soundEnabled);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      onNotify('error', 'Campos obrigatórios', 'Preencha seu nome e e-mail.');
      return;
    }
    const updated: UserProfile = {
      ...profile,
      name: name.trim(),
      email: email.trim(),
      businessName: businessName.trim() || 'VaultPay',
      soundEnabled,
    };
    onUpdateProfile(updated);
    onNotify('success', 'Perfil atualizado!', 'Suas preferências foram salvas.');
  };

  const handleExportBackup = () => {
    try {
      const backupData = {
        app: 'VaultPay',
        exportedAt: new Date().toISOString(),
        profile,
        goal,
        sales,
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vaultpay_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      onNotify('success', 'Backup exportado com sucesso!', 'Arquivo JSON salvo no seu dispositivo.');
    } catch {
      onNotify('error', 'Falha ao exportar backup', 'Tente novamente.');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && Array.isArray(json.sales)) {
          StorageService.saveSales(json.sales);
          if (json.goal) StorageService.saveGoal(json.goal);
          if (json.profile) StorageService.saveProfile(json.profile);
          onNotify('success', 'Backup restaurado com sucesso!', `${json.sales.length} vendas importadas.`);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          onNotify('error', 'Arquivo de backup inválido', 'Estrutura do JSON não reconhecida.');
        }
      } catch {
        onNotify('error', 'Erro ao ler arquivo', 'O arquivo selecionado não é um JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  const handleTriggerClearSales = () => {
    onRequestConfirm(
      'Zerar Todas as Vendas e Saldo?',
      'Esta ação irá apagar todas as vendas registradas e zerar todos os saldos e faturamentos (R$ 0,00). O saldo só aumentará quando novas vendas forem cadastradas.',
      () => {
        onClearSales();
        onNotify('info', 'Saldo Zerado', 'Todas as vendas foram limpas e o saldo está em R$ 0,00.');
      }
    );
  };

  const handleTriggerLoadDemo = () => {
    onRequestConfirm(
      'Carregar Dados de Demonstração?',
      'Esta ação irá preencher o sistema com um conjunto completo de vendas de exemplo para fins de visualização.',
      () => {
        onLoadDemoData();
        onNotify('success', 'Dados de exemplo carregados!', 'Vendas de teste prontas para visualização.');
      }
    );
  };

  return (
    <div id="view-settings-page" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-white/10">
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          Preferências do Sistema
        </span>
        <h2 className="text-2xl font-black text-white tracking-tight">Configurações & Dados</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Gerencie seu perfil de vendedor, preferências e backup de segurança
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="p-6 rounded-2xl glass-panel-elevated border border-white/15 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Perfil do Vendedor</h3>
              <p className="text-xs text-slate-400">Informações exibidas no cabeçalho e relatórios</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Nome do Usuário *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  placeholder="Ex: João"
                />
                <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                E-mail de Acesso *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  placeholder="Ex: joao.pedro2399s@gmail.com"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Nome do Negócio / Operação
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  placeholder="Ex: VaultPay Contas Digitais"
                />
                <Building className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar Alterações de Perfil</span>
              </button>
            </div>
          </form>
        </div>

        {/* Database & Backup Management */}
        <div className="p-6 rounded-2xl glass-panel-elevated border border-white/15 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Banco de Dados & Backup</h3>
              <p className="text-xs text-slate-400">
                Seus dados estão salvos localmente de forma persistente
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Export Backup */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Exportar Backup Completo</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Baixe um arquivo JSON com todas as vendas ({sales.length} registros) e metas
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportBackup}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Exportar JSON</span>
              </button>
            </div>

            {/* Import Backup */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Restaurar Backup</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Importe um arquivo JSON salvo anteriormente
                </p>
              </div>
              <label className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Importar</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>

            {/* Clear All Sales & Balance */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/25 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-rose-300">Zerar Todas as Vendas (Saldo R$ 0,00)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Limpa o histórico e zera todos os faturamentos. O saldo aumentará ao cadastrar vendas.
                </p>
              </div>
              <button
                type="button"
                onClick={handleTriggerClearSales}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Zerar Tudo</span>
              </button>
            </div>

            {/* Load Demo Data for previewing */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/25 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-cyan-300">Carregar Vendas de Demonstração</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Preenche gráficos e relatórios com dados de exemplo para demonstração
                </p>
              </div>
              <button
                type="button"
                onClick={handleTriggerLoadDemo}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Carregar Demo</span>
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>Aviso de Segurança:</strong> O VaultPay é uma ferramenta de gestão e controle de vendas. Nenhuma informação bancária sensível (senhas, dados de cartão) é solicitada ou transmitida.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
