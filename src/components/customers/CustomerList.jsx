import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, TrendingUp, TrendingDown, Building2 } from "lucide-react";

const statusColors = {
  active: 'bg-blue-100 text-blue-800',
  champion: 'bg-green-100 text-green-800',
  at_risk: 'bg-red-100 text-red-800',
  inactive: 'bg-gray-100 text-gray-800'
};

export default function CustomerList({ customers, loading, onSelectCustomer, selectedId }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array(5).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-20 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-600">Customers will appear here as they provide feedback</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {customers.map((customer) => (
        <Card 
          key={customer.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedId === customer.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
          }`}
          onClick={() => onSelectCustomer(customer)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-indigo-100 text-indigo-600">
                  {customer.name ? customer.name[0].toUpperCase() : <User className="w-5 h-5" />}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{customer.name || 'Anonymous'}</h3>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                    {customer.company && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Building2 className="w-3 h-3" />
                        {customer.company}
                      </div>
                    )}
                  </div>
                  <Badge className={statusColors[customer.status || 'active']}>
                    {customer.status || 'active'}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Feedback:</span>
                    <span className="font-semibold text-gray-900">{customer.total_feedback || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>{customer.positive_feedback || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingDown className="w-4 h-4" />
                    <span>{customer.negative_feedback || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}