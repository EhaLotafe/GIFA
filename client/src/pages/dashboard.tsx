import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import TopBar from "@/components/layout/TopBar";
import FinancialCards from "@/components/dashboard/FinancialCards";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import InvoiceModal from "@/components/modals/InvoiceModal";
import AIAssistant from "@/components/ai/AIAssistant";

type Section = "dashboard" | "invoices" | "expenses" | "inventory" | "reports" | "payments" | "ai-assistant";

export default function Dashboard() {
  const [currentSection, setCurrentSection] = useState<Section>("dashboard");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const handleSectionChange = (section: Section) => {
    setCurrentSection(section);
    setIsMobileNavOpen(false);
  };

  const getSectionTitle = (section: Section): string => {
    const titles = {
      dashboard: "Tableau de bord",
      invoices: "Facturation",
      expenses: "Suivi des dépenses", 
      inventory: "Gestion Stock/Services",
      reports: "Rapports et Analyses",
      payments: "Paiements",
      "ai-assistant": "Assistant IA Financier",
    };
    return titles[section];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar 
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          {/* Top Bar */}
          <TopBar 
            title={getSectionTitle(currentSection)}
            onMenuClick={() => setIsMobileNavOpen(true)}
            onNewInvoice={() => setIsInvoiceModalOpen(true)}
          />

          {/* Section Content */}
          <div className="p-4 lg:p-8">
            {currentSection === "dashboard" && (
              <div className="space-y-8">
                <FinancialCards />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <RevenueChart />
                  <RecentActivity />
                </div>
                <QuickActions onSectionChange={handleSectionChange} />
              </div>
            )}

            {currentSection === "ai-assistant" && (
              <AIAssistant />
            )}

            {/* Autres sections à implémenter */}
            {currentSection !== "dashboard" && currentSection !== "ai-assistant" && (
              <div className="gifa-card p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {getSectionTitle(currentSection)}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Cette section est en cours de développement.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <InvoiceModal 
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
    </div>
  );
}
