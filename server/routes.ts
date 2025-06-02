import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertInvoiceSchema, insertExpenseSchema, insertInventorySchema, insertPaymentLinkSchema } from "@shared/schema";
import { getFinancialAdvice, analyzeFinancialTrends, type FinancialAdviceRequest } from "./lib/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware pour l'authentification (simplifié pour la démo)
  const getCurrentUser = async (req: any) => {
    // Pour la démo, on utilise toujours l'utilisateur avec l'ID 1
    return await storage.getUser(1);
  };

  // Dashboard Analytics
  app.get("/api/dashboard/summary", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) return res.status(401).json({ message: "Non autorisé" });

      const summary = await storage.getFinancialSummary(user.id);
      const lowStockItems = await storage.getLowStockItems(user.id);
      const recentTransactions = await storage.getTransactions(user.id);

      res.json({
        ...summary,
        lowStockCount: lowStockItems.length,
        recentTransactions: recentTransactions.slice(0, 10),
      });
    } catch (error) {
      console.error("Erreur récupération tableau de bord:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  app.get("/api/dashboard/chart-data", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) return res.status(401).json({ message: "Non autorisé" });

      const now = new Date();
      const monthlyData = [];
      
      // Générer les données des 6 derniers mois
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const summary = await storage.getFinancialSummary(user.id, date.getMonth(), date.getFullYear());
        monthlyData.push({
          month: date.toLocaleDateString('fr', { month: 'short' }),
          revenue: summary.totalRevenue,
          expenses: summary.totalExpenses,
          profit: summary.netProfit,
        });
      }

      // Données des dépenses par catégorie
      const expenses = await storage.getExpenses(user.id);
      const expensesByCategory = expenses.reduce((acc, expense) => {
        const category = expense.category;
        acc[category] = (acc[category] || 0) + parseFloat(expense.amount.toString());
        return acc;
      }, {} as Record<string, number>);

      res.json({
        monthlyData,
        expensesByCategory,
      });
    } catch (error) {
      console.error("Erreur récupération données graphiques:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Invoices
  app.get("/api/invoices", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) return res.status(401).json({ message: "Non autorisé" });

      const invoices = await storage.getInvoices(user.id);
      res.json(invoices);
    } catch (error) {
      console.error("Erreur récupération factures:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) return res.status(401).json({ message: "Non autorisé" });

      const validatedData = insertInvoiceSchema.parse({
        ...req.body,
        userId: user.id,
      });

      const invoice = await storage.createInvoice(validatedData);
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      console.error("Erreur création facture:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  app.patch("/api/invoices/:id", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) return res.status(401).json({ message: "Non autorisé" });

      const id = parseInt(req.params.id);
      const updates = req.body;

      const invoice = await storage.updateInvoice(id, user.id, updates);
      if (!invoice) return res.status(404).json({ message: "Facture non trouvée" });

      res.json(invoice);
    } catch (error) {
      console.error("Erreur mise à jour facture:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Expenses
  app.get("/api/expenses", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) return res.status(401).json({ message: "Non autorisé" });

      const expenses = await storage.getExpenses(user.id);
      res.json(expenses);
    } catch (error) {
      console.error("Erreur récupération dépenses:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) return res.status(401).json({ message: "Non autorisé" });

      const validatedData = insertExpenseSchema.parse({
        ...req.body,
        userId: user.id,
      });

      const expense = await storage.createExpense(validatedData);
      res.status(201).json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      console.error("Erreur création dépense:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Inventory
  app.get("/api/inventory", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) return res.status(401).json({ message: "Non autorisé" });

      const inventory = await storage.getInventory(user.id);
      res.json(inventory);
    } catch (error) {
      console.error("Erreur récupération inventaire:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) return res.status(401).json({ message: "Non autorisé" });

      const validatedData = insertInventorySchema.parse({
        ...req.body,
        userId: user.id,
      });

      const item = await storage.createInventoryItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      console.error("Erreur création article inventaire:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  app.get("/api/inventory/low-stock", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) return res.status(401).json({ message: "Non autorisé" });

      const lowStockItems = await storage.getLowStockItems(user.id);
      res.json(lowStockItems);
    } catch (error) {
      console.error("Erreur récupération stock faible:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Payment Links
  app.get("/api/payment-links", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) return res.status(401).json({ message: "Non autorisé" });

      const paymentLinks = await storage.getPaymentLinks(user.id);
      res.json(paymentLinks);
    } catch (error) {
      console.error("Erreur récupération liens de paiement:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  app.post("/api/payment-links", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) return res.status(401).json({ message: "Non autorisé" });

      const validatedData = insertPaymentLinkSchema.parse({
        ...req.body,
        userId: user.id,
      });

      const paymentLink = await storage.createPaymentLink(validatedData);
      res.status(201).json(paymentLink);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      console.error("Erreur création lien de paiement:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // AI Assistant
  app.post("/api/ai/advice", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) return res.status(401).json({ message: "Non autorisé" });

      const { question, includeFinancialData } = req.body;
      
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ message: "Question requise" });
      }

      let financialData;
      if (includeFinancialData) {
        const summary = await storage.getFinancialSummary(user.id);
        const lowStockItems = await storage.getLowStockItems(user.id);
        const recentTransactions = await storage.getTransactions(user.id);

        financialData = {
          revenue: summary.totalRevenue,
          expenses: summary.totalExpenses,
          profit: summary.netProfit,
          pendingInvoices: summary.pendingInvoices,
          lowStockItems: lowStockItems.length,
          recentTransactions: recentTransactions.slice(0, 5).map(t => ({
            type: t.type,
            category: t.category,
            amount: parseFloat(t.amount.toString()),
            description: t.description,
          })),
        };
      }

      const request: FinancialAdviceRequest = {
        question,
        financialData,
        context: `Entreprise: ${user.businessName || 'Non spécifiée'}`,
      };

      const advice = await getFinancialAdvice(request);
      res.json(advice);
    } catch (error) {
      console.error("Erreur conseil IA:", error);
      res.status(500).json({ message: "Impossible de générer des conseils pour le moment" });
    }
  });

  app.post("/api/ai/analyze-trends", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) return res.status(401).json({ message: "Non autorisé" });

      const summary = await storage.getFinancialSummary(user.id);
      const expenses = await storage.getExpenses(user.id);
      const recentTransactions = await storage.getTransactions(user.id);

      const analysisData = {
        financialSummary: summary,
        expensesByCategory: expenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount.toString());
          return acc;
        }, {} as Record<string, number>),
        transactionTrends: recentTransactions.slice(0, 20),
      };

      const trends = await analyzeFinancialTrends(analysisData);
      res.json(trends);
    } catch (error) {
      console.error("Erreur analyse tendances IA:", error);
      res.status(500).json({ message: "Impossible d'analyser les tendances pour le moment" });
    }
  });

  // Transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) return res.status(401).json({ message: "Non autorisé" });

      const transactions = await storage.getTransactions(user.id);
      res.json(transactions);
    } catch (error) {
      console.error("Erreur récupération transactions:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
