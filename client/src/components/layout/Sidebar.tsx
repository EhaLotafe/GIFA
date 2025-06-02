import { User, Home, FileText, Receipt, Package, BarChart3, CreditCard, Bot } from "lucide-react";

interface SidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ currentSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: Home },
    { id: "invoices", label: "Facturation", icon: FileText },
    { id: "expenses", label: "Dépenses", icon: Receipt },
    { id: "inventory", label: "Stock/Services", icon: Package },
    { id: "reports", label: "Rapports", icon: BarChart3 },
    { id: "payments", label: "Paiements", icon: CreditCard },
    { id: "ai-assistant", label: "Assistant IA", icon: Bot },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-card border-r border-border">
      {/* Header */}
      <div className="flex items-center h-16 px-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[hsl(var(--gifa-primary))] rounded-xl flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">GIFA</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Finance Locale</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "text-[hsl(var(--gifa-primary))] bg-[hsl(var(--gifa-primary-light))] dark:bg-[hsl(var(--gifa-primary)_/_0.1)]"
                  : "text-gray-700 dark:text-gray-300 hover:text-[hsl(var(--gifa-primary))] hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Jean Kabila</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Boutique JK</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
