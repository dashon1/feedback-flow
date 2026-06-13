import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Clock, User, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const priorityColors = {
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200"
};

export default function PriorityActions({ feedback, loading }) {
  if (loading) {
    return (
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
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
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Priority Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {feedback.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No priority items</p>
            <p className="text-sm text-gray-400">Critical feedback will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedback.map((item) => (
              <div key={item.id} className="border border-gray-100 rounded-lg p-3 hover:border-gray-200 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-gray-900 text-sm truncate flex-1">
                    {item.title}
                  </h4>
                  <Badge variant="outline" className={`text-xs ${priorityColors[item.priority]}`}>
                    {item.priority}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {item.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    <span>{item.customer_name || 'Anonymous'}</span>
                    <Clock className="w-3 h-3 ml-2" />
                    <span>{format(new Date(item.created_date), "MMM d")}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-indigo-600 hover:text-indigo-800">
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            {feedback.length > 0 && (
              <Button variant="outline" className="w-full text-sm">
                View All Priority Items
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}