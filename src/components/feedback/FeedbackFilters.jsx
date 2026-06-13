import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";

export default function FeedbackFilters({ filters, onFiltersChange }) {
  const updateFilter = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    onFiltersChange({
      status: "all",
      priority: "all",
      sentiment: "all",
      source: "all",
      category: "all"
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== "all").length;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
      </div>

      <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="reviewing">Reviewing</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.sentiment} onValueChange={(value) => updateFilter('sentiment', value)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Sentiment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sentiment</SelectItem>
          <SelectItem value="positive">Positive</SelectItem>
          <SelectItem value="neutral">Neutral</SelectItem>
          <SelectItem value="negative">Negative</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.source} onValueChange={(value) => updateFilter('source', value)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
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

      {activeFiltersCount > 0 && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearFilters}
          className="flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          Clear ({activeFiltersCount})
        </Button>
      )}
    </div>
  );
}