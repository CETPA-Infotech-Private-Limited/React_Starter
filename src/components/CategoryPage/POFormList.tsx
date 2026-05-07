// components/POFormList.tsx
"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  User,
  MapPin,
} from 'lucide-react';
import { POFormData } from '@/types/types';

interface POFormListProps {
  forms: POFormData[];
  expandedForms: Set<string>;
  onToggleExpand: (formId: string) => void;
  categoryBadgeColor: string;
}

const getStatusBadge = (status?: string) => {
  const statusConfig = {
    submitted: { color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Send, label: 'SUBMITTED' },
    under_review: { color: 'bg-amber-100 text-amber-700 border-amber-300', icon: Clock, label: 'UNDER REVIEW' },
    approved: { color: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: CheckCircle2, label: 'APPROVED' },
    rejected: { color: 'bg-red-100 text-red-700 border-red-300', icon: AlertCircle, label: 'REJECTED' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.submitted;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1 px-2 py-0.5`}>
      <Icon className="w-3 h-3" />
      <span className="text-xs">{config.label}</span>
    </Badge>
  );
};

export const POFormList: React.FC<POFormListProps> = ({
  forms,
  expandedForms,
  onToggleExpand,
  categoryBadgeColor
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Submitted Forms ({forms.length})
      </h3>

      <div className="space-y-3">
        {forms.map((form, index) => {
          const isExpanded = expandedForms.has(form.id || '');
          
          return (
            <Card key={form.id} className="border-slate-200 hover:border-slate-300 transition-colors">
              <CardContent className="p-4">
                {/* Header - Always Visible */}
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => onToggleExpand(form.id || '')}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-blue-800">
                          {form.poNumber || 'Contract Entry'}
                        </h4>
                        {getStatusBadge(form.status)}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {form.vendorName}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          ₹{form.contractValue.toLocaleString()}
                        </span>
                        {form.submittedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(form.submittedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-2">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-xs font-semibold text-slate-500 uppercase mb-2">Vendor Information</h5>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-600">Name:</span>
                            <span className="font-medium text-slate-800">{form.vendorName}</span>
                          </div>
                          {form.vendorAddress && (
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="w-3 h-3 text-slate-400 mt-0.5" />
                              <span className="text-slate-600">Address:</span>
                              <span className="font-medium text-slate-800">{form.vendorAddress}</span>
                            </div>
                          )}
                          {form.vendorEmail && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span className="text-slate-600">Email:</span>
                              <span className="font-medium text-slate-800">{form.vendorEmail}</span>
                            </div>
                          )}
                          {form.vendorPhone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span className="text-slate-600">Phone:</span>
                              <span className="font-medium text-slate-800">{form.vendorPhone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="text-xs font-semibold text-slate-500 uppercase mb-2">Work Details</h5>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-600">Period:</span>
                            <span className="font-medium text-slate-800">
                              {form.startDate || 'N/A'} - {form.endDate || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-600">Department:</span>
                            <span className="font-medium text-slate-800">{form.department}</span>
                          </div>
                          {form.officerName && (
                            <div className="flex items-center gap-2 text-sm">
                              <User className="w-3 h-3 text-slate-400" />
                              <span className="text-slate-600">Officer:</span>
                              <span className="font-medium text-slate-800">{form.officerName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs font-semibold text-slate-500 uppercase mb-2">Work Description</h5>
                      <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded">
                        {form.workDescription}
                      </p>
                    </div>

                    {form.remarks && (
                      <div>
                        <h5 className="text-xs font-semibold text-slate-500 uppercase mb-2">Remarks</h5>
                        <p className="text-sm text-slate-600">{form.remarks}</p>
                      </div>
                    )}

                    {form.submittedAt && (
                      <div className="text-xs text-slate-400">
                        Submitted on: {new Date(form.submittedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};