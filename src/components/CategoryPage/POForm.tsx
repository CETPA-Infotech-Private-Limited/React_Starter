// components/POForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  Send,
  AlertCircle,
  FileText,
  ShoppingCart,
  Calendar,
  Building2,
  User,
  DollarSign,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { Category, PO, POFormData } from '@/types/types';

interface POFormProps {
  category: Category;
  contractNature: string;
  poList: PO[];
  onFormSubmit: (formData: POFormData) => void;
  onCancel?: () => void;
  initialData?: POFormData;
}

export const POForm: React.FC<POFormProps> = ({
  category,
  contractNature,
  poList,
  onFormSubmit,
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState<POFormData>(initialData || {
    poNumber: '',
    poDate: '',
    vendorName: '',
    vendorAddress: '',
    vendorPhone: '',
    vendorEmail: '',
    contractValue: 0,
    workDescription: '',
    startDate: '',
    endDate: '',
    department: '',
    officerName: '',
    remarks: ''
  });

  const [selectedPOId, setSelectedPOId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill form when PO is selected
  const handlePOSelect = (poId: string) => {
    setSelectedPOId(poId);
    const selectedPO = poList.find(po => po.id === poId);
    
    if (selectedPO) {
      setFormData(prev => ({
        ...prev,
        poNumber: selectedPO.poNumber,
        poDate: selectedPO.date || prev.poDate,
        vendorName: selectedPO.vendorName || prev.vendorName,
        vendorAddress: selectedPO.vendorAddress || prev.vendorAddress,
        vendorPhone: selectedPO.vendorPhone || prev.vendorPhone,
        vendorEmail: selectedPO.vendorEmail || prev.vendorEmail,
        contractValue: selectedPO.amount || prev.contractValue,
      }));
    }
  };

  const handleInputChange = (field: keyof POFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (category !== 'III') {
      if (!formData.poNumber) {
        setError('PO Number is required');
        return false;
      }
    }
    if (!formData.contractValue || formData.contractValue <= 0) {
      setError('Contract value must be greater than 0');
      return false;
    }
    if (!formData.vendorName) {
      setError('Vendor name is required');
      return false;
    }
    if (!formData.workDescription) {
      setError('Work description is required');
      return false;
    }
    if (!formData.department) {
      setError('Department is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onFormSubmit(formData);
    } catch (err) {
      setError('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialData || {
      poNumber: '',
      poDate: '',
      vendorName: '',
      vendorAddress: '',
      vendorPhone: '',
      vendorEmail: '',
      contractValue: 0,
      workDescription: '',
      startDate: '',
      endDate: '',
      department: '',
      officerName: '',
      remarks: ''
    });
    setSelectedPOId('');
    setError(null);
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {category === 'III' ? 'Contract Details' : 'Purchase Order Details'}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* PO Selection for Category I & II */}
          {category !== 'III' && poList.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Select Purchase Order
              </h4>
              <div className="max-w-md">
                <Select value={selectedPOId} onValueChange={handlePOSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a purchase order to auto-fill" />
                  </SelectTrigger>
                  <SelectContent>
                    {poList.map((po) => (
                      <SelectItem key={po.id} value={po.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{po.poNumber}</span>
                          {po.vendorName && (
                            <span className="text-xs text-slate-500 ml-2">- {po.vendorName}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedPOId && (
                <p className="text-xs text-blue-600">
                  Form fields have been auto-filled from the selected PO. Please review and update as needed.
                </p>
              )}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-2">
              <FileText className="w-4 h-4" />
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700">
                  {category === 'III' ? 'Contract Number' : 'PO Number'} *
                </Label>
                <Input
                  value={formData.poNumber}
                  onChange={(e) => handleInputChange('poNumber', e.target.value)}
                  className="border-slate-200"
                  placeholder={category === 'III' ? 'Enter contract number' : 'Enter PO number'}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Date *</Label>
                <Input
                  type="date"
                  value={formData.poDate}
                  onChange={(e) => handleInputChange('poDate', e.target.value)}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Contract Value (₹) *
                </Label>
                <Input
                  type="number"
                  value={formData.contractValue || ''}
                  onChange={(e) => handleInputChange('contractValue', parseFloat(e.target.value) || 0)}
                  className="border-slate-200"
                  placeholder="Enter amount"
                />
              </div>
            </div>
          </div>

          {/* Vendor Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Building2 className="w-4 h-4" />
              Vendor Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700">Vendor Name *</Label>
                <Input
                  value={formData.vendorName}
                  onChange={(e) => handleInputChange('vendorName', e.target.value)}
                  className="border-slate-200"
                  placeholder="Enter vendor name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Email
                </Label>
                <Input
                  type="email"
                  value={formData.vendorEmail}
                  onChange={(e) => handleInputChange('vendorEmail', e.target.value)}
                  className="border-slate-200"
                  placeholder="vendor@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Phone
                </Label>
                <Input
                  value={formData.vendorPhone}
                  onChange={(e) => handleInputChange('vendorPhone', e.target.value)}
                  className="border-slate-200"
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Address
                </Label>
                <Input
                  value={formData.vendorAddress}
                  onChange={(e) => handleInputChange('vendorAddress', e.target.value)}
                  className="border-slate-200"
                  placeholder="Enter complete address"
                />
              </div>
            </div>
          </div>

          {/* Work Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Calendar className="w-4 h-4" />
              Work Details
            </h4>
            <div className="space-y-2">
              <Label className="text-slate-700">Work Description *</Label>
              <Textarea
                value={formData.workDescription}
                onChange={(e) => handleInputChange('workDescription', e.target.value)}
                className="border-slate-200 min-h-[100px]"
                placeholder="Provide detailed description of work to be performed..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700">Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Department *</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="border-slate-200"
                  placeholder="Enter department name"
                />
              </div>
            </div>
          </div>

          {/* Officer Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-2">
              <User className="w-4 h-4" />
              Responsible Officer
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700">Officer Name</Label>
                <Input
                  value={formData.officerName}
                  onChange={(e) => handleInputChange('officerName', e.target.value)}
                  className="border-slate-200"
                  placeholder="Enter officer name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Remarks</Label>
                <Textarea
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  className="border-slate-200"
                  placeholder="Additional remarks or notes..."
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
            >
              Reset
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="bg-blue-800 hover:bg-blue-900"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit to CVO
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};