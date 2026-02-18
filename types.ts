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
  receivedFrom: string; // Source of the representation
  section: string;
  
  applicantName: string;
  applicantPhones: string[];
  applicantEmail: string;
  applicantAddress: string;
  
  managementName: string;
  managementPerson: string;
  managementPhones: string[]; // Updated to array
  managementEmail: string;
  managementAddress: string;
  
  subject: string;
  caseNotes?: string; // Internal tracking
  amountRecovered: number;
  status: CaseStatus;
  
  hearings: Hearing[];
  createdAt: string;
}

export type ViewType = 'portal' | 'login' | 'dashboard' | 'create' | 'details' | 'notice' | 'settings';