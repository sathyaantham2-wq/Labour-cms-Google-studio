
export enum CaseStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
  PENDING = 'Pending'
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

export type ViewType = 'portal' | 'login' | 'dashboard' | 'create' | 'details' | 'notice' | 'settings';
