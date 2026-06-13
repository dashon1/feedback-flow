import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  ExternalLink,
  Send,
  Edit,
  Save,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function FeedbackDetail({ feedback, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [editedFeedback, setEditedFeedback] = useState(feedback);
  const [isSending, setIsSending] = useState(false);

  const handleSave = () => {
    onUpdate(feedback.id, editedFeedback);
    setIsEditing(false);
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) return;
    
    setIsSending(true);
    try {
      await onUpdate(feedback.id, {
        response_sent: true,
        response_content: responseText,
        status: 'resolved'
      });
      setResponseText('');
    } catch (error) {
      console.error("Error sending response:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Feedback Details
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
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-indigo-100 text-indigo-600">
                  {feedback.customer_name ? feedback.customer_name[0].toUpperCase() : <User className="w-5 h-5" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {feedback.customer_name || 'Anonymous User'}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {feedback.customer_email || 'No email provided'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(feedback.created_date), "MMM d, yyyy 'at' HH:mm")}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Content */}
        <Card className="border-gray-200">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base">{feedback.title}</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              {feedback.content}
            </p>
            
            {feedback.source_url && (
              <a
                href={feedback.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm"
              >
                <ExternalLink className="w-3 h-3" />
                View Original Source
              </a>
            )}
          </CardContent>
        </Card>

        {/* Properties */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                {isEditing ? (
                  <Select 
                    value={editedFeedback.status} 
                    onValueChange={(value) => setEditedFeedback({...editedFeedback, status: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline" className={`mt-1 ${statusColors[feedback.status]}`}>
                    {feedback.status?.replace(/_/g, ' ')}
                  </Badge>
                )}
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</label>
                {isEditing ? (
                  <Select 
                    value={editedFeedback.priority} 
                    onValueChange={(value) => setEditedFeedback({...editedFeedback, priority: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline" className={`mt-1 ${priorityColors[feedback.priority]}`}>
                    {feedback.priority}
                  </Badge>
                )}
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Source</label>
                <div className="mt-1">
                  <Badge variant="outline" className="bg-gray-50 text-gray-600">
                    {feedback.source?.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</label>
                <div className="mt-1">
                  <Badge variant="outline" className={`${sentimentColors[feedback.sentiment]}`}>
                    {feedback.sentiment}
                  </Badge>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-4 pt-4 border-t">
                <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Response Section */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">Customer Response</CardTitle>
          </CardHeader>
          <CardContent>
            {feedback.response_sent && feedback.response_content ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800 mb-2">Response sent:</p>
                <p className="text-sm text-green-700">{feedback.response_content}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Textarea
                  placeholder="Write a response to this customer..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <Button 
                  onClick={handleSendResponse} 
                  disabled={!responseText.trim() || isSending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSending ? 'Sending...' : 'Send Response'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}