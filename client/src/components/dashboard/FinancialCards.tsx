import { TrendingUp, TrendingDown, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardSummary } from "@/hooks/useFinancialData";
import { Skeleton } from "@/components/ui/skeleton";

export default function FinancialCards() {
  const { data: summary, isLoading } = useDashboardSummary();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FC';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const cards = [
    {
      title: "Revenus ce mois",
      value: summary.totalRevenue,
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "success",
    },
    {
      title: "Dépenses ce mois", 
      value: summary.totalExpenses,
      change: "+8.2%",
      trend: "up",
      icon: TrendingDown,
      color: "error",
    },
    {
      title: "Bénéfice net",
      value: summary.netProfit,
      change: "+18.9%",
      trend: "up",
      icon: TrendingUp,
      color: "primary",
    },
    {
      title: "Factures en attente",
      value: summary.pendingInvoices,
      subtitle: formatCurrency(summary.pendingAmount),
      icon: Clock,
      color: "warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <Card key={index} className="gifa-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {typeof card.value === 'number' && card.title !== "Factures en attente" 
                      ? formatCurrency(card.value)
                      : card.value
                    }
                  </p>
                  {card.change && (
                    <p className={`text-sm mt-1 ${
                      card.color === 'success' ? 'gifa-text-success' :
                      card.color === 'error' ? 'gifa-text-error' :
                      'gifa-text-success'
                    }`}>
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      {card.change} vs mois dernier
                    </p>
                  )}
                  {card.subtitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {card.subtitle} à recevoir
                    </p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  card.color === 'success' ? 'gifa-bg-success-light' :
                  card.color === 'error' ? 'gifa-bg-error-light' :
                  card.color === 'warning' ? 'gifa-bg-warning-light' :
                  'bg-blue-100 dark:bg-blue-900'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    card.color === 'success' ? 'gifa-text-success' :
                    card.color === 'error' ? 'gifa-text-error' :
                    card.color === 'warning' ? 'gifa-text-warning' :
                    'text-[hsl(var(--gifa-primary))]'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
