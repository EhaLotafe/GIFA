import { apiRequest } from "./queryClient";

export interface DashboardSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingInvoices: number;
  pendingAmount: number;
  lowStockCount: number;
  recentTransactions: Transaction[];
}

export interface ChartData {
  monthlyData: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  expensesByCategory: Record<string, number>;
}

export interface Transaction {
  id: number;
  type: string;
  category: string;
  description: string;
  amount: string;
  paymentMethod: string | null;
  createdAt: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  amount: string;
  description: string | null;
  status: string;
  dueDate: string | null;
  paidDate: string | null;
  createdAt: string;
}

export interface Expense {
  id: number;
  category: string;
  description: string;
  amount: string;
  paymentMethod: string | null;
  createdAt: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  description: string | null;
  quantity: number;
  minStockLevel: number | null;
  unitPrice: string;
  costPrice: string | null;
  createdAt: string;
}

export interface PaymentLink {
  id: number;
  invoiceId: number;
  linkId: string;
  paymentMethod: string;
  amount: string;
  status: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface AIAdviceResponse {
  advice: string;
  actionItems: string[];
  insights: string[];
  confidence: number;
}

export interface AITrendsResponse {
  trends: string[];
  recommendations: string[];
  riskFactors: string[];
}

// Dashboard API
export const dashboardAPI = {
  getSummary: (): Promise<DashboardSummary> => 
    fetch("/api/dashboard/summary", { credentials: "include" }).then(res => res.json()),
  
  getChartData: (): Promise<ChartData> => 
    fetch("/api/dashboard/chart-data", { credentials: "include" }).then(res => res.json()),
};

// Invoices API
export const invoicesAPI = {
  getAll: (): Promise<Invoice[]> => 
    fetch("/api/invoices", { credentials: "include" }).then(res => res.json()),
  
  create: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'paidDate'>) => 
    apiRequest("POST", "/api/invoices", invoice),
  
  update: (id: number, updates: Partial<Invoice>) => 
    apiRequest("PATCH", `/api/invoices/${id}`, updates),
};

// Expenses API
export const expensesAPI = {
  getAll: (): Promise<Expense[]> => 
    fetch("/api/expenses", { credentials: "include" }).then(res => res.json()),
  
  create: (expense: Omit<Expense, 'id' | 'createdAt'>) => 
    apiRequest("POST", "/api/expenses", expense),
};

// Inventory API
export const inventoryAPI = {
  getAll: (): Promise<InventoryItem[]> => 
    fetch("/api/inventory", { credentials: "include" }).then(res => res.json()),
  
  getLowStock: (): Promise<InventoryItem[]> => 
    fetch("/api/inventory/low-stock", { credentials: "include" }).then(res => res.json()),
  
  create: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => 
    apiRequest("POST", "/api/inventory", item),
};

// Payment Links API
export const paymentLinksAPI = {
  getAll: (): Promise<PaymentLink[]> => 
    fetch("/api/payment-links", { credentials: "include" }).then(res => res.json()),
  
  create: (paymentLink: Omit<PaymentLink, 'id' | 'linkId' | 'createdAt'>) => 
    apiRequest("POST", "/api/payment-links", paymentLink),
};

// Transactions API
export const transactionsAPI = {
  getAll: (): Promise<Transaction[]> => 
    fetch("/api/transactions", { credentials: "include" }).then(res => res.json()),
};

// AI Assistant API
export const aiAPI = {
  getAdvice: (question: string, includeFinancialData: boolean = true): Promise<AIAdviceResponse> => 
    apiRequest("POST", "/api/ai/advice", { question, includeFinancialData }).then(res => res.json()),
  
  analyzeTrends: (): Promise<AITrendsResponse> => 
    apiRequest("POST", "/api/ai/analyze-trends", {}).then(res => res.json()),
};
