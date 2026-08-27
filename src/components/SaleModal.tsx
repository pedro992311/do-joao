import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, CreditCard, FileText, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Sale, PaymentMethod, AccountCategory, SaleStatus } from '../types';
import { getTodayString } from '../utils/dateHelpers';
import { parseCurrencyInput, formatCurrency } from '../utils/formatters';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (saleData: Omit<Sale, 'id' | 'createdAt'>, editingId?: string) => void;
  saleToEdit?: Sale | null;
}

const PRESET_ACCOUNTS = [
  { name: 'Netflix 4K Ultra HD', category: 'Streaming' as AccountCategory, price: 25.0 },
  { name: 'Spotify Premium Família', category: 'Streaming' as AccountCategory, price: 19.9 },
  { name: 'Valorant Radiante/Diamante', category: 'Jogos' as AccountCategory, price: 280.0 },
  { name: 'GTA V Online $50M', category: 'Jogos' as AccountCategory, price: 120.0 },
  { name: 'Canva Pro Vitalício', category: 'Produtividade' as AccountCategory, price: 49.9 },
  { name: 'YouTube Premium 1 Ano', category: 'Streaming' as AccountCategory, price: 45.0 },
  { name: 'Discord Nitro Anual', category: 'Redes Sociais' as AccountCategory, price: 89.9 },
];

export const SaleModal: React.FC<SaleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  saleToEdit,
}) => {
  const [accountName, setAccountName] = useState('');
  const [accountCategory, setAccountCategory] = useState<AccountCategory>('Streaming');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Pix');
  const [date, setDate] = useState(getTodayString());
  const [status, setStatus] = useState<SaleStatus>('Concluída');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ accountName?: string; amount?: string }>({});

  useEffect(() => {
    if (saleToEdit) {
      setAccountName(saleToEdit.accountName);
      setAccountCategory(saleToEdit.accountCategory || 'Outro');
      setAmount(saleToEdit.amount % 1 === 0 ? saleToEdit.amount.toString() : saleToEdit.amount.toFixed(2).replace('.', ','));
      setPaymentMethod(saleToEdit.paymentMethod);
      setDate(saleToEdit.date);
      setStatus(saleToEdit.status);
      setNotes(saleToEdit.notes || '');
    } else {
      setAccountName('');
      setAccountCategory('Streaming');
      setAmount('');
      setPaymentMethod('Pix');
      setDate(getTodayString());
      setStatus('Concluída');
      setNotes('');
    }
    setErrors({});
  }, [saleToEdit, isOpen]);

  const parsedAmountPreview = parseCurrencyInput(amount);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { accountName?: string; amount?: string } = {};

    if (!accountName.trim()) {
      newErrors.accountName = 'Informe o nome ou identificação da conta';
    }

    const numAmount = parseCurrencyInput(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Informe um valor válido maior que zero (ex: 1117 ou 25,00)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        accountName: accountName.trim(),
        accountCategory,
        amount: numAmount,
        paymentMethod,
        date: date || getTodayString(),
        status,
        notes: notes.trim() || undefined,
      },
      saleToEdit?.id
    );

    onClose();
  };

  const handleApplyPreset = (preset: typeof PRESET_ACCOUNTS[0]) => {
    setAccountName(preset.name);
    setAccountCategory(preset.category);
    setAmount(preset.price.toFixed(2).replace('.', ','));
  };

  return (
    <div
      id="sale-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="sale-modal-container"
        className="w-full max-w-xl glass-panel-elevated rounded-2xl border border-white/15 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-black font-bold">
              <DollarSign className="w-5 h-5 text-[#07130e]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {saleToEdit ? 'Editar Venda de Conta' : 'Registrar Nova Venda'}
              </h2>
              <p className="text-xs text-slate-400">
                Preencha os dados da conta comercializada para atualizar seu controle
              </p>
            </div>
          </div>
          <button
            id="btn-close-sale-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
          {/* Quick presets (only when creating new sale) */}
          {!saleToEdit && (
            <div>
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Atalhos rápidos de contas populares:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_ACCOUNTS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nome ou Identificação */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nome ou Identificação da Conta *
            </label>
            <div className="relative">
              <input
                id="input-account-name"
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Ex: Conta #084, Netflix 4K Ultra, Valorant Diamante"
                className={`w-full px-4 py-3 rounded-xl glass-input text-sm ${
                  errors.accountName ? 'border-rose-500 focus:border-rose-500' : ''
                }`}
                autoFocus
              />
              <Tag className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
            {errors.accountName && (
              <p className="text-xs text-rose-400 mt-1">{errors.accountName}</p>
            )}
          </div>

          {/* Category & Valor in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Categoria da Conta
              </label>
              <select
                id="select-account-category"
                value={accountCategory}
                onChange={(e) => setAccountCategory(e.target.value as AccountCategory)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm cursor-pointer bg-[#0c1424]"
              >
                <option value="Streaming">Streaming (Netflix, Spotify, etc)</option>
                <option value="Jogos">Jogos (Steam, Valorant, GTA, etc)</option>
                <option value="Produtividade">Produtividade (Canva, Office, etc)</option>
                <option value="Redes Sociais">Redes Sociais (Instagram, Discord)</option>
                <option value="Outro">Outro Tipo de Conta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Valor da Venda (R$) *
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-emerald-400 font-semibold text-sm">
                  R$
                </div>
                <input
                  id="input-sale-amount"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 1117 ou 1117,00"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm font-numeric text-white ${
                    errors.amount ? 'border-rose-500 focus:border-rose-500' : ''
                  }`}
                />
              </div>

              {/* Live formatted preview */}
              {amount.trim() !== '' && (
                <div className="mt-1.5 flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  <span className="text-[11px] text-slate-300">Valor reconhecido:</span>
                  <strong className="font-numeric text-emerald-400 font-bold">
                    {formatCurrency(parsedAmountPreview)}
                  </strong>
                </div>
              )}

              {errors.amount && (
                <p className="text-xs text-rose-400 mt-1">{errors.amount}</p>
              )}
            </div>
          </div>

          {/* Data da Venda & Método de Pagamento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Data da Venda
              </label>
              <div className="relative">
                <input
                  id="input-sale-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-200"
                />
                <Calendar className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Método de Pagamento
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Pix', 'Cartão', 'Mercado Pago', 'Outro'] as PaymentMethod[]).map((method) => {
                  const isSelected = paymentMethod === method;
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-950'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {method === 'Pix' && <span className="text-emerald-400 font-bold">❖</span>}
                      {method === 'Cartão' && <CreditCard className="w-3.5 h-3.5 text-blue-400" />}
                      {method === 'Mercado Pago' && <span className="text-cyan-400 font-bold">MP</span>}
                      {method === 'Outro' && <FileText className="w-3.5 h-3.5 text-slate-400" />}
                      {method}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Status da Venda
            </label>
            <div className="flex gap-2">
              {(['Concluída', 'Pendente', 'Cancelada'] as SaleStatus[]).map((st) => {
                const isSelected = status === st;
                const colors = {
                  Concluída: isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-slate-400',
                  Pendente: isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-white/5 border-white/10 text-slate-400',
                  Cancelada: isSelected
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-white/5 border-white/10 text-slate-400',
                };
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${colors[st]}`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Observações (Opcional)
            </label>
            <textarea
              id="input-sale-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Entrega automática por bot / Cliente VIP / Chave serial enviada"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              id="btn-cancel-sale-modal"
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="btn-submit-sale"
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              {saleToEdit ? 'Salvar Alterações' : 'Registrar Venda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
