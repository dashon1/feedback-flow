import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, TrendingUp, Star } from "lucide-react";

export default function CustomerInsights({ customers, feedback, loading }) {
  const topCustomers = customers
    .sort((a, b) => b.total_feedback - a.total_feedback)
    .slice(0, 10);

  const champions = customers.filter(c => c.status === 'champion');
  const atRisk = customers.filter(c => c.status === 'at_risk');

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Most Active Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3 flex-1">
                  <div className="font-semibold text-gray-400 w-6">#{index + 1}</div>
                  <Avatar>
                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                      {customer.name ? customer.name[0].toUpperCase() : <User className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{customer.name || 'Anonymous'}</div>
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{customer.total_feedback}</div>
                  <div className="text-xs text-gray-500">feedback items</div>
                </div>
                <Badge variant="outline" className={
                  customer.status === 'champion' ? 'bg-green-50 text-green-700' :
                  customer.status === 'at_risk' ? 'bg-red-50 text-red-700' :
                  'bg-gray-50 text-gray-700'
                }>
                  {customer.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Champions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{champions.length}</div>
              <div className="text-sm text-gray-600 mt-1">Happy customers</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-500" />
              At Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600">{atRisk.length}</div>
              <div className="text-sm text-gray-600 mt-1">Need attention</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}