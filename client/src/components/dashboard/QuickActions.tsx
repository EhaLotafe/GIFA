import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Receipt, Package, Download } from "lucide-react";

interface QuickActionsProps {
  onSectionChange: (section: string) => void;
}

export default function QuickActions({ onSectionChange }: QuickActionsProps) {
  const actions = [
    {
      id: "invoices",
      title: "Nouvelle facture",
      description: "Génération rapide",
      icon: FileText,
      color: "primary",
    },
    {
      id: "expenses", 
      title: "Ajouter une dépense",
      description: "Suivi des coûts",
      icon: Receipt,
      color: "success",
    },
    {
      id: "inventory",
      title: "Mettre à jour stock",
      description: "Inventaire en temps réel",
      icon: Package,
      color: "warning",
    },
    {
      id: "reports",
      title: "Générer rapport",
      description: "Export Excel/Power BI",
      icon: Download,
      color: "purple",
    },
  ];

  const getColorClasses = (color: string) => {
    const classes = {
      primary: "hover:border-[hsl(var(--gifa-primary))] hover:bg-blue-50 dark:hover:bg-blue-950 group-hover:bg-blue-200 group-hover:text-[hsl(var(--gifa-primary))]",
      success: "hover:border-[hsl(var(--gifa-success))] hover:bg-green-50 dark:hover:bg-green-950 group-hover:bg-green-200 group-hover:text-[hsl(var(--gifa-success))]",
      warning: "hover:border-[hsl(var(--gifa-warning))] hover:bg-orange-50 dark:hover:bg-orange-950 group-hover:bg-orange-200 group-hover:text-[hsl(var(--gifa-warning))]",
      purple: "hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950 group-hover:bg-purple-200 group-hover:text-purple-600",
    };
    return classes[color as keyof typeof classes] || classes.primary;
  };

  const getIconColorClasses = (color: string) => {
    const classes = {
      primary: "text-[hsl(var(--gifa-primary))] bg-blue-100 dark:bg-blue-900",
      success: "text-[hsl(var(--gifa-success))] bg-green-100 dark:bg-green-900",
      warning: "text-[hsl(var(--gifa-warning))] bg-orange-100 dark:bg-orange-900",
      purple: "text-purple-600 bg-purple-100 dark:bg-purple-900",
    };
    return classes[color as keyof typeof classes] || classes.primary;
  };

  return (
    <Card className="gifa-card">
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            
            return (
              <Button
                key={action.id}
                variant="outline"
                onClick={() => onSectionChange(action.id)}
                className={`group flex items-center p-4 h-auto border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl transition-colors ${getColorClasses(action.color)}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-colors ${getIconColorClasses(action.color)}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">{action.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
