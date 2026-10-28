import React, { useState } from 'react';
import { LoanApplication, ServiceInquiry, ApplicationStatus, Language } from '../../types';
import {
  Users,
  CreditCard,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  Download,
  Send,
  Building,
  Phone,
  Mail,
  MapPin,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from 'lucide-react';

interface AdminPanelProps {
  language: Language;
  applications: LoanApplication[];
  serviceInquiries: ServiceInquiry[];
  onUpdateApplicationStatus: (appId: string, newStatus: ApplicationStatus, remarks?: string) => void;
  onUpdateServiceStatus: (inqId: string, newStatus: 'open' | 'in_progress' | 'completed') => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  language,
  applications,
  serviceInquiries,
  onUpdateApplicationStatus,
  onUpdateServiceStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'loans' | 'services'>('loans');
  const [loanFilter, setLoanFilter] = useState<'all' | 'home' | 'personal' | 'business'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);

  // Status update message toast
  const [statusNotificationSent, setStatusNotificationSent] = useState<string | null>(null);

  // Filtering
  const filteredApps = applications.filter((app) => {
    const matchesLoan = loanFilter === 'all' || app.loanType === loanFilter;
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.includes(searchQuery);
    return matchesLoan && matchesStatus && matchesSearch;
  });

  // Calculate metrics
  const totalPipelineValue = applications.reduce((sum, app) => sum + app.amount, 0);
  const approvedCount = applications.filter((a) => a.status === 'approved' || a.status === 'disbursed').length;
  const pendingDocsCount = applications.filter((a) => a.status === 'docs_required' || !a.uploadedDocs.bankStatement).length;

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    if (!selectedApp) return;
    const remark = `Status updated to ${newStatus.toUpperCase()} by J S Financial Admin`;
    onUpdateApplicationStatus(selectedApp.id, newStatus, remark);

    // Update local drawer state
    setSelectedApp({ ...selectedApp, status: newStatus, remarks: remark });

    setStatusNotificationSent(`WhatsApp & SMS notice dispatched to ${selectedApp.phone}`);
    setTimeout(() => setStatusNotificationSent(null), 4000);
  };

  const handleExportCSV = () => {
    const headers = 'ApplicationNo,Name,Phone,LoanType,Amount,TenureYears,MonthlyIncome,CIBIL,Status,Date\n';
    const rows = filteredApps
      .map(
        (a) =>
          `"${a.applicationNo}","${a.applicantName}","${a.phone}","${a.loanType}",${a.amount},${a.tenureYears},${a.monthlyIncome},${a.cibilScore || 'N/A'},"${a.status}","${a.appliedDate}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JS_Financial_Loan_Leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="w-full py-6 px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
            <Building className="w-4 h-4" />
            <span>DSA Partner & Operations Console</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">J S Financial Service Admin</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {language === 'hinglish' ? 'Admin Management & Lead CRM' : 'Admin & Lead Management Portal'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {language === 'hinglish'
              ? 'Loan applications verify karein, bank sanction status badlein aur customer ko WhatsApp update bhejein.'
              : 'Review loan pipeline, verify KYC documents, and coordinate with lending partners.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Leads CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Total Loan Pipeline</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              ₹{(totalPipelineValue / 10000000).toFixed(2)} Cr
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            Across {applications.length} Active Inquiries
          </span>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Approved & Disbursed</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
              {approvedCount}
            </span>
            <span className="text-xs text-slate-400">/ {applications.length} files</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Sanction Success Rate: 78%</span>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Action Required (Docs)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
              {pendingDocsCount}
            </span>
            <span className="text-xs text-slate-400">pending KYC</span>
          </div>
          <span className="text-[11px] text-amber-400/80 mt-1 block">Requires customer follow-up</span>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Insurance & Citizen Tickets</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-400 font-mono tabular-nums">
              {serviceInquiries.length}
            </span>
            <span className="text-xs text-slate-400">inquiries</span>
          </div>
          <span className="text-[11px] text-purple-300 mt-1 block">PAN & EPF assistance open</span>
        </div>
      </div>

      {/* Main Tabs (Loans CRM vs Insurance & Govt Tickets) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('loans')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'loans'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Loan Applications ({applications.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'services'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Insurance & Govt Seva Tickets ({serviceInquiries.length})</span>
        </button>
      </div>

      {/* LOANS TAB CONTENT */}
      {activeTab === 'loans' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Type:
              </span>
              {(['all', 'home', 'personal', 'business'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setLoanFilter(t)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                    loanFilter === t
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t === 'all' ? 'All Loans' : t.toUpperCase()}
                </button>
              ))}

              <span className="text-xs text-slate-400 ml-2">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="docs_required">Docs Required</option>
                <option value="approved">Approved</option>
                <option value="disbursed">Disbursed</option>
              </select>
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ref no, phone..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Application ID</th>
                    <th className="py-3 px-4">Applicant & Contact</th>
                    <th className="py-3 px-4">Loan Details</th>
                    <th className="py-3 px-4">Monthly Income</th>
                    <th className="py-3 px-4">CIBIL Score</th>
                    <th className="py-3 px-4">KYC Status</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredApps.map((app) => {
                    const statusColor =
                      app.status === 'approved' || app.status === 'disbursed'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                        : app.status === 'docs_required'
                        ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                        : 'text-blue-400 bg-blue-500/10 border-blue-500/30';

                    const allDocsReady =
                      app.uploadedDocs.panCard &&
                      app.uploadedDocs.aadhaarCard &&
                      app.uploadedDocs.bankStatement;

                    return (
                      <tr key={app.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-emerald-400 whitespace-nowrap">
                          {app.applicationNo}
                          <span className="block text-[10px] text-slate-500 font-sans">{app.appliedDate}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-white">{app.applicantName}</p>
                          <p className="text-[11px] text-slate-400">{app.phone} · {app.city}</p>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <p className="font-bold text-white font-mono tabular-nums">
                            ₹{app.amount.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {app.loanType.toUpperCase()} ({app.tenureYears} Yrs)
                          </p>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono tabular-nums">
                          ₹{app.monthlyIncome.toLocaleString('en-IN')}/mo
                          <span className="block text-[10px] text-slate-500 capitalize">{app.employmentType.replace('_', ' ')}</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`font-mono font-bold ${app.cibilScore && app.cibilScore >= 750 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {app.cibilScore || '720+'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-[11px] ${allDocsReady ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {allDocsReady ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                            {allDocsReady ? 'Verified' : 'Docs Incomplete'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${statusColor}`}>
                            {app.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-3 py-1 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white rounded-lg font-medium transition-colors"
                          >
                            Review File
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SERVICES TAB CONTENT */}
      {activeTab === 'services' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white">Insurance Quotes & Sarkari Seva Requests</h3>
              <p className="text-xs text-slate-400">Incoming inquiries from mobile app users requiring advisor follow-up</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ticket No</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Service Required</th>
                  <th className="py-3 px-4">Details / Notes</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {serviceInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-mono text-purple-400">{inq.ticketNo}</td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {inq.customerName}
                      <span className="block text-[11px] text-slate-400 font-normal">{inq.phone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 uppercase">
                        {inq.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">{inq.subType}</td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{inq.details}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inq.status === 'completed'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : inq.status === 'in_progress'
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-blue-400 bg-blue-500/10'
                        }`}
                      >
                        {inq.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {inq.status !== 'completed' ? (
                        <button
                          onClick={() => onUpdateServiceStatus(inq.id, 'completed')}
                          className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 rounded-lg transition-colors font-medium text-[11px]"
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* APPLICATION REVIEW DRAWER / MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-emerald-400">{selectedApp.applicationNo}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedApp.applicantName}</h3>
                <p className="text-xs text-slate-400">{selectedApp.phone} · {selectedApp.email} · {selectedApp.city}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Notification alert banner */}
            {statusNotificationSent && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-700 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{statusNotificationSent}</span>
              </div>
            )}

            {/* Financial Overview */}
            <div className="grid grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-500 block">Requested Amount</span>
                <span className="text-base font-bold text-white font-mono">₹{selectedApp.amount.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Tenure / Loan Type</span>
                <span className="text-sm font-semibold text-slate-200">{selectedApp.tenureYears} Yrs · {selectedApp.loanType.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">CIBIL & Monthly Income</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{selectedApp.cibilScore || 750} Score · ₹{(selectedApp.monthlyIncome / 1000).toFixed(0)}k/mo</span>
              </div>
            </div>

            {/* Document Checklist */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">KYC & Financial Documents</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`p-2.5 rounded-xl border flex items-center justify-between ${selectedApp.uploadedDocs.panCard ? 'bg-slate-800/80 border-slate-700 text-emerald-300' : 'bg-red-950/20 border-red-800/50 text-red-400'}`}>
                  <span>PAN Card Copy</span>
                  <span>{selectedApp.uploadedDocs.panCard ? 'Verified ✓' : 'Missing ✗'}</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center justify-between ${selectedApp.uploadedDocs.aadhaarCard ? 'bg-slate-800/80 border-slate-700 text-emerald-300' : 'bg-red-950/20 border-red-800/50 text-red-400'}`}>
                  <span>Aadhaar (Front & Back)</span>
                  <span>{selectedApp.uploadedDocs.aadhaarCard ? 'Verified ✓' : 'Missing ✗'}</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center justify-between ${selectedApp.uploadedDocs.salarySlipsOrITR ? 'bg-slate-800/80 border-slate-700 text-emerald-300' : 'bg-amber-950/20 border-amber-800/50 text-amber-400'}`}>
                  <span>Income Proof (ITR/Salary)</span>
                  <span>{selectedApp.uploadedDocs.salarySlipsOrITR ? 'Uploaded ✓' : 'Action Needed'}</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center justify-between ${selectedApp.uploadedDocs.bankStatement ? 'bg-slate-800/80 border-slate-700 text-emerald-300' : 'bg-amber-950/20 border-amber-800/50 text-amber-400'}`}>
                  <span>6 Mo Bank Statement</span>
                  <span>{selectedApp.uploadedDocs.bankStatement ? 'Verified ✓' : 'Pending Upload'}</span>
                </div>
              </div>
            </div>

            {/* Underwriting Actions */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Update Sanction Status</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleStatusChange('under_review')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors ${
                    selectedApp.status === 'under_review'
                      ? 'bg-blue-500 text-slate-950 border-blue-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  Under Review
                </button>
                <button
                  onClick={() => handleStatusChange('docs_required')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors ${
                    selectedApp.status === 'docs_required'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  Request Docs
                </button>
                <button
                  onClick={() => handleStatusChange('approved')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors ${
                    selectedApp.status === 'approved'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  Approve Loan
                </button>
                <button
                  onClick={() => handleStatusChange('disbursed')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors ${
                    selectedApp.status === 'disbursed'
                      ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  Disburse Funds
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
