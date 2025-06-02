import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface FinancialAdviceRequest {
  question: string;
  financialData?: {
    revenue: number;
    expenses: number;
    profit: number;
    pendingInvoices: number;
    lowStockItems: number;
    recentTransactions: Array<{
      type: string;
      category: string;
      amount: number;
      description: string;
    }>;
  };
  context?: string;
}

export interface FinancialAdviceResponse {
  advice: string;
  actionItems: string[];
  insights: string[];
  confidence: number;
}

export async function getFinancialAdvice(request: FinancialAdviceRequest): Promise<FinancialAdviceResponse> {
  try {
    const systemPrompt = `Tu es un conseiller financier expert spécialisé dans l'aide aux PME africaines, particulièrement à Lubumbashi (RDC). 
    Tu comprends les défis locaux comme les fluctuations monétaires, les moyens de paiement mobiles (Airtel Money, M-Pesa), et les réalités du commerce local.
    
    Réponds toujours en français et donne des conseils pratiques et réalisables. Ton ton est amical mais professionnel.
    
    Format ta réponse en JSON avec cette structure:
    {
      "advice": "conseil principal détaillé",
      "actionItems": ["action 1", "action 2", "action 3"],
      "insights": ["insight 1", "insight 2"],
      "confidence": 0.85
    }`;

    const userPrompt = `Question: ${request.question}

${request.financialData ? `
Données financières actuelles:
- Revenus: ${request.financialData.revenue.toLocaleString()} FC
- Dépenses: ${request.financialData.expenses.toLocaleString()} FC  
- Bénéfice: ${request.financialData.profit.toLocaleString()} FC
- Factures en attente: ${request.financialData.pendingInvoices}
- Articles en stock faible: ${request.financialData.lowStockItems}

Transactions récentes:
${request.financialData.recentTransactions.map(t => 
  `- ${t.type === 'income' ? 'Revenus' : 'Dépense'} (${t.category}): ${t.amount.toLocaleString()} FC - ${t.description}`
).join('\n')}
` : ''}

${request.context ? `Contexte additionnel: ${request.context}` : ''}

Donne des conseils spécifiques et pratiques pour améliorer la situation financière.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      advice: result.advice || "Je ne peux pas fournir de conseil pour le moment.",
      actionItems: result.actionItems || [],
      insights: result.insights || [],
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
    };
  } catch (error) {
    console.error("Erreur lors de la génération de conseils IA:", error);
    throw new Error("Impossible de générer des conseils financiers pour le moment");
  }
}

export async function analyzeFinancialTrends(financialData: any): Promise<{
  trends: string[];
  recommendations: string[];
  riskFactors: string[];
}> {
  try {
    const prompt = `Analyse ces données financières mensuelles d'une PME à Lubumbashi et identifie les tendances, recommandations et facteurs de risque.

Données: ${JSON.stringify(financialData)}

Réponds en JSON avec cette structure:
{
  "trends": ["tendance 1", "tendance 2"],
  "recommendations": ["recommandation 1", "recommandation 2"], 
  "riskFactors": ["risque 1", "risque 2"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 800,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      trends: result.trends || [],
      recommendations: result.recommendations || [],
      riskFactors: result.riskFactors || [],
    };
  } catch (error) {
    console.error("Erreur lors de l'analyse des tendances:", error);
    throw new Error("Impossible d'analyser les tendances pour le moment");
  }
}
