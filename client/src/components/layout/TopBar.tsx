import { Menu, Bell, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardSummary } from "@/hooks/useFinancialData";

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
  onNewInvoice: () => void;
}

export default function TopBar({ title, onMenuClick, onNewInvoice }: TopBarProps) {
  const { data: summary } = useDashboardSummary();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FC';
  };

  return (
    <header className="bg-white dark:bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 mr-2"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <Button variant="ghost" size="sm" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Current Balance - Desktop only */}
          {summary && (
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Solde:</span>
              <span className="text-lg font-semibold gifa-text-success">
                {formatCurrency(summary.totalRevenue - summary.totalExpenses)}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={onNewInvoice}
              className="gifa-btn-primary"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Nouvelle facture</span>
              <span className="sm:hidden">Facture</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
