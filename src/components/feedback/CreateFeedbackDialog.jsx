import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateFeedbackDialog({ open, onOpenChange, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    customer_name: '',
    customer_email: '',
    source: 'website_form',
    category: 'general',
    priority: 'medium',
    sentiment: 'neutral'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      content: '',
      customer_name: '',
      customer_email: '',
      source: 'website_form',
      category: 'general',
      priority: 'medium',
      sentiment: 'neutral'
    });
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Feedback</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Brief summary of the feedback"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Full feedback content..."
              value={formData.content}
              onChange={(e) => updateField('content', e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Customer Name</Label>
              <Input
                id="customer_name"
                placeholder="Customer name"
                value={formData.customer_name}
                onChange={(e) => updateField('customer_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_email">Customer Email</Label>
              <Input
                id="customer_email"
                type="email"
                placeholder="customer@example.com"
                value={formData.customer_email}
                onChange={(e) => updateField('customer_email', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select value={formData.source} onValueChange={(value) => updateField('source', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="survey">Survey</SelectItem>
                  <SelectItem value="social_media">Social Media</SelectItem>
                  <SelectItem value="support_ticket">Support Ticket</SelectItem>
                  <SelectItem value="app_review">App Review</SelectItem>
                  <SelectItem value="live_chat">Live Chat</SelectItem>
                  <SelectItem value="website_form">Website Form</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => updateField('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => updateField('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug_report">Bug Report</SelectItem>
                  <SelectItem value="feature_request">Feature Request</SelectItem>
                  <SelectItem value="user_experience">User Experience</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="pricing">Pricing</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="compliment">Compliment</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sentiment">Sentiment</Label>
              <Select value={formData.sentiment} onValueChange={(value) => updateField('sentiment', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Add Feedback
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}