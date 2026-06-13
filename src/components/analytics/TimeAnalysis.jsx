import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TimeAnalysis({ feedback, loading }) {
  const getHourlyData = () => {
    const hours = Array(24).fill(0).map((_, i) => ({ hour: i, count: 0 }));
    
    feedback.forEach(f => {
      const hour = new Date(f.created_date).getHours();
      hours[hour].count++;
    });
    
    return hours.map(h => ({
      hour: h.hour === 0 ? '12 AM' : h.hour < 12 ? `${h.hour} AM` : h.hour === 12 ? '12 PM' : `${h.hour - 12} PM`,
      count: h.count
    }));
  };

  const getDayOfWeekData = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCount = Array(7).fill(0);
    
    feedback.forEach(f => {
      const day = new Date(f.created_date).getDay();
      dayCount[day]++;
    });
    
    return days.map((day, i) => ({
      day: day.substring(0, 3),
      count: dayCount[i]
    }));
  };

  const hourlyData = getHourlyData();
  const dayData = getDayOfWeekData();

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Feedback by Hour of Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="hour" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  interval={2}
                />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback by Day of Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}