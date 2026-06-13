import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

export default function FeedbackTrends({ feedback, timeRange, setTimeRange, loading }) {
  const generateChartData = () => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayFeedback = feedback.filter(f => 
        f.created_date?.split('T')[0] === dateStr
      );
      
      data.push({
        date: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        total: dayFeedback.length,
        positive: dayFeedback.filter(f => f.sentiment === 'positive').length,
        negative: dayFeedback.filter(f => f.sentiment === 'negative').length,
        neutral: dayFeedback.filter(f => f.sentiment === 'neutral').length
      });
    }
    
    return data;
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-48" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = generateChartData();

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Feedback Trends</CardTitle>
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="7d">7 Days</TabsTrigger>
              <TabsTrigger value="30d">30 Days</TabsTrigger>
              <TabsTrigger value="90d">90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
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
              />
              <defs>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#totalGradient)"
                name="Total Feedback"
              />
              <Area
                type="monotone"
                dataKey="positive"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#positiveGradient)"
                name="Positive"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}