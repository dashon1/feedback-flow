import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { 
  User, 
  Tag, 
  CheckCircle2,
  MessageSquare,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const statusColors = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  reviewing: "bg-yellow-100 text-yellow-800 border-yellow-200",
  in_progress: "bg-purple-100 text-purple-800 border-purple-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200"
};

export default function FeedbackList({ 
  feedback, 
  loading, 
  onSelectFeedback, 
  selectedId,
  onUpdateFeedback 
}) {
  const handleStatusChange = (feedbackItem, newStatus) => {
    onUpdateFeedback(feedbackItem.id, { status: newStatus });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 animate-pulse">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
          <p className="text-gray-600">Try adjusting your search or filters to find feedback.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {feedback.map((item) => (
        <Card 
          key={item.id}
          className={`border transition-all duration-200 cursor-pointer hover:shadow-md ${
            selectedId === item.id 
              ? 'border-indigo-500 bg-indigo-50 shadow-md' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onSelectFeedback(item)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-indigo-100 text-indigo-600">
                  {item.customer_name ? item.customer_name[0].toUpperCase() : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {format(new Date(item.created_date), "MMM d, HH:mm")}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStatusChange(item, 'reviewing')}>
                          Mark as Reviewing
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(item, 'in_progress')}>
                          Mark as In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(item, 'resolved')}>
                          Mark as Resolved
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.content}
                </p>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    <span>{item.customer_name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Tag className="w-3 h-3" />
                    <span>{item.source?.replace(/_/g, ' ')}</span>
                  </div>
                  {item.response_sent && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Responded</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={`text-xs ${statusColors[item.status]}`}>
                    {item.status?.replace(/_/g, ' ')}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${priorityColors[item.priority]}`}>
                    {item.priority}
                  </Badge>
                  {item.sentiment && (
                    <Badge variant="outline" className={`text-xs ${sentimentColors[item.sentiment]}`}>
                      {item.sentiment}
                    </Badge>
                  )}
                  {item.category && (
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                      {item.category.replace(/_/g, ' ')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}