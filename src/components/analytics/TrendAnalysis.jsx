import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertTriangle, Eye } from "lucide-react";

const trendTypeIcons = {
  rising: <TrendingUp className="w-4 h-4 text-green-600" />,
  declining: <TrendingDown className="w-4 h-4 text-red-600" />,
  urgent: <AlertTriangle className="w-4 h-4 text-orange-600" />,
  stable: <Eye className="w-4 h-4 text-blue-600" />
};

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800"
};

export default function TrendAnalysis({ trends, feedback, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading trends...</div>
        </CardContent>
      </Card>
    );
  }

  if (trends.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No trends detected yet</p>
            <p className="text-sm text-gray-400 mt-2">Trends will appear as patterns emerge in feedback</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detected Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {trends.map((trend) => (
            <Card key={trend.id} className="border-l-4 border-l-indigo-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {trendTypeIcons[trend.trend_type]}
                    <h3 className="font-semibold text-gray-900">{trend.title}</h3>
                  </div>
                  <Badge className={priorityColors[trend.priority]}>
                    {trend.priority}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{trend.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{trend.feedback_count} mentions</span>
                    {trend.keywords && trend.keywords.length > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex gap-1">
                          {trend.keywords.slice(0, 3).map((keyword, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}