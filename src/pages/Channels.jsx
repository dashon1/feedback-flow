import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Zap, 
  RefreshCw,
  TrendingUp
} from "lucide-react";

import ChannelCard from "../components/channels/ChannelCard";
import CreateChannelDialog from "../components/channels/CreateChannelDialog";
import ChannelStats from "../components/channels/ChannelStats";
import BulkImport from "../components/channels/BulkImport";

export default function ChannelsPage() {
  const [channels, setChannels] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [channelData, feedbackData] = await Promise.all([
        base44.entities.Channel.list("-created_date", 100),
        base44.entities.Feedback.list("-created_date", 200)
      ]);
      setChannels(channelData);
      setFeedback(feedbackData);
    } catch (error) {
      console.error("Error loading channels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChannel = async (channelData) => {
    try {
      await base44.entities.Channel.create(channelData);
      await loadData();
      setShowCreateDialog(false);
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  const handleUpdateChannel = async (id, updates) => {
    try {
      await base44.entities.Channel.update(id, updates);
      await loadData();
    } catch (error) {
      console.error("Error updating channel:", error);
    }
  };

  const handleDeleteChannel = async (id) => {
    if (!confirm("Are you sure you want to delete this channel?")) return;
    try {
      await base44.entities.Channel.delete(id);
      await loadData();
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      // In a real implementation, this would trigger sync for all channels
      await new Promise(resolve => setTimeout(resolve, 2000));
      await loadData();
    } catch (error) {
      console.error("Error syncing channels:", error);
    } finally {
      setSyncing(false);
    }
  };

  const getChannelFeedbackCount = (channelType) => {
    return feedback.filter(f => f.source === channelType).length;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-8 h-8 text-indigo-600" />
            Feedback Channels
          </h1>
          <p className="text-gray-600 mt-1">Manage and configure all your feedback sources</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleSyncAll}
            disabled={syncing}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync All'}
          </Button>
          <Button 
            onClick={() => setShowBulkImport(true)}
            variant="outline"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Channel
          </Button>
        </div>
      </div>

      {/* Channel Statistics */}
      <ChannelStats channels={channels} feedback={feedback} loading={loading} />

      {/* Channels Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))
        ) : channels.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No channels configured</h3>
              <p className="text-gray-600 mb-4">Add your first feedback channel to start aggregating customer feedback</p>
              <Button onClick={() => setShowCreateDialog(true)} className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Channel
              </Button>
            </CardContent>
          </Card>
        ) : (
          channels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              feedbackCount={getChannelFeedbackCount(channel.type)}
              onUpdate={handleUpdateChannel}
              onDelete={handleDeleteChannel}
            />
          ))
        )}
      </div>

      {/* Dialogs */}
      <CreateChannelDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateChannel}
      />

      <BulkImport
        open={showBulkImport}
        onOpenChange={setShowBulkImport}
        onComplete={loadData}
      />
    </div>
  );
}