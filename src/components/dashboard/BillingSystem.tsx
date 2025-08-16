'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  CreditCard,
  FileText,
  Calendar,
  User,
  Clock,
  Download,
  Send,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Eye,
  Mail,
  Phone,
  MapPin,
  MoreVertical
} from 'lucide-react';

interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  paymentMethod?: 'card' | 'bank' | 'check' | 'cash';
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  sessionDate: string;
  duration: number;
  rate: number;
  amount: number;
}

interface PaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'card' | 'bank' | 'check' | 'cash';
  date: string;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
}

interface BillingStats {
  totalRevenue: number;
  monthlyRevenue: number;
  outstandingAmount: number;
  totalClients: number;
  averageSessionRate: number;
  collectionsRate: number;
}

interface BillingSystemProps {
  onBack?: () => void;
}

const BillingSystem: React.FC<BillingSystemProps> = ({ onBack }) => {
  const [view, setView] = useState<'overview' | 'invoices' | 'payments' | 'create' | 'edit'>('overview');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [stats, setStats] = useState<BillingStats | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        clientId: '1',
        clientName: 'Sarah Johnson',
        clientEmail: 'sarah.johnson@email.com',
        invoiceNumber: 'INV-2024-001',
        issueDate: '2024-01-01',
        dueDate: '2024-01-31',
        status: 'paid',
        items: [
          {
            id: '1',
            description: 'Individual Therapy Session',
            sessionDate: '2024-01-05',
            duration: 50,
            rate: 150,
            amount: 150
          },
          {
            id: '2',
            description: 'Individual Therapy Session',
            sessionDate: '2024-01-12',
            duration: 50,
            rate: 150,
            amount: 150
          },
          {
            id: '3',
            description: 'Individual Therapy Session',
            sessionDate: '2024-01-19',
            duration: 50,
            rate: 150,
            amount: 150
          },
          {
            id: '4',
            description: 'Individual Therapy Session',
            sessionDate: '2024-01-26',
            duration: 50,
            rate: 150,
            amount: 150
          }
        ],
        subtotal: 600,
        tax: 0,
        total: 600,
        notes: 'Monthly therapy sessions - January 2024',
        paymentMethod: 'card',
        paidDate: '2024-01-28',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-28T14:00:00Z'
      },
      {
        id: '2',
        clientId: '2',
        clientName: 'Michael Chen',
        clientEmail: 'michael.chen@email.com',
        invoiceNumber: 'INV-2024-002',
        issueDate: '2024-01-15',
        dueDate: '2024-02-14',
        status: 'sent',
        items: [
          {
            id: '5',
            description: 'Initial Assessment Session',
            sessionDate: '2024-01-15',
            duration: 60,
            rate: 200,
            amount: 200
          },
          {
            id: '6',
            description: 'Individual Therapy Session',
            sessionDate: '2024-01-22',
            duration: 45,
            rate: 150,
            amount: 150
          }
        ],
        subtotal: 350,
        tax: 0,
        total: 350,
        notes: 'Initial assessment and follow-up session',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '3',
        clientId: '3',
        clientName: 'Emily & David Wilson',
        clientEmail: 'emily.wilson@email.com',
        invoiceNumber: 'INV-2024-003',
        issueDate: '2024-01-10',
        dueDate: '2024-01-25',
        status: 'overdue',
        items: [
          {
            id: '7',
            description: 'Couple Therapy Session',
            sessionDate: '2024-01-10',
            duration: 60,
            rate: 200,
            amount: 200
          },
          {
            id: '8',
            description: 'Couple Therapy Session',
            sessionDate: '2024-01-17',
            duration: 60,
            rate: 200,
            amount: 200
          }
        ],
        subtotal: 400,
        tax: 0,
        total: 400,
        notes: 'Couple therapy sessions - Bi-weekly',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z'
      }
    ];

    const mockPayments: PaymentRecord[] = [
      {
        id: '1',
        invoiceId: '1',
        amount: 600,
        method: 'card',
        date: '2024-01-28',
        status: 'completed',
        reference: 'ch_1234567890'
      }
    ];

    const mockStats: BillingStats = {
      totalRevenue: 15420,
      monthlyRevenue: 2350,
      outstandingAmount: 750,
      totalClients: 12,
      averageSessionRate: 165,
      collectionsRate: 94.2
    };

    setInvoices(mockInvoices);
    setPayments(mockPayments);
    setStats(mockStats);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'viewed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && ['sent', 'viewed', 'draft'].includes(invoice.status)) ||
      (filter === 'paid' && invoice.status === 'paid') ||
      (filter === 'overdue' && invoice.status === 'overdue');
    
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (view === 'create') {
    return <InvoiceForm onCancel={() => setView('invoices')} onSave={() => setView('invoices')} />;
  }

  if (view === 'invoices') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-lg">Invoices</h1>
            <p className="subheading">Manage client invoices and billing</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('overview')}
              className="btn-secondary"
            >
              Back to Overview
            </button>
            <button
              onClick={() => setView('create')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Invoice
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Invoices</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
          
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-64"
            />
          </div>
        </div>

        {/* Invoices List */}
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="heading-sm">{invoice.invoiceNumber}</h3>
                      <p className="body-sm text-slate-600">{invoice.clientName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-slate-600">Amount</div>
                      <div className="font-semibold text-slate-900">{formatCurrency(invoice.total)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Issue Date</div>
                      <div className="font-medium text-slate-900">{new Date(invoice.issueDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Due Date</div>
                      <div className="font-medium text-slate-900">{new Date(invoice.dueDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Sessions</div>
                      <div className="font-medium text-slate-900">{invoice.items.length} sessions</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                    {invoice.paidDate && (
                      <span className="text-xs text-slate-600">
                        Paid on {new Date(invoice.paidDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="btn-ghost p-2" title="View Invoice">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="btn-ghost p-2" title="Download PDF">
                    <Download className="w-4 h-4" />
                  </button>
                  {invoice.status !== 'paid' && (
                    <button className="btn-ghost p-2" title="Send Invoice">
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                  <button className="btn-ghost p-2">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-lg">Billing & Payments</h1>
          <p className="subheading">Manage your practice revenue and client billing</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('invoices')}
            className="btn-secondary"
          >
            View All Invoices
          </button>
          <button
            onClick={() => setView('create')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Invoice
          </button>
          {onBack && (
            <button onClick={onBack} className="btn-ghost">
              Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="text-sm text-slate-600">Total Revenue</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {formatCurrency(stats.monthlyRevenue)}
            </div>
            <div className="text-sm text-slate-600">This Month</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-orange-600" />
              <TrendingDown className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {formatCurrency(stats.outstandingAmount)}
            </div>
            <div className="text-sm text-slate-600">Outstanding</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {stats.totalClients}
            </div>
            <div className="text-sm text-slate-600">Active Clients</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {formatCurrency(stats.averageSessionRate)}
            </div>
            <div className="text-sm text-slate-600">Avg. Session Rate</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {stats.collectionsRate}%
            </div>
            <div className="text-sm text-slate-600">Collection Rate</div>
          </div>
        </div>
      )}

      {/* Recent Invoices */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-md">Recent Invoices</h2>
          <button
            onClick={() => setView('invoices')}
            className="btn-ghost text-sm"
          >
            View All
          </button>
        </div>

        <div className="space-y-4">
          {invoices.slice(0, 5).map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">{invoice.invoiceNumber}</div>
                  <div className="text-sm text-slate-600">{invoice.clientName}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-semibold text-slate-900">{formatCurrency(invoice.total)}</div>
                  <div className="text-sm text-slate-600">Due {new Date(invoice.dueDate).toLocaleDateString()}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h2 className="heading-md mb-6">Payment Methods</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl">
            <CreditCard className="w-8 h-8 text-blue-600" />
            <div>
              <div className="font-medium text-slate-900">Credit Cards</div>
              <div className="text-sm text-slate-600">Stripe Integration</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div>
              <div className="font-medium text-slate-900">Bank Transfer</div>
              <div className="text-sm text-slate-600">ACH Payments</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl">
            <FileText className="w-8 h-8 text-purple-600" />
            <div>
              <div className="font-medium text-slate-900">Check</div>
              <div className="text-sm text-slate-600">Traditional Payment</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl">
            <DollarSign className="w-8 h-8 text-orange-600" />
            <div>
              <div className="font-medium text-slate-900">Cash</div>
              <div className="text-sm text-slate-600">In-Person Payment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Invoice Form Component
const InvoiceForm: React.FC<{
  onCancel: () => void;
  onSave: () => void;
  invoice?: Invoice;
}> = ({ onCancel, onSave, invoice }) => {
  const [formData, setFormData] = useState({
    clientName: invoice?.clientName || '',
    clientEmail: invoice?.clientEmail || '',
    issueDate: invoice?.issueDate || new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: invoice?.items || [],
    notes: invoice?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save the invoice
    console.log('Saving invoice:', formData);
    onSave();
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          id: Date.now().toString(),
          description: 'Individual Therapy Session',
          sessionDate: new Date().toISOString().split('T')[0],
          duration: 50,
          rate: 150,
          amount: 150
        }
      ]
    });
  };

  const removeItem = (id: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== id)
    });
  };

  const updateItem = (id: string, field: string, value: any) => {
    setFormData({
      ...formData,
      items: formData.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'duration' || field === 'rate') {
            updatedItem.amount = updatedItem.duration * (updatedItem.rate / 60);
          }
          return updatedItem;
        }
        return item;
      })
    });
  };

  const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = 0; // You can add tax calculation here
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-lg">
            {invoice ? 'Edit Invoice' : 'New Invoice'}
          </h1>
          <p className="subheading">Create a new invoice for client billing</p>
        </div>
        <button onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-slate-200 space-y-6">
        {/* Client Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-slate-900 mb-2">
              Client Name
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Client or couple name"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-slate-900 mb-2">
              Client Email
            </label>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="client@email.com"
              required
            />
          </div>
        </div>

        {/* Invoice Dates */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-slate-900 mb-2">
              Issue Date
            </label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-slate-900 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Invoice Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block font-medium text-slate-900">
              Sessions & Services
            </label>
            <button
              type="button"
              onClick={addItem}
              className="btn-secondary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-end p-4 border border-slate-200 rounded-xl">
                <div className="col-span-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={item.sessionDate}
                    onChange={(e) => updateItem(item.id, 'sessionDate', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={item.duration}
                    onChange={(e) => updateItem(item.id, 'duration', parseInt(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rate ($/hr)</label>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                  <div className="p-2 bg-slate-50 rounded-lg text-sm font-medium">
                    ${item.amount.toFixed(2)}
                  </div>
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="btn-ghost p-2 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 space-y-2 text-right">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block font-medium text-slate-900 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Additional notes or payment instructions"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {invoice ? 'Update Invoice' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingSystem;
