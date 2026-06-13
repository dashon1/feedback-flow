import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  X, 
  User, 
  Mail, 
  Building2,
  Calendar,
  MessageSquare,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  active: 'bg-blue-100 text-blue-800',
  champion: 'bg-green-100 text-green-800',
  at_risk: 'bg-red-100 text-red-800',
  inactive: 'bg-gray-100 text-gray-800'
};

const sentimentColors = {
  positive: 'bg-green-100 text-green-800',
  neutral: 'bg-gray-100 text-gray-800',
  negative: 'bg-red-100 text-red-800'
};

export default function CustomerDetail({ customer, feedback, onClose, onUpdate }) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5" />
          Customer Profile
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Customer Info */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl">
                  {customer.name ? customer.name[0].toUpperCase() : <User className="w-8 h-8" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {customer.name || 'Anonymous User'}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-600 mt-1">
                      <Mail className="w-4 h-4" />
                      <span>{customer.email}</span>
                    </div>
                    {customer.company && (
                      <div className="flex items-center gap-1 text-gray-600 mt-1">
                        <Building2 className="w-4 h-4" />
                        <span>{customer.company}</span>
                      </div>
                    )}
                  </div>
                  <Badge className={statusColors[customer.status || 'active']}>
                    {customer.status || 'active'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{customer.total_feedback || 0}</div>
              <div className="text-xs text-gray-600">Total Feedback</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{customer.positive_feedback || 0}</div>
              <div className="text-xs text-gray-600">Positive</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{customer.negative_feedback || 0}</div>
              <div className="text-xs text-gray-600">Negative</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Feedback */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feedback.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No feedback yet</p>
              ) : (
                feedback.slice(0, 10).map((item) => (
                  <div key={item.id} className="border-l-2 border-indigo-500 pl-3 py-2">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                      <Badge variant="outline" className={`text-xs ${sentimentColors[item.sentiment]}`}>
                        {item.sentiment}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-1">{item.content}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(item.created_date), "MMM d, yyyy")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {customer.notes && (
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-base">Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{customer.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}