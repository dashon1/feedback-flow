import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Upload, FileText, CheckCircle, AlertTriangle } from "lucide-react";

export default function BulkImport({ open, onOpenChange, onComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      // Upload file
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Extract data from file
      const extractResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            source: { type: "string" },
            customer_email: { type: "string" },
            customer_name: { type: "string" },
            category: { type: "string" },
            sentiment: { type: "string" },
            priority: { type: "string" }
          }
        }
      });

      if (extractResult.status === 'success' && extractResult.output) {
        // Bulk create feedback
        const feedbackArray = Array.isArray(extractResult.output) ? extractResult.output : [extractResult.output];
        await base44.entities.Feedback.bulkCreate(feedbackArray);

        setResult({
          success: true,
          count: feedbackArray.length
        });

        setTimeout(() => {
          onComplete();
          onOpenChange(false);
          setFile(null);
          setResult(null);
        }, 2000);
      } else {
        setResult({
          success: false,
          error: extractResult.details || 'Failed to extract data'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Import Feedback</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Upload CSV, Excel, or PDF file with feedback data
            </p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
                </span>
              </Button>
            </label>
            {file && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {file.name}
              </p>
            )}
          </div>

          {result && (
            <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <p className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.success 
                    ? `Successfully imported ${result.count} feedback items!` 
                    : `Error: ${result.error}`
                  }
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!file || uploading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {uploading ? 'Importing...' : 'Import'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}