import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function SentimentAnalysis({ feedback, loading }) {
  const generateSentimentTrend = () => {
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayFeedback = feedback.filter(f => 
        f.created_date?.split('T')[0] === dateStr
      );
      
      const positive = dayFeedback.filter(f => f.sentiment === 'positive').length;
      const negative = dayFeedback.filter(f => f.sentiment === 'negative').length;
      const neutral = dayFeedback.filter(f => f.sentiment === 'neutral').length;
      const total = positive + negative + neutral;
      
      last30Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: total > 0 ? ((positive - negative) / total * 100) : 0,
        positive,
        negative,
        neutral
      });
    }
    return last30Days;
  };

  const sentimentData = generateSentimentTrend();

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Sentiment Trend (30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  label={{ value: 'Sentiment Score', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  name="Sentiment Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {['positive', 'neutral', 'negative'].map((sentiment) => {
              const count = feedback.filter(f => f.sentiment === sentiment).length;
              const percentage = feedback.length > 0 ? (count / feedback.length * 100).toFixed(1) : 0;
              const color = sentiment === 'positive' ? 'bg-green-500' : 
                           sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500';
              
              return (
                <div key={sentiment}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium capitalize">{sentiment}</span>
                    <span className="text-sm text-gray-600">{percentage}% ({count})</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}