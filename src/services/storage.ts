import { Sale, SalesGoal, UserProfile } from '../types';

const STORAGE_KEYS = {
  SALES: 'vaultpay_sales_v2',
  GOALS: 'vaultpay_goals_v2',
  PROFILE: 'vaultpay_profile_v2',
  AUTH: 'vaultpay_auth_v2',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'João',
  email: 'joao.pedro2399s@gmail.com',
  businessName: 'VaultPay Contas Digitais',
  currency: 'BRL',
  soundEnabled: true,
};

const DEFAULT_GOAL: SalesGoal = {
  targetSalesCount: 100,
  targetRevenue: 10000,
  month: new Date().toISOString().slice(0, 7), // e.g. "2026-08"
};

// Realistic mock sales generator available when user chooses to load demonstration data
export function generateSeedSales(): Sale[] {
  const today = new Date();
  const sales: Sale[] = [];
  
  const accountTypes = [
    { name: 'Netflix 4K Ultra HD (30 dias)', category: 'Streaming' as const, price: 25.00 },
    { name: 'Spotify Premium Família', category: 'Streaming' as const, price: 19.90 },
    { name: 'Canva Pro Vitalício Equipe', category: 'Produtividade' as const, price: 49.90 },
    { name: 'Valorant Diamante/Radiant Full Skins', category: 'Jogos' as const, price: 280.00 },
    { name: 'GTA V Online + $50M Modded', category: 'Jogos' as const, price: 120.00 },
    { name: 'YouTube Premium Anual', category: 'Streaming' as const, price: 45.00 },
    { name: 'Conta Steam 200+ Jogos Top', category: 'Jogos' as const, price: 350.00 },
    { name: 'Discord Nitro 1 Ano + 2 Boosts', category: 'Redes Sociais' as const, price: 89.90 },
    { name: 'Conta #084 Prime VIP', category: 'Jogos' as const, price: 120.00 },
    { name: 'ChatGPT Plus OpenAI (Compartilhada)', category: 'Produtividade' as const, price: 35.00 },
    { name: 'Instagram 25k Seguidores Reais', category: 'Redes Sociais' as const, price: 210.00 },
    { name: 'Crunchyroll Mega Fan 12M', category: 'Streaming' as const, price: 32.00 },
    { name: 'Adobe Creative Cloud 1 Ano', category: 'Produtividade' as const, price: 180.00 },
    { name: 'Minecraft Full Acesso VIP', category: 'Jogos' as const, price: 65.00 },
    { name: 'Max HBO Anual 4K', category: 'Streaming' as const, price: 38.00 },
    { name: 'Roblox 10k Robux + Itens Raros', category: 'Jogos' as const, price: 140.00 },
  ];

  const paymentMethods = ['Pix', 'Pix', 'Pix', 'Cartão', 'Mercado Pago', 'Pix'] as const;

  let count = 1;
  for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
    const saleDate = new Date(today);
    saleDate.setDate(saleDate.getDate() - daysAgo);
    const dateStr = saleDate.toISOString().split('T')[0];

    const isRecent = daysAgo <= 7;
    const isToday = daysAgo === 0;
    const numSalesToday = isToday ? 2 : isRecent ? (1 + (daysAgo % 2)) : ((daysAgo % 3) === 0 ? 0 : 1);

    for (let s = 0; s < numSalesToday; s++) {
      const item = accountTypes[(daysAgo * 3 + s) % accountTypes.length];
      const method = paymentMethods[(s + daysAgo) % paymentMethods.length];
      const padId = String(count).padStart(3, '0');
      
      sales.push({
        id: `sale_${Date.now() - daysAgo * 86400000 + s * 1000}_${count}`,
        accountName: `Conta #${padId} - ${item.name}`,
        accountCategory: item.category,
        amount: item.price,
        paymentMethod: method,
        date: dateStr,
        status: 'Concluída',
        notes: s === 0 ? 'Cliente via WhatsApp' : 'Entrega automática',
        createdAt: new Date(saleDate.getTime() + (10 + s * 3) * 3600000).toISOString(),
      });
      count++;
    }
  }

  return sales;
}

