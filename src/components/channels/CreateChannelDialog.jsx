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

export default function CreateChannelDialog({ open, onOpenChange, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'email',
    description: '',
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      last_sync: new Date().toISOString(),
      total_feedback: 0
    });
    setFormData({
      name: '',
      type: 'email',
      description: '',
      status: 'active'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Channel</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Channel Name</Label>
            <Input
              id="name"
              placeholder="e.g. Customer Support Email"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Channel Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({...formData, type: value})}
            >
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this channel..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Add Channel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}