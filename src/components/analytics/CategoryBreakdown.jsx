import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#84cc16', '#f97316'];

export default function CategoryBreakdown({ feedback, loading }) {
  const getCategoryData = () => {
    const categoryCount = {};
    feedback.forEach(f => {
      if (f.category) {
        categoryCount[f.category] = (categoryCount[f.category] || 0) + 1;
      }
    });
    
    return Object.entries(categoryCount)
      .map(([category, count]) => ({
        category: category.replace(/_/g, ' '),
        count,
        percentage: ((count / feedback.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);
  };

  const categoryData = getCategoryData();

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Feedback by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis 
                  type="category" 
                  dataKey="category" 
                  width={120}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData.map((item, index) => (
              <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium capitalize">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{item.count}</div>
                  <div className="text-xs text-gray-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}