import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Edit2,
  Trash2,
  Calendar,
  CreditCard,
  Tag,
  ArrowUpDown,
  FileSpreadsheet,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Sale, PaymentMethod, SaleStatus, AccountCategory } from '../types';
import { formatCurrency, formatDateBR } from '../utils/formatters';

interface SalesTableProps {
  sales: Sale[];
  onEditSale: (sale: Sale) => void;
  onDeleteSale: (sale: Sale) => void;
  onOpenSaleModal: () => void;
  title?: string;
  subtitle?: string;
  limit?: number; // optional limit for dashboard overview
  showPagination?: boolean;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  onEditSale,
  onDeleteSale,
  onOpenSaleModal,
  title = 'Histórico de Vendas',
  subtitle = 'Todas as contas comercializadas registradas no sistema',
  limit,
  showPagination = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter and sort logic
  const filteredSales = useMemo(() => {
    return sales
      .filter((sale) => {
        // Search filter
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          sale.accountName.toLowerCase().includes(query) ||
          (sale.notes && sale.notes.toLowerCase().includes(query)) ||
          (sale.accountCategory && sale.accountCategory.toLowerCase().includes(query)) ||
          sale.paymentMethod.toLowerCase().includes(query) ||
          formatCurrency(sale.amount).toLowerCase().includes(query);

        // Method filter
        const matchesMethod = selectedMethod === 'all' || sale.paymentMethod === selectedMethod;

        // Status filter
        const matchesStatus = selectedStatus === 'all' || sale.status === selectedStatus;

        // Category filter
        const matchesCategory = selectedCategory === 'all' || sale.accountCategory === selectedCategory;

        return matchesSearch && matchesMethod && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt.localeCompare(a.createdAt);
        }
        if (sortBy === 'date-asc') {
          return new Date(a.date).getTime() - new Date(b.date).getTime() || a.createdAt.localeCompare(b.createdAt);
        }
        if (sortBy === 'amount-desc') {
          return b.amount - a.amount;
        }
        if (sortBy === 'amount-asc') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [sales, searchTerm, selectedMethod, selectedStatus, selectedCategory, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage) || 1;
  const displayedSales = useMemo(() => {
    if (limit) {
      return filteredSales.slice(0, limit);
    }
    if (!showPagination) return filteredSales;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSales.slice(start, start + itemsPerPage);
  }, [filteredSales, limit, showPagination, currentPage, itemsPerPage]);

  const getStatusBadge = (status: SaleStatus) => {
    if (status === 'Concluída') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Concluída
        </span>
      );
    }
    if (status === 'Pendente') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Clock className="w-3.5 h-3.5" />
          Pendente
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <XCircle className="w-3.5 h-3.5" />
        Cancelada
      </span>
    );
  };

