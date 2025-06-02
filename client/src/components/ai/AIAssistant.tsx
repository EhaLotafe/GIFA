import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb, MessageCircle, TrendingUp, PiggyBank, Send, Bot } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { aiAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Bonjour! Je suis votre assistant financier IA. Comment puis-je vous aider aujourd'hui?",
      timestamp: new Date(),
    },
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const { toast } = useToast();

  const adviceMutation = useMutation({
    mutationFn: ({ question }: { question: string }) => aiAPI.getAdvice(question, true),
    onSuccess: (response, variables) => {
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: variables.question,
        timestamp: new Date(),
      };

      // Add AI response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.advice,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
      setInputMessage("");
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'obtenir une réponse de l'assistant IA.",
        variant: "destructive",
      });
    },
  });

  const trendsMutation = useMutation({
    mutationFn: aiAPI.analyzeTrends,
    onSuccess: (response) => {
      const analysisMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "assistant",
        content: `**Analyse des tendances:**\n\n**Tendances détectées:**\n${response.trends.map(t => `• ${t}`).join('\n')}\n\n**Recommandations:**\n${response.recommendations.map(r => `• ${r}`).join('\n')}\n\n**Facteurs de risque:**\n${response.riskFactors.map(r => `• ${r}`).join('\n')}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, analysisMessage]);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'analyser les tendances.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    adviceMutation.mutate({ question: inputMessage.trim() });
  };

  const handleQuickQuestion = (question: string) => {
    adviceMutation.mutate({ question });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  };

  const suggestedQuestions = [
    "Comment optimiser mes dépenses?",
    "Quels sont mes produits les plus rentables?", 
    "Quand réapprovisionner mon stock?",
    "Comment améliorer mon flux de trésorerie?",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="gifa-card h-96 flex flex-col">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-[hsl(var(--gifa-primary))]" />
              Chat avec l'assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "items-start"}`}>
                  {message.type === "assistant" && (
                    <div className="w-8 h-8 bg-[hsl(var(--gifa-primary-light))] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Bot className="h-4 w-4 text-[hsl(var(--gifa-primary))]" />
                    </div>
                  )}
                  
                  <div className={`rounded-lg p-3 max-w-xs lg:max-w-md ${
                    message.type === "user"
                      ? "bg-[hsl(var(--gifa-primary))] text-white ml-auto"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  }`}>
                    <div
                      className="text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  </div>
                </div>
              ))}
              
              {adviceMutation.isPending && (
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[hsl(var(--gifa-primary-light))] rounded-full flex items-center justify-center mr-3">
                    <Bot className="h-4 w-4 text-[hsl(var(--gifa-primary))]" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre question..."
                className="flex-1"
                disabled={adviceMutation.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || adviceMutation.isPending}
                className="gifa-btn-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Insights */}
      <div className="space-y-6">
        <Card className="gifa-card">
          <CardHeader>
            <CardTitle>Insights automatiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start">
                  <Lightbulb className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Opportunité détectée</p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Vos revenus sont en hausse. C'est le moment d'investir dans plus de stock.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start">
                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Alerte stock</p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      Articles en stock faible détectés. Planifiez un réapprovisionnement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start">
                  <TrendingUp className="h-4 w-4 text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Tendance positive</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Vos bénéfices montrent une croissance constante.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gifa-card">
          <CardHeader>
            <CardTitle>Questions suggérées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleQuickQuestion(question)}
                  disabled={adviceMutation.isPending}
                  className="w-full text-left justify-start p-3 h-auto bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                >
                  {question}
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => trendsMutation.mutate()}
                disabled={trendsMutation.isPending}
                className="w-full mt-4"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {trendsMutation.isPending ? "Analyse..." : "Analyser les tendances"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
