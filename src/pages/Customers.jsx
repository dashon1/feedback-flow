import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Users
} from "lucide-react";

import CustomerList from "../components/customers/CustomerList";
import CustomerDetail from "../components/customers/CustomerDetail";
import CustomerStats from "../components/customers/CustomerStats";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [customerData, feedbackData] = await Promise.all([
        base44.entities.Customer.list("-total_feedback", 200),
        base44.entities.Feedback.list("-created_date", 500)
      ]);
      setCustomers(customerData);
      setFeedback(feedbackData);
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`transition-all duration-300 ${selectedCustomer ? 'w-1/2' : 'w-full'} p-6`}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-indigo-600" />
            Customer Intelligence
          </h1>
          <p className="text-gray-600 mt-1">Unified view of customer feedback and health</p>
        </div>

        {/* Stats */}
        <CustomerStats customers={customers} feedback={feedback} loading={loading} />

        {/* Search */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search customers by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Customer List */}
        <CustomerList
          customers={filteredCustomers}
          loading={loading}
          onSelectCustomer={setSelectedCustomer}
          selectedId={selectedCustomer?.id}
        />
      </div>

      {/* Customer Detail Sidebar */}
      {selectedCustomer && (
        <div className="w-1/2 border-l border-gray-200 bg-white">
          <CustomerDetail
            customer={selectedCustomer}
            feedback={feedback.filter(f => f.customer_email === selectedCustomer.email)}
            onClose={() => setSelectedCustomer(null)}
            onUpdate={loadData}
          />
        </div>
      )}
    </div>
  );
}