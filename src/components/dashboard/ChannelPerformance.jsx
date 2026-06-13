import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Mail, MessageCircle, Phone, Star } from "lucide-react";

const getChannelIcon = (type) => {
  switch (type) {
    case 'email': return <Mail className="w-4 h-4" />;
    case 'live_chat': return <MessageCircle className="w-4 h-4" />;
    case 'phone': return <Phone className="w-4 h-4" />;
    case 'app_review': return <Star className="w-4 h-4" />;
    default: return <Zap className="w-4 h-4" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'error': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function ChannelPerformance({ channels, feedback, loading }) {
  if (loading) {
    return (
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate feedback count per channel
  const channelStats = channels.map(channel => {
    const channelFeedback = feedback.filter(f => f.source === channel.type);
    return {
      ...channel,
      feedbackCount: channelFeedback.length,
      recentFeedback: channelFeedback.filter(f => {
        const created = new Date(f.created_date);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return created >= weekAgo;
      }).length
    };
  });

  const maxFeedback = Math.max(...channelStats.map(c => c.feedbackCount), 1);

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Channel Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {channelStats.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No channels configured</p>
            <p className="text-sm text-gray-400">Add channels to track performance</p>
          </div>
        ) : (
          <div className="space-y-4">
            {channelStats.map((channel) => (
              <div key={channel.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-gray-100 rounded">
                      {getChannelIcon(channel.type)}
                    </div>
                    <span className="font-medium text-gray-900">{channel.name}</span>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(channel.status)}`}>
                      {channel.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{channel.feedbackCount}</span>
                    {channel.recentFeedback > 0 && (
                      <span className="text-xs text-green-600 block">
                        +{channel.recentFeedback} this week
                      </span>
                    )}
                  </div>
                </div>
                <Progress 
                  value={(channel.feedbackCount / maxFeedback) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}