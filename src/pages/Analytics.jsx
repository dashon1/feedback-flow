import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Download,
  Sparkles,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";

import TrendAnalysis from "../components/analytics/TrendAnalysis";
import SentimentAnalysis from "../components/analytics/SentimentAnalysis";
import CategoryBreakdown from "../components/analytics/CategoryBreakdown";
import CustomerInsights from "../components/analytics/CustomerInsights";
import WordCloud from "../components/analytics/WordCloud";
import TimeAnalysis from "../components/analytics/TimeAnalysis";
import AIInsights from "../components/analytics/AIInsights";

export default function AnalyticsPage() {
  const [feedback, setFeedback] = useState([]);
  const [trends, setTrends] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAIInsights] = useState(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [feedbackData, trendData, customerData] = await Promise.all([
        base44.entities.Feedback.list("-created_date", 500),
        base44.entities.Trend.list("-created_date", 50),
        base44.entities.Customer.list("-total_feedback", 100)
      ]);
      setFeedback(feedbackData);
      setTrends(trendData);
      setCustomers(customerData);
    } catch (error) {
      console.error("Error loading analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async () => {
    setGeneratingInsights(true);
    try {
      // Get recent feedback for analysis
      const recentFeedback = feedback.slice(0, 50);
      const feedbackSummary = recentFeedback.map(f => 
        `[${f.priority}] ${f.title}: ${f.content.substring(0, 100)}...`
      ).join('\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this customer feedback data and provide actionable insights:

${feedbackSummary}

Please analyze and provide:
1. Top 3 recurring themes or issues
2. Sentiment trends and patterns
3. Urgent items requiring immediate attention
4. Recommendations for product/service improvements
5. Predicted customer satisfaction trajectory

Format your response as structured insights.`,
        response_json_schema: {
          type: "object",
          properties: {
            key_themes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  theme: { type: "string" },
                  frequency: { type: "string" },
                  urgency: { type: "string" }
                }
              }
            },
            sentiment_summary: { type: "string" },
            urgent_actions: {
              type: "array",
              items: { type: "string" }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            },
            satisfaction_prediction: { type: "string" }
          }
        }
      });

      setAIInsights(response);
    } catch (error) {
      console.error("Error generating AI insights:", error);
    } finally {
      setGeneratingInsights(false);
    }
  };

  const handleExportReport = async () => {
    // In a real implementation, this would generate a PDF or CSV
    alert("Export functionality - Would generate comprehensive analytics report");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            Advanced Analytics
          </h1>
          <p className="text-gray-600 mt-1">Deep insights and trend analysis across all feedback</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={generateAIInsights}
            disabled={generatingInsights}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {generatingInsights ? 'Analyzing...' : 'AI Insights'}
          </Button>
          <Button 
            onClick={handleExportReport}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* AI Insights Banner */}
      {aiInsights && (
        <AIInsights insights={aiInsights} />
      )}

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="trends">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="sentiment">
            <Activity className="w-4 h-4 mr-2" />
            Sentiment
          </TabsTrigger>
          <TabsTrigger value="categories">
            <PieChart className="w-4 h-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="customers">
            <Users className="w-4 h-4 mr-2" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="keywords">
            <Brain className="w-4 h-4 mr-2" />
            Keywords
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <TrendAnalysis trends={trends} feedback={feedback} loading={loading} />
          <TimeAnalysis feedback={feedback} loading={loading} />
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-6">
          <SentimentAnalysis feedback={feedback} loading={loading} />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <CategoryBreakdown feedback={feedback} loading={loading} />
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <CustomerInsights customers={customers} feedback={feedback} loading={loading} />
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6">
          <WordCloud feedback={feedback} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}