import { 
  users, invoices, expenses, inventory, transactions, paymentLinks,
  type User, type InsertUser,
  type Invoice, type InsertInvoice,
  type Expense, type InsertExpense,
  type InventoryItem, type InsertInventoryItem,
  type Transaction, type InsertTransaction,
  type PaymentLink, type InsertPaymentLink
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Invoices
  getInvoices(userId: number): Promise<Invoice[]>;
  getInvoice(id: number, userId: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, userId: number, updates: Partial<Invoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: number, userId: number): Promise<boolean>;

  // Expenses
  getExpenses(userId: number): Promise<Expense[]>;
  getExpensesByCategory(userId: number, category: string): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: number, userId: number, updates: Partial<Expense>): Promise<Expense | undefined>;
  deleteExpense(id: number, userId: number): Promise<boolean>;

  // Inventory
  getInventory(userId: number): Promise<InventoryItem[]>;
  getInventoryItem(id: number, userId: number): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, userId: number, updates: Partial<InventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: number, userId: number): Promise<boolean>;
  getLowStockItems(userId: number): Promise<InventoryItem[]>;

  // Transactions
  getTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Transaction[]>;

  // Payment Links
  getPaymentLinks(userId: number): Promise<PaymentLink[]>;
  getPaymentLink(linkId: string): Promise<PaymentLink | undefined>;
  createPaymentLink(paymentLink: InsertPaymentLink): Promise<PaymentLink>;
  updatePaymentLink(linkId: string, updates: Partial<PaymentLink>): Promise<PaymentLink | undefined>;

  // Analytics
  getFinancialSummary(userId: number, month?: number, year?: number): Promise<{
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    pendingInvoices: number;
    pendingAmount: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private invoices: Map<number, Invoice>;
  private expenses: Map<number, Expense>;
  private inventory: Map<number, InventoryItem>;
  private transactions: Map<number, Transaction>;
  private paymentLinks: Map<string, PaymentLink>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.invoices = new Map();
    this.expenses = new Map();
    this.inventory = new Map();
    this.transactions = new Map();
    this.paymentLinks = new Map();
    this.currentId = 1;

    // Initialize with sample user
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleUser: User = {
      id: 1,
      username: "jeankabila",
      password: "password123",
      businessName: "Boutique JK",
      email: "jean@boutiquejk.cd",
      phone: "+243891234567",
      createdAt: new Date(),
    };
    this.users.set(1, sampleUser);
    this.currentId = 2;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Invoices
  async getInvoices(userId: number): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(invoice => invoice.userId === userId);
  }

  async getInvoice(id: number, userId: number): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    return invoice?.userId === userId ? invoice : undefined;
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = this.currentId++;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(id).padStart(4, '0')}`;
    const invoice: Invoice = {
      ...insertInvoice,
      id,
      invoiceNumber,
      createdAt: new Date(),
      paidDate: null,
    };
    this.invoices.set(id, invoice);

    // Create corresponding transaction
    await this.createTransaction({
      userId: insertInvoice.userId,
      type: "income",
      category: "sales",
      description: `Invoice ${invoiceNumber} - ${insertInvoice.clientName}`,
      amount: insertInvoice.amount,
      paymentMethod: null,
      relatedInvoiceId: id,
      relatedExpenseId: null,
    });

    return invoice;
  }

  async updateInvoice(id: number, userId: number, updates: Partial<Invoice>): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice || invoice.userId !== userId) return undefined;

    const updatedInvoice = { ...invoice, ...updates };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }

  async deleteInvoice(id: number, userId: number): Promise<boolean> {
    const invoice = this.invoices.get(id);
    if (!invoice || invoice.userId !== userId) return false;
    return this.invoices.delete(id);
  }

  // Expenses
  async getExpenses(userId: number): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(expense => expense.userId === userId);
  }

  async getExpensesByCategory(userId: number, category: string): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(
      expense => expense.userId === userId && expense.category === category
    );
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.currentId++;
    const expense: Expense = {
      ...insertExpense,
      id,
      createdAt: new Date(),
    };
    this.expenses.set(id, expense);

    // Create corresponding transaction
    await this.createTransaction({
      userId: insertExpense.userId,
      type: "expense",
      category: insertExpense.category,
      description: insertExpense.description,
      amount: insertExpense.amount,
      paymentMethod: insertExpense.paymentMethod,
      relatedInvoiceId: null,
      relatedExpenseId: id,
    });

    return expense;
  }

  async updateExpense(id: number, userId: number, updates: Partial<Expense>): Promise<Expense | undefined> {
    const expense = this.expenses.get(id);
    if (!expense || expense.userId !== userId) return undefined;

    const updatedExpense = { ...expense, ...updates };
    this.expenses.set(id, updatedExpense);
    return updatedExpense;
  }

  async deleteExpense(id: number, userId: number): Promise<boolean> {
    const expense = this.expenses.get(id);
    if (!expense || expense.userId !== userId) return false;
    return this.expenses.delete(id);
  }

  // Inventory
  async getInventory(userId: number): Promise<InventoryItem[]> {
    return Array.from(this.inventory.values()).filter(item => item.userId === userId);
  }

  async getInventoryItem(id: number, userId: number): Promise<InventoryItem | undefined> {
    const item = this.inventory.get(id);
    return item?.userId === userId ? item : undefined;
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const id = this.currentId++;
    const item: InventoryItem = {
      ...insertItem,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.inventory.set(id, item);
    return item;
  }

  async updateInventoryItem(id: number, userId: number, updates: Partial<InventoryItem>): Promise<InventoryItem | undefined> {
    const item = this.inventory.get(id);
    if (!item || item.userId !== userId) return undefined;

    const updatedItem = { ...item, ...updates, updatedAt: new Date() };
    this.inventory.set(id, updatedItem);
    return updatedItem;
  }

  async deleteInventoryItem(id: number, userId: number): Promise<boolean> {
    const item = this.inventory.get(id);
    if (!item || item.userId !== userId) return false;
    return this.inventory.delete(id);
  }

  async getLowStockItems(userId: number): Promise<InventoryItem[]> {
    return Array.from(this.inventory.values()).filter(
      item => item.userId === userId && item.quantity <= (item.minStockLevel || 5)
    );
  }

  // Transactions
  async getTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactionsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      transaction => 
        transaction.userId === userId &&
        transaction.createdAt! >= startDate &&
        transaction.createdAt! <= endDate
    );
  }

  // Payment Links
  async getPaymentLinks(userId: number): Promise<PaymentLink[]> {
    return Array.from(this.paymentLinks.values()).filter(link => link.userId === userId);
  }

  async getPaymentLink(linkId: string): Promise<PaymentLink | undefined> {
    return this.paymentLinks.get(linkId);
  }

  async createPaymentLink(insertPaymentLink: InsertPaymentLink): Promise<PaymentLink> {
    const linkId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const paymentLink: PaymentLink = {
      ...insertPaymentLink,
      id: this.currentId++,
      linkId,
      createdAt: new Date(),
    };
    this.paymentLinks.set(linkId, paymentLink);
    return paymentLink;
  }

  async updatePaymentLink(linkId: string, updates: Partial<PaymentLink>): Promise<PaymentLink | undefined> {
    const link = this.paymentLinks.get(linkId);
    if (!link) return undefined;

    const updatedLink = { ...link, ...updates };
    this.paymentLinks.set(linkId, updatedLink);
    return updatedLink;
  }

  // Analytics
  async getFinancialSummary(userId: number, month?: number, year?: number): Promise<{
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    pendingInvoices: number;
    pendingAmount: number;
  }> {
    const now = new Date();
    const targetMonth = month ?? now.getMonth();
    const targetYear = year ?? now.getFullYear();

    // Filter transactions for the specified month/year
    const monthTransactions = Array.from(this.transactions.values()).filter(t => {
      if (t.userId !== userId || !t.createdAt) return false;
      const date = t.createdAt;
      return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
    });

    const totalRevenue = monthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const totalExpenses = monthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const userInvoices = Array.from(this.invoices.values()).filter(i => i.userId === userId);
    const pendingInvoices = userInvoices.filter(i => i.status === "pending").length;
    const pendingAmount = userInvoices
      .filter(i => i.status === "pending")
      .reduce((sum, i) => sum + parseFloat(i.amount.toString()), 0);

    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      pendingInvoices,
      pendingAmount,
    };
  }
}

export const storage = new MemStorage();
