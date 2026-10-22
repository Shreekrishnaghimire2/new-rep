export type Language = 'en' | 'ne';

export type PageId = 'home' | 'services' | 'products' | 'projects' | 'process' | 'about' | 'contact' | 'admin';

export type ServiceCategory = 'all' | 'web' | 'ai' | 'custom';

export interface ServiceItem {
  id: string;
  category: 'web' | 'ai' | 'custom';
  icon: string;
  title: string;
  nepaliTitle: string;
  description: string;
  nepaliDescription: string;
  businessBenefit: string;
  nepaliBusinessBenefit: string;
  deliverables: string[];
  nepaliDeliverables: string[];
  readiness: 'available' | 'custom_engagement';
}

export interface ProjectItem {
  id: string;
  title: string;
  nepaliTitle: string;
  category: string;
  nepaliCategory: string;
  badge: string;
  nepaliBadge: string;
  problem: string;
  nepaliProblem: string;
  solution: string;
  nepaliSolution: string;
  technologies: string[];
  outcomes: string[];
  nepaliOutcomes: string[];
  demoType: 'interactive' | 'architecture';
  interactiveDemoId: 'logistics' | 'invoice' | 'corporate';
}

export interface ProcessStep {
  stepNumber: string;
  title: string;
  nepaliTitle: string;
  description: string;
  nepaliDescription: string;
  deliverable: string;
  nepaliDeliverable: string;
}

export interface InquirySubmission {
  name: string;
  email: string;
  description: string;
  serviceCategory?: string;
  budgetRange?: string;
  expectedTimeline?: string;
  website_honeypot?: string;
}

export type InquiryStatus = 'received' | 'in_review' | 'contacted' | 'completed' | 'archived';

export interface InquiryNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface AdminInquiry {
  id: string;
  name: string;
  email: string;
  description: string;
  serviceCategory?: string;
  budgetRange?: string;
  expectedTimeline?: string;
  submittedAt: string;
  updatedAt?: string;
  status: InquiryStatus;
  clientIp?: string;
  notes?: InquiryNote[];
}

export interface VerifiedInquiryResponse {
  success: boolean;
  inquiryId: string;
  message: string;
  inquiry?: {
    id: string;
    name: string;
    email: string;
    serviceCategory?: string;
    submittedAt: string;
    status: string;
  };
}
