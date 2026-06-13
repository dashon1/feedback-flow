import React, { useState, useEffect } from "react";
import { Feedback, Channel } from "@/api/entities";
import {
  BarChart3,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";

import MetricsGrid from "../components/dashboard/MetricsGrid";
import FeedbackTrends from "../components/dashboard/FeedbackTrends";
import RecentFeedback from "../components/dashboard/RecentFeedback";
import SentimentOverview from "../components/dashboard/SentimentOverview";
import ChannelPerformance from "../components/dashboard/ChannelPerformance";
import PriorityActions from "../components/dashboard/PriorityActions";

export default function Dashboard() {
  const [feedback, setFeedback] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [feedbackData, channelData] = await Promise.all([
        Feedback.list("-created_date", 100),
        Channel.list("-created_date", 20)
      ]);
      setFeedback(feedbackData);
      setChannels(channelData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDashboardMetrics = () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayFeedback = feedback.filter(f => 
      new Date(f.created_date).toDateString() === today.toDateString()
    );
    
    const sentimentDistribution = {
      positive: feedback.filter(f => f.sentiment === 'positive').length,
      neutral: feedback.filter(f => f.sentiment === 'neutral').length,
      negative: feedback.filter(f => f.sentiment === 'negative').length,
    };

    const responseRate = feedback.filter(f => f.response_sent).length / (feedback.length || 1) * 100;

    return {
      totalFeedback: feedback.length,
      newToday: todayFeedback.length,
      avgResponseTime: "2.3h",
      sentimentDistribution,
      responseRate: Math.round(responseRate),
      criticalIssues: feedback.filter(f => f.priority === 'critical').length,
      resolvedToday: feedback.filter(f => 
        f.status === 'resolved' && 
        new Date(f.updated_date).toDateString() === today.toDateString()
      ).length
    };
  };

  const metrics = getDashboardMetrics();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and analyze customer feedback across all channels</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <MetricsGrid metrics={metrics} loading={loading} />

      {/* Charts and Analytics Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FeedbackTrends 
            feedback={feedback} 
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            loading={loading}
          />
        </div>
        <div>
          <SentimentOverview 
            distribution={metrics.sentimentDistribution}
            loading={loading}
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <RecentFeedback 
            feedback={feedback.slice(0, 6)}
            loading={loading}
          />
        </div>
        <div className="lg:col-span-4">
          <ChannelPerformance 
            channels={channels}
            feedback={feedback}
            loading={loading}
          />
        </div>
        <div className="lg:col-span-3">
          <PriorityActions 
            feedback={feedback.filter(f => 
              f.priority === 'critical' || f.priority === 'high'
            ).slice(0, 5)}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}