  const getMethodBadge = (method: PaymentMethod) => {
    if (method === 'Pix') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-950/40 text-emerald-300 border border-emerald-500/20">
          <span className="text-emerald-400">❖</span> Pix
        </span>
      );
    }
    if (method === 'Mercado Pago') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-500/20">
          MP
        </span>
      );
    }
    if (method === 'Cartão') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-950/40 text-blue-300 border border-blue-500/20">
          <CreditCard className="w-3 h-3 text-blue-400" /> Cartão
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
        Outro
      </span>
    );
  };

  return (
    <div
      id="section-sales-history"
      className="rounded-2xl glass-panel p-5 sm:p-6 border border-white/10 shadow-xl"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            {title}
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
              {filteredSales.length} registros
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={onOpenSaleModal}
          className="self-start md:self-center px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Registrar Venda</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Search */}
        <div className="relative">
          <input
            id="input-search-sales"
            type="text"
            placeholder="Buscar por conta, valor, obs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs sm:text-sm"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Method filter */}
        <div>
          <select
            id="select-filter-method"
            value={selectedMethod}
            onChange={(e) => {
              setSelectedMethod(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-xl glass-input text-xs sm:text-sm cursor-pointer bg-[#0c1424]"
          >
            <option value="all">Todos Pagamentos</option>
            <option value="Pix">Apenas Pix</option>
            <option value="Cartão">Apenas Cartão</option>
            <option value="Mercado Pago">Apenas Mercado Pago</option>
            <option value="Outro">Apenas Outro</option>
          </select>
        </div>

        {/* Status filter */}
        <div>
          <select
            id="select-filter-status"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-xl glass-input text-xs sm:text-sm cursor-pointer bg-[#0c1424]"
          >
            <option value="all">Todos Status</option>
            <option value="Concluída">Apenas Concluídas</option>
            <option value="Pendente">Apenas Pendentes</option>
            <option value="Cancelada">Apenas Canceladas</option>
          </select>
        </div>

        {/* Sorting */}
        <div>
          <select
            id="select-filter-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl glass-input text-xs sm:text-sm cursor-pointer bg-[#0c1424]"
          >
            <option value="date-desc">Mais recentes primeiro</option>
            <option value="date-asc">Mais antigas primeiro</option>
            <option value="amount-desc">Maior valor primeiro</option>
            <option value="amount-asc">Menor valor primeiro</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {sales.length === 0 ? (
        <div className="py-14 text-center rounded-2xl border border-dashed border-emerald-500/20 bg-emerald-950/10 mt-4 p-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-950/40">
            <Sparkles className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-white">Nenhuma venda registrada ainda</h4>
          <p className="text-xs text-slate-400 mt-1.5 max-w-md mx-auto">
            Seu saldo e faturamentos estão zerados. Clique no botão abaixo para cadastrar sua primeira venda de conta e começar a movimentar seu saldo financeiro.
          </p>
          <button
            type="button"
            onClick={onOpenSaleModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrar Primeira Venda</span>
          </button>
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="py-12 text-center rounded-xl border border-dashed border-white/10 mt-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-slate-500 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-300">Nenhuma venda encontrada</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tente ajustar os termos de busca ou filtros aplicados acima.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedMethod('all');
              setSelectedStatus('all');
              setSelectedCategory('all');
            }}
            className="mt-3 text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto mt-4">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Data</th>
                  <th className="py-3 px-3">Conta / Identificação</th>
                  <th className="py-3 px-3">Categoria</th>
                  <th className="py-3 px-3 text-right">Valor</th>
                  <th className="py-3 px-3 text-center">Pagamento</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayedSales.map((sale) => (
                  <tr
                    key={sale.id}
                    id={`sale-row-${sale.id}`}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    {/* Data */}
                    <td className="py-3.5 px-3 text-xs text-slate-300 font-numeric whitespace-nowrap">
                      {formatDateBR(sale.date)}
                    </td>

                    {/* Conta */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {sale.accountName}
                      </div>
                      {sale.notes && (
                        <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                          {sale.notes}
                        </div>
                      )}
                    </td>

                    {/* Categoria */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                        {sale.accountCategory || 'Outro'}
                      </span>
                    </td>

                    {/* Valor */}
                    <td className="py-3.5 px-3 text-right font-bold text-emerald-400 font-numeric text-sm whitespace-nowrap">
                      {formatCurrency(sale.amount)}
                    </td>

                    {/* Pagamento */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      {getMethodBadge(sale.paymentMethod)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      {getStatusBadge(sale.status)}
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          id={`btn-edit-sale-${sale.id}`}
                          type="button"
                          onClick={() => onEditSale(sale)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          title="Editar venda"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-delete-sale-${sale.id}`}
                          type="button"
                          onClick={() => onDeleteSale(sale)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Excluir venda"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (Visible only on mobile/tablet) */}
          <div className="block md:hidden space-y-3 mt-4">
            {displayedSales.map((sale) => (
              <div
                key={sale.id}
                id={`sale-card-mobile-${sale.id}`}
                className="p-4 rounded-xl glass-panel border border-white/10 hover:border-emerald-500/30 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {sale.accountName}
                    </h4>
                    <span className="text-[11px] text-slate-400 mt-0.5 inline-block font-numeric">
                      {formatDateBR(sale.date)} • {sale.accountCategory || 'Outro'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-emerald-400 font-numeric">
                      {formatCurrency(sale.amount)}
                    </div>
                  </div>
                </div>

                {sale.notes && (
                  <p className="text-xs text-slate-400 bg-white/[0.02] p-2 rounded-lg border border-white/5">
                    {sale.notes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    {getMethodBadge(sale.paymentMethod)}
                    {getStatusBadge(sale.status)}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditSale(sale)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSale(sale)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 bg-white/5 hover:bg-rose-500/10"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {showPagination && totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-xs text-slate-400">
              <span>
                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> ({filteredSales.length} vendas)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1.5 rounded-lg glass-panel text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1.5 rounded-lg glass-panel text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Próxima</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
