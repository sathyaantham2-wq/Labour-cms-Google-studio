
export enum CaseStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
  PENDING = 'Pending',
  ARCHIVED = 'Archived'
}

export interface Hearing {
  id: string;
  date: string;
  remarks: string;
  isCompleted: boolean;
}

export interface LaborCase {
  id: string;
  fileNumber: string; // Format: A/0000/202X
  receivedDate: string;
  section: string;
  
  applicantName: string;
  applicantPhones: string[];
  applicantEmail: string;
  applicantAddress: string;
  
  managementName: string;
  managementPerson: string;
  managementPhone: string;
  managementEmail: string;
  managementAddress: string;
  
  subject: string;
  amountRecovered: number;
  status: CaseStatus;
  
  hearings: Hearing[];
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'officer' | 'viewer';
  createdAt: string;
}

export interface Attachment {
  id: string;
  caseId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: number;
  username: string;
  diff: string;
}

export interface ReportSummary {
  totalCases: number;
  openCases: number;
  pendingCases: number;
  closedCases: number;
  archivedCases: number;
  totalAmount: number;
  bySection: { section: string; count: number }[];
  monthly: { month: string; count: number }[];
}

export type ViewType = 'portal' | 'login' | 'dashboard' | 'create' | 'details' | 'notice' | 'settings' | 'users' | 'reports';
