import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChartData } from "@/hooks/useFinancialData";
import { Skeleton } from "@/components/ui/skeleton";

// Chart.js types and setup
declare global {
  interface Window {
    Chart: any;
  }
}

export default function RevenueChart() {
  const { data: chartData, isLoading } = useChartData();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    // Load Chart.js dynamically
    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = initChart;
      document.head.appendChild(script);
    } else {
      initChart();
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  const initChart = () => {
    if (!chartRef.current || !window.Chart || !chartData) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.monthlyData.map(d => d.month),
        datasets: [
          {
            label: 'Revenus',
            data: chartData.monthlyData.map(d => d.revenue),
            borderColor: 'hsl(207, 90%, 42%)',
            backgroundColor: 'hsla(207, 90%, 42%, 0.1)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Dépenses',
            data: chartData.monthlyData.map(d => d.expenses),
            borderColor: 'hsl(4, 90%, 58%)',
            backgroundColor: 'hsla(4, 90%, 58%, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom' as const,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value: any) {
                return new Intl.NumberFormat('fr-FR').format(value) + ' FC';
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index' as const,
        },
      },
    });
  };

  if (isLoading) {
    return (
      <Card className="gifa-card">
        <CardHeader>
          <CardTitle>Évolution des revenus</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gifa-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Évolution des revenus</CardTitle>
        <select className="text-sm border border-border rounded-lg px-3 py-1 bg-background">
          <option>6 derniers mois</option>
          <option>12 derniers mois</option>
        </select>
      </CardHeader>
      <CardContent>
        <div className="h-64 relative">
          <canvas ref={chartRef} className="w-full h-full"></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
