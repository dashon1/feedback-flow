import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Zap, CheckCircle, AlertCircle, Activity } from "lucide-react";

export default function ChannelStats({ channels, feedback, loading }) {
  const stats = {
    total: channels.length,
    active: channels.filter(c => c.status === 'active').length,
    errors: channels.filter(c => c.status === 'error').length,
    totalFeedback: feedback.length
  };

  const statCards = [
    {
      title: "Total Channels",
      value: stats.total,
      icon: Zap,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Active",
      value: stats.active,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Errors",
      value: stats.errors,
      icon: AlertCircle,
      color: "bg-red-100 text-red-600"
    },
    {
      title: "Total Feedback",
      value: stats.totalFeedback,
      icon: Activity,
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-4">
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