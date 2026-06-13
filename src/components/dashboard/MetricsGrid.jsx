import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MessageSquareText, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  Star
} from "lucide-react";

const MetricCard = ({ title, value, change, icon: Icon, color, loading }) => {
  if (loading) {
    return (
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="w-12 h-12 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
            {change && (
              <Badge variant="outline" className={`${color} text-xs`}>
                {change}
              </Badge>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color?.replace('text-', 'bg-').replace('border-', 'bg-').replace('-600', '-100').replace('-700', '-100')}`}>
            <Icon className={`w-6 h-6 ${color?.replace('bg-', 'text-').replace('border-', 'text-')}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function MetricsGrid({ metrics, loading }) {
  const metricCards = [
    {
      title: "Total Feedback",
      value: metrics?.totalFeedback || 0,
      change: "+12% from last week",
      icon: MessageSquareText,
      color: "bg-blue-100 text-blue-600 border-blue-200"
    },
    {
      title: "New Today",
      value: metrics?.newToday || 0,
      change: "+8 since yesterday",
      icon: TrendingUp,
      color: "bg-green-100 text-green-600 border-green-200"
    },
    {
      title: "Avg Response Time",
      value: metrics?.avgResponseTime || "0h",
      change: "-15m improvement",
      icon: Clock,
      color: "bg-orange-100 text-orange-600 border-orange-200"
    },
    {
      title: "Response Rate",
      value: `${metrics?.responseRate || 0}%`,
      change: "+2% this week",
      icon: CheckCircle2,
      color: "bg-purple-100 text-purple-600 border-purple-200"
    },
    {
      title: "Critical Issues",
      value: metrics?.criticalIssues || 0,
      change: "-2 since yesterday",
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600 border-red-200"
    },
    {
      title: "Resolved Today",
      value: metrics?.resolvedToday || 0,
      change: "+5 completed",
      icon: Star,
      color: "bg-indigo-100 text-indigo-600 border-indigo-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metricCards.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          icon={metric.icon}
          color={metric.color}
          loading={loading}
        />
      ))}
    </div>
  );
}