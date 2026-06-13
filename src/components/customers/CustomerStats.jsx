import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Star, AlertTriangle, Activity } from "lucide-react";

export default function CustomerStats({ customers, feedback, loading }) {
  const stats = {
    total: customers.length,
    champions: customers.filter(c => c.status === 'champion').length,
    atRisk: customers.filter(c => c.status === 'at_risk').length,
    avgFeedback: customers.length > 0 
      ? (customers.reduce((sum, c) => sum + (c.total_feedback || 0), 0) / customers.length).toFixed(1)
      : 0
  };

  const statCards = [
    {
      title: "Total Customers",
      value: stats.total,
      icon: Users,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Champions",
      value: stats.champions,
      icon: Star,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "At Risk",
      value: stats.atRisk,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600"
    },
    {
      title: "Avg Feedback",
      value: stats.avgFeedback,
      icon: Activity,
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}