export const StorageService = {
  getSales(): Sale[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SALES);
      if (!data) {
        // Start completely clean and zeroed out by default
        const emptySales: Sale[] = [];
        localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(emptySales));
        return emptySales;
      }
      const sales: Sale[] = JSON.parse(data);
      // Auto-correct any sale that was saved as 1.12 or 1.117 due to previously typing 1117 / 1.117
      let hasFix = false;
      const fixedSales = sales.map((sale) => {
        if (Math.abs(sale.amount - 1.12) < 0.01 || Math.abs(sale.amount - 1.117) < 0.001) {
          hasFix = true;
          return { ...sale, amount: 1117.0 };
        }
        return sale;
      });
      if (hasFix) {
        this.saveSales(fixedSales);
        return fixedSales;
      }
      return sales;
    } catch (e) {
      console.error('Failed to load sales from storage:', e);
      return [];
    }
  },

  saveSales(sales: Sale[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    } catch (e) {
      console.error('Failed to save sales to storage:', e);
    }
  },

  addSale(sale: Omit<Sale, 'id' | 'createdAt'>): Sale {
    const sales = this.getSales();
    const newSale: Sale = {
      ...sale,
      id: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newSale, ...sales];
    this.saveSales(updated);
    return newSale;
  },

  updateSale(id: string, updatedFields: Partial<Sale>): Sale | null {
    const sales = this.getSales();
    const index = sales.findIndex((s) => s.id === id);
    if (index === -1) return null;
    const updatedSale = { ...sales[index], ...updatedFields };
    sales[index] = updatedSale;
    this.saveSales(sales);
    return updatedSale;
  },

  deleteSale(id: string): boolean {
    const sales = this.getSales();
    const filtered = sales.filter((s) => s.id !== id);
    if (filtered.length === sales.length) return false;
    this.saveSales(filtered);
    return true;
  },

  clearAllSales(): void {
    this.saveSales([]);
  },

  loadDemoSales(): Sale[] {
    const seed = generateSeedSales();
    this.saveSales(seed);
    return seed;
  },

  getGoal(): SalesGoal {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (!data) return DEFAULT_GOAL;
      return { ...DEFAULT_GOAL, ...JSON.parse(data) };
    } catch {
      return DEFAULT_GOAL;
    }
  },

  saveGoal(goal: SalesGoal): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goal));
    } catch (e) {
      console.error('Failed to save goal:', e);
    }
  },

  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) return DEFAULT_PROFILE;
      return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  },

  getAuth(): { isAuthenticated: boolean; user: { name: string; email: string } } {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (!data) {
        // Default authenticated with João
        return {
          isAuthenticated: true,
          user: { name: 'João', email: 'joao.pedro2399s@gmail.com' },
        };
      }
      return JSON.parse(data);
    } catch {
      return { isAuthenticated: true, user: { name: 'João', email: 'joao.pedro2399s@gmail.com' } };
    }
  },

  saveAuth(auth: { isAuthenticated: boolean; user: { name: string; email: string } }): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
    } catch (e) {
      console.error('Failed to save auth:', e);
    }
  },

  resetAllData(): void {
    this.saveSales([]);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
  },

  exportToCSV(sales: Sale[]): string {
    const headers = ['ID', 'Data', 'Identificação da Conta', 'Categoria', 'Valor (R$)', 'Método de Pagamento', 'Status', 'Observações', 'Criado Em'];
    const rows = sales.map((s) => [
      s.id,
      s.date,
      `"${(s.accountName || '').replace(/"/g, '""')}"`,
      s.accountCategory || 'Outro',
      s.amount.toFixed(2).replace('.', ','),
      s.paymentMethod,
      s.status,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
      s.createdAt,
    ]);

    const csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    return csvContent;
  },
};
