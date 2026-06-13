
import React, { useState, useEffect, useCallback } from "react";
import { Feedback } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


import { 
  Search, 
  Plus
} from "lucide-react";

import FeedbackList from "../components/feedback/FeedbackList";
import FeedbackFilters from "../components/feedback/FeedbackFilters";
import FeedbackDetail from "../components/feedback/FeedbackDetail";
import CreateFeedbackDialog from "../components/feedback/CreateFeedbackDialog";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    sentiment: "all",
    source: "all",
    category: "all"
  });

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const data = await Feedback.list("-created_date", 200);
      setFeedback(data);
    } catch (error) {
      console.error("Error loading feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...feedback];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(term) ||
        item.content?.toLowerCase().includes(term) ||
        item.customer_name?.toLowerCase().includes(term) ||
        item.customer_email?.toLowerCase().includes(term) ||
        item.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== "all") {
      filtered = filtered.filter(item => item.priority === filters.priority);
    }

    // Sentiment filter
    if (filters.sentiment !== "all") {
      filtered = filtered.filter(item => item.sentiment === filters.sentiment);
    }

    // Source filter
    if (filters.source !== "all") {
      filtered = filtered.filter(item => item.source === filters.source);
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    setFilteredFeedback(filtered);
  }, [feedback, searchTerm, filters]); // Dependencies for useCallback

  useEffect(() => {
    applyFilters();
  }, [applyFilters]); // Now depends on the memoized applyFilters

  const handleCreateFeedback = async (feedbackData) => {
    try {
      await Feedback.create(feedbackData);
      await loadFeedback();
      setShowCreateDialog(false);
    } catch (error) {
      console.error("Error creating feedback:", error);
    }
  };

  const handleUpdateFeedback = async (id, updates) => {
    try {
      await Feedback.update(id, updates);
      await loadFeedback();
      // Update selected feedback if it's currently selected
      if (selectedFeedback?.id === id) {
        setSelectedFeedback({ ...selectedFeedback, ...updates });
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`transition-all duration-300 ${selectedFeedback ? 'w-1/2' : 'w-full'} p-6`}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
            <p className="text-gray-600 mt-1">
              {filteredFeedback.length} of {feedback.length} feedback items
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Feedback
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search feedback, customers, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <FeedbackFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Feedback List */}
        <FeedbackList
          feedback={filteredFeedback}
          loading={loading}
          onSelectFeedback={setSelectedFeedback}
          selectedId={selectedFeedback?.id}
          onUpdateFeedback={handleUpdateFeedback}
        />
      </div>

      {/* Feedback Detail Sidebar */}
      {selectedFeedback && (
        <div className="w-1/2 border-l border-gray-200 bg-white">
          <FeedbackDetail
            feedback={selectedFeedback}
            onClose={() => setSelectedFeedback(null)}
            onUpdate={handleUpdateFeedback}
          />
        </div>
      )}

      {/* Create Feedback Dialog */}
      <CreateFeedbackDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateFeedback}
      />
    </div>
  );
}
