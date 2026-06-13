import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowUpRight, User, MessageSquare } from "lucide-react";

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200"
};

const sentimentColors = {
  positive: "bg-green-100 text-green-800 border-green-200",
  neutral: "bg-gray-100 text-gray-800 border-gray-200",
  negative: "bg-red-100 text-red-800 border-red-200"
};

export default function RecentFeedback({ feedback, loading }) {
  if (loading) {
    return (
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Recent Feedback
          </CardTitle>
          <Link 
            to={createPageUrl("Feedback")} 
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View all <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedback.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No recent feedback</p>
              <p className="text-sm text-gray-400">New feedback will appear here</p>
            </div>
          ) : (
            feedback.map((item) => (
              <div key={item.id} className="flex items-start gap-3 hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-indigo-100 text-indigo-600">
                    {item.customer_name ? item.customer_name[0].toUpperCase() : <User className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {format(new Date(item.created_date), "MMM d")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">{item.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {item.priority && (
                      <Badge variant="outline" className={`text-xs ${priorityColors[item.priority]}`}>
                        {item.priority}
                      </Badge>
                    )}
                    {item.sentiment && (
                      <Badge variant="outline" className={`text-xs ${sentimentColors[item.sentiment]}`}>
                        {item.sentiment}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                      {item.source?.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}