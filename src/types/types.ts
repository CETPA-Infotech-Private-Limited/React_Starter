import { UserRole } from './auth';

export interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  roles: UserRole[];
}

export interface ContractNature {
  id: string;
  label: string;
  value: string;
  description?: string;
}

export interface PO {
  id: string;
  poNumber: string;
  value: string;
  vendorName?: string;
  amount?: number;
  date?: string;
  vendorAddress?: string;
  vendorPhone?: string;
  vendorEmail?: string;
}

export type Category = 'I' | 'II' | 'III';
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';
export type WorkflowStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface POFormData {
  id?: string;
  poNumber: string;
  poDate: string;
  vendorName: string;
  vendorAddress: string;
  vendorPhone: string;
  vendorEmail: string;
  contractValue: number;
  workDescription: string;
  startDate: string;
  endDate: string;
  department: string;
  officerName: string;
  remarks: string;
  status?: WorkflowStatus;
  submittedAt?: string;
}

export interface FormData {
  quarter: Quarter | '';
  year: string;
  category: Category;
  contractNature: string;
}

export interface ReportWorkflow {
  status: WorkflowStatus;
  submittedAt?: string;
  submittedBy?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  remarks?: string;
}

export interface QuarterlyFormEntry {
  id: string;
  sno: number;
  nameOfWork: string;
  location: string;
  estimatedCostLacs: number;
  tenderedCostLacs: number;
  percentageAboveBelowSOR: number;
  agmtLOANo: string;
  agency: string;
  dateOfStart: string;
  timeOfCompletion: string;
  physicalProgress: string;
  engineerInCharge: string;
  remarks: string;
  status?: WorkflowStatus;
  submittedAt?: string;
}

export interface ReportWorkflow {
  status: WorkflowStatus;
  submittedAt?: string;
  submittedBy?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  remarks?: string;
}