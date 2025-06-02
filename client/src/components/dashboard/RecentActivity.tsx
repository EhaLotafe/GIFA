import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, CreditCard } from "lucide-react";
import { useTransactions } from "@/hooks/useFinancialData";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentActivity() {
  const { data: transactions, isLoading } = useTransactions();

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('fr-FR').format(num) + ' FC';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return `Il y a ${diffDays}j`;
    }
  };

  const getTransactionIcon = (type: string, paymentMethod: string | null) => {
    if (type === "income") {
      return paymentMethod?.includes("money") ? CreditCard : Plus;
    }
    return Minus;
  };

  const getTransactionColor = (type: string) => {
    return type === "income" 
      ? "gifa-text-success bg-green-100 dark:bg-green-900"
      : "gifa-text-error bg-red-100 dark:bg-red-900";
  };

  if (isLoading) {
    return (
      <Card className="gifa-card">
        <CardHeader>
          <CardTitle>Transactions récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentTransactions = transactions?.slice(0, 5) || [];

  return (
    <Card className="gifa-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transactions récentes</CardTitle>
        <Button variant="ghost" size="sm" className="text-[hsl(var(--gifa-primary))] hover:text-[hsl(var(--gifa-primary)_/_0.8)]">
          Voir tout
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Aucune transaction récente
            </p>
          ) : (
            recentTransactions.map((transaction) => {
              const Icon = getTransactionIcon(transaction.type, transaction.paymentMethod);
              const colorClass = getTransactionColor(transaction.type);
              
              return (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.paymentMethod || transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === "income" ? "gifa-text-success" : "gifa-text-error"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
