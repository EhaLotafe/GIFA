import { User, Home, FileText, Receipt, Package, BarChart3, CreditCard, Bot, X } from "lucide-react";
import { useEffect } from "react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export default function MobileNav({ isOpen, onClose, currentSection, onSectionChange }: MobileNavProps) {
  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: Home },
    { id: "invoices", label: "Facturation", icon: FileText },
    { id: "expenses", label: "Dépenses", icon: Receipt },
    { id: "inventory", label: "Stock/Services", icon: Package },
    { id: "reports", label: "Rapports", icon: BarChart3 },
    { id: "payments", label: "Paiements", icon: CreditCard },
    { id: "ai-assistant", label: "Assistant IA", icon: Bot },
  ];

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
      <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-card shadow-xl transform transition-transform duration-300">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[hsl(var(--gifa-primary))] rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">GIFA</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Fermer le menu">
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center p-3 rounded-lg mb-2 text-sm font-medium transition-colors ${
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
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
      </div>
    </div>
  );
}
