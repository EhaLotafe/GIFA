import { useQuery } from "@tanstack/react-query";
import { dashboardAPI, invoicesAPI, expensesAPI, inventoryAPI, transactionsAPI } from "@/lib/api";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["/api/dashboard/summary"],
    queryFn: dashboardAPI.getSummary,
  });
}

export function useChartData() {
  return useQuery({
    queryKey: ["/api/dashboard/chart-data"],
    queryFn: dashboardAPI.getChartData,
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: ["/api/invoices"],
    queryFn: invoicesAPI.getAll,
  });
}

export function useExpenses() {
  return useQuery({
    queryKey: ["/api/expenses"],
    queryFn: expensesAPI.getAll,
  });
}

export function useInventory() {
  return useQuery({
    queryKey: ["/api/inventory"],
    queryFn: inventoryAPI.getAll,
  });
}

export function useLowStockItems() {
  return useQuery({
    queryKey: ["/api/inventory/low-stock"],
    queryFn: inventoryAPI.getLowStock,
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["/api/transactions"],
    queryFn: transactionsAPI.getAll,
  });
}
