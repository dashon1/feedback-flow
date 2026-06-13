import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

export default function AIInsights({ insights }) {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6" />
        <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Key Themes */}
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Key Themes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.key_themes?.slice(0, 3).map((theme, i) => (
                <div key={i} className="bg-white/10 rounded p-2">
                  <div className="font-medium text-white text-sm">{theme.theme}</div>
                  <div className="text-xs text-white/80 mt-1">{theme.frequency} • {theme.urgency}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Summary */}
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90 text-sm leading-relaxed">{insights.sentiment_summary}</p>
          </CardContent>
        </Card>

        {/* Urgent Actions */}
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Urgent Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.urgent_actions?.map((action, i) => (
                <li key={i} className="text-white/90 text-sm flex items-start gap-2">
                  <span className="text-yellow-300 mt-1">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.recommendations?.slice(0, 3).map((rec, i) => (
                <li key={i} className="text-white/90 text-sm flex items-start gap-2">
                  <span className="text-green-300 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {insights.satisfaction_prediction && (
        <div className="mt-4 p-4 bg-white/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold">Satisfaction Prediction</span>
          </div>
          <p className="text-white/90 text-sm">{insights.satisfaction_prediction}</p>
        </div>
      )}
    </div>
  );
}