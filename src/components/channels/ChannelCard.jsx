import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  MessageCircle, 
  Phone, 
  Star, 
  Globe,
  Settings,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

const channelIcons = {
  email: Mail,
  survey: CheckCircle,
  social_media: MessageCircle,
  support_ticket: AlertCircle,
  app_review: Star,
  live_chat: MessageCircle,
  website_form: Globe,
  phone: Phone
};

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  error: 'bg-red-100 text-red-800 border-red-200'
};

export default function ChannelCard({ channel, feedbackCount, onUpdate, onDelete }) {
  const Icon = channelIcons[channel.type] || Globe;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Icon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{channel.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{channel.type.replace(/_/g, ' ')}</p>
            </div>
          </div>
          <Badge variant="outline" className={statusColors[channel.status]}>
            {channel.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {channel.description || 'No description provided'}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Feedback</span>
            <span className="font-semibold text-gray-900">{feedbackCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Last Sync</span>
            <span className="font-medium text-gray-700">
              {channel.last_sync ? format(new Date(channel.last_sync), 'MMM d, HH:mm') : 'Never'}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onUpdate(channel.id, { last_sync: new Date().toISOString() })}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Sync
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {/* Configure channel */}}
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(channel.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}