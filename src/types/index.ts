export type Language = 'en' | 'hinglish';

export type AppViewMode = 'mobile' | 'admin' | 'scope' | 'estimator';

export type LoanType = 'home' | 'personal' | 'business' | 'property' | 'gold';

export type InsuranceType = 'life' | 'health' | 'motor';

export type GovtServiceType = 'pan_new' | 'pan_correction' | 'pan_aadhaar_link' | 'epf_passbook' | 'epf_withdrawal' | 'epf_uan_activation';

export type ApplicationStatus = 'submitted' | 'under_review' | 'docs_required' | 'approved' | 'disbursed' | 'rejected';

export interface LoanApplication {
  id: string;
  applicationNo: string;
  applicantName: string;
  phone: string;
  email: string;
  city: string;
  loanType: LoanType;
  amount: number;
  tenureYears: number;
  monthlyIncome: number;
  employmentType: 'salaried' | 'self_employed' | 'business_owner';
  cibilScore?: number;
  status: ApplicationStatus;
  appliedDate: string;
  remarks?: string;
  uploadedDocs: {
    panCard: boolean;
    aadhaarCard: boolean;
    salarySlipsOrITR: boolean;
    bankStatement: boolean;
  };
}

export interface ServiceInquiry {
  id: string;
  ticketNo: string;
  customerName: string;
  phone: string;
  category: 'insurance' | 'govt_pan' | 'govt_epf';
  subType: string;
  details: string;
  status: 'open' | 'in_progress' | 'completed';
  date: string;
}

export interface ModuleEstimate {
  id: string;
  name: string;
  nameHinglish: string;
  description: string;
  hours: number;
  costINR: number;
  costUSD: number;
  selected: boolean;
  category: 'core_mobile' | 'backend_admin' | 'integrations' | 'testing_devops';
}

export interface TechStackOption {
  category: 'frontend' | 'backend' | 'database' | 'cloud';
  name: string;
  rating: number;
  recommended: boolean;
  pros: string[];
  cons: string[];
  bestFor: string;
  estimatedCostFactor: string;
}
