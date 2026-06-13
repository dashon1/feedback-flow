import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const SENTIMENT_COLORS = {
  positive: '#10b981',
  neutral: '#f59e0b',
  negative: '#ef4444'
};

export default function SentimentOverview({ distribution, loading }) {
  if (loading) {
    return (
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const total = distribution.positive + distribution.neutral + distribution.negative;
  const chartData = [
    { name: 'Positive', value: distribution.positive, color: SENTIMENT_COLORS.positive },
    { name: 'Neutral', value: distribution.neutral, color: SENTIMENT_COLORS.neutral },
    { name: 'Negative', value: distribution.negative, color: SENTIMENT_COLORS.negative }
  ];

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'Negative': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getSentimentIcon(item.name)}
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-gray-50">
                  {total > 0 ? Math.round((item.value / total) * 100) : 0}%
                </Badge>
                <span className="text-sm text-gray-600">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total Analyzed</span>
            <span className="font-semibold text-gray-900">{total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}