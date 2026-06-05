'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Cpu, 
  Building2, 
  CheckCircle,
  Globe2,
  Lock,
  User,
  Key,
  Mail,
  FileCode,
  LayoutGrid,
  Monitor,
  Database,
  Sliders
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

export default function CompanySetup() {
  const [activeModules, setActiveModules] = useState<string[]>([]);
  const [licenseStatus, setLicenseStatus] = useState<string>('Verifying...');
  const [tenantName, setTenantName] = useState<string>('acme-corp');
  
  // Tab control state
  const [activeTab, setActiveTab] = useState('Details');
  const tabs = ['Details', 'Login', 'Password', 'Email', 'Files', 'App', 'Display', 'Backups', 'Advanced'];

  // Details Tab settings state
  const [country, setCountry] = useState('Philippines');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Asia/Manila');
  const [currency, setCurrency] = useState('PHP');
  const [enableOnboarding, setEnableOnboarding] = useState(true);
  const [disableDocSharing, setDisableDocSharing] = useState(false);
  const [floatPrecision, setFloatPrecision] = useState('3');
  const [currencyPrecision, setCurrencyPrecision] = useState('2');
  const [roundingMethod, setRoundingMethod] = useState("Banker's Rounding");
  const [showAbsoluteDatetime, setShowAbsoluteDatetime] = useState(false);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState('Sunday');
  const [applyStrictPermissions, setApplyStrictPermissions] = useState(false);
  const [showExternalWarning, setShowExternalWarning] = useState('All External Links');

  // Other Tabs settings state
  const [allowGoogleLogin, setAllowGoogleLogin] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('3600');
  const [minPasswordLength, setMinPasswordLength] = useState('8');
  const [smtpServer, setSmtpServer] = useState('smtp.atomic-hr.com');
  const [maxFileSize, setMaxFileSize] = useState('10MB');

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/system/license')
      .then(res => res.json())
      .then(data => {
        if (data.activeModules) {
          setActiveModules(data.activeModules);
          setLicenseStatus('Verified & Active');
          if (data.tenant) setTenantName(data.tenant);
        } else {
          setLicenseStatus('Invalid License');
        }
      })
      .catch(() => {
        setLicenseStatus('Failed to retrieve license info');
      });
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 font-sans pb-12">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white border-b border-slate-200 px-6 py-2.5 shadow-xs">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center justify-center w-7 h-7 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
            <Settings className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Link href="/" className="hover:text-slate-800">Atomic HR</Link>
            <span className="text-slate-350">/</span>
            <span className="text-slate-800">Core Setup</span>
          </div>
        </div>

        {/* Account widget / Nav Links */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <Link href="/core" className="text-indigo-600">Core Setup</Link>
            <Link href="/hris" className="hover:text-slate-800">HRIS</Link>
            <Link href="/timekeeping" className="hover:text-slate-800">Timekeeping</Link>
            <Link href="/payroll" className="hover:text-slate-800">Payroll</Link>
          </nav>
          
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Title & Short Description */}
      <div className="w-full px-6 mt-6 flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Settings</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage global configuration setups and user permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Saved
            </span>
          )}
          <Button 
            onClick={handleSaveSettings} 
            className="bg-slate-900 hover:bg-slate-850 text-white font-semibold text-xs px-4 h-8 rounded-lg shadow-xs transition-all active:scale-95"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Tabs Menu List */}
      <div className="w-full px-6 bg-white border-b border-slate-200 flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === tab 
                ? 'text-slate-900 border-indigo-650 font-bold' 
                : 'text-slate-400 border-transparent hover:text-slate-650'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="w-full px-6 mt-6">
        <form onSubmit={handleSaveSettings} className="space-y-6">
          
          {/* DETAILS TAB */}
          {activeTab === 'Details' && (
            <div className="space-y-6 max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Fields */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="country" className="text-xs text-slate-600 font-semibold">Country</Label>
                    <Input 
                      id="country" 
                      value={country} 
                      onChange={(e) => setCountry(e.target.value)} 
                      className="bg-slate-50 border-slate-250 text-xs py-1 h-8 text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="language" className="text-xs text-slate-600 font-semibold">Language</Label>
                    <Select value={language} onValueChange={(val) => setLanguage(val || 'en')}>
                      <SelectTrigger className="bg-slate-50 border-slate-250 text-xs h-8 focus:bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-xs text-slate-700">
                        <SelectItem value="en">English (en)</SelectItem>
                        <SelectItem value="fr">Français (fr)</SelectItem>
                        <SelectItem value="fil">Filipino (fil)</SelectItem>
                        <SelectItem value="es">Español (es)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="first-day" className="text-xs text-slate-600 font-semibold">First Day of the Week</Label>
                    <Select value={firstDayOfWeek} onValueChange={(val) => setFirstDayOfWeek(val || 'Sunday')}>
                      <SelectTrigger className="bg-slate-50 border-slate-250 text-xs h-8"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-xs text-slate-700">
                        <SelectItem value="Sunday">Sunday</SelectItem>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Fields */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="timezone" className="text-xs text-slate-600 font-semibold">Time Zone</Label>
                    <Select value={timezone} onValueChange={(val) => setTimezone(val || 'Asia/Manila')}>
                      <SelectTrigger className="bg-slate-50 border-slate-250 text-xs h-8"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-xs text-slate-700">
                        <SelectItem value="Asia/Manila">Asia/Manila</SelectItem>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                        <SelectItem value="Asia/Singapore">Asia/Singapore</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="currency" className="text-xs text-slate-600 font-semibold">Currency</Label>
                    <Select value={currency} onValueChange={(val) => setCurrency(val || 'PHP')}>
                      <SelectTrigger className="bg-slate-50 border-slate-250 text-xs h-8"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-xs text-slate-700">
                        <SelectItem value="PHP">Philippine Peso (₱)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="SGD">Singapore Dollar (S$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="enable-onboarding" 
                        checked={enableOnboarding} 
                        onChange={(e) => setEnableOnboarding(e.target.checked)} 
                        className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-650 w-3.5 h-3.5 cursor-pointer"
                      />
                      <Label htmlFor="enable-onboarding" className="text-xs text-slate-700 cursor-pointer font-medium">Enable Onboarding</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="disable-doc-sharing" 
                        checked={disableDocSharing} 
                        onChange={(e) => setDisableDocSharing(e.target.checked)} 
                        className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-650 w-3.5 h-3.5 cursor-pointer"
                      />
                      <Label htmlFor="disable-doc-sharing" className="text-xs text-slate-700 cursor-pointer font-medium">Disable Document Sharing</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Number and Rounding Settings section */}
              <div className="border-t border-slate-100 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Fields */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="float-precision" className="text-xs text-slate-600 font-semibold">Float Precision</Label>
                      <Select value={floatPrecision} onValueChange={(val) => setFloatPrecision(val || '3')}>
                        <SelectTrigger className="bg-slate-50 border-slate-250 text-xs h-8"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-xs text-slate-700">
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Right Fields */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="currency-precision" className="text-xs text-slate-600 font-semibold">Currency Precision</Label>
                      <Select value={currencyPrecision} onValueChange={(val) => setCurrencyPrecision(val || '2')}>
                        <SelectTrigger className="bg-slate-50 border-slate-250 text-xs h-8"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-xs text-slate-700">
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-[10px] text-slate-400 block mt-0.5">If not set, the currency precision will depend on number format</span>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="rounding-method" className="text-xs text-slate-600 font-semibold">Rounding Method</Label>
                      <Select value={roundingMethod} onValueChange={(val) => setRoundingMethod(val || "Banker's Rounding")}>
                        <SelectTrigger className="bg-slate-50 border-slate-250 text-xs h-8"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-xs text-slate-700">
                          <SelectItem value="Banker's Rounding">Banker's Rounding</SelectItem>
                          <SelectItem value="Round Up">Round Up</SelectItem>
                          <SelectItem value="Round Down">Round Down</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input 
                        type="checkbox" 
                        id="show-absolute-datetime" 
                        checked={showAbsoluteDatetime} 
                        onChange={(e) => setShowAbsoluteDatetime(e.target.checked)} 
                        className="rounded border-slate-300 text-indigo-650 w-3.5 h-3.5 cursor-pointer"
                      />
                      <Label htmlFor="show-absolute-datetime" className="text-xs text-slate-700 cursor-pointer font-medium">Show Absolute Datetime in Timeline</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions Section */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        id="apply-strict" 
                        checked={applyStrictPermissions} 
                        onChange={(e) => setApplyStrictPermissions(e.target.checked)} 
                        className="rounded border-slate-300 text-indigo-650 w-3.5 h-3.5 mt-0.5 cursor-pointer"
                      />
                      <div>
                        <Label htmlFor="apply-strict" className="text-xs text-slate-700 cursor-pointer font-semibold block">Apply Strict User Permissions</Label>
                        <span className="text-[10px] text-slate-400 block mt-0.5">If Apply Strict User Permission is checked and User Permission is defined for a DocType for a User, then all the documents where value of the link is blank, will not be shown to that User</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="external-warning" className="text-xs text-slate-600 font-semibold">Show External Link Warning</Label>
                    <Select value={showExternalWarning} onValueChange={(val) => setShowExternalWarning(val || 'All External Links')}>
                      <SelectTrigger className="bg-slate-50 border-slate-250 text-xs h-8"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-xs text-slate-700">
                        <SelectItem value="All External Links">All External Links</SelectItem>
                        <SelectItem value="Only Unverified Links">Only Unverified Links</SelectItem>
                        <SelectItem value="Disable Warning">Disable Warning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* License cryptographical panel */}
              <div className="border-t border-slate-200 pt-6">
                <Card className="bg-white border-slate-200 shadow-2xs">
                  <CardHeader className="border-b border-slate-100 bg-slate-50/40">
                    <CardTitle className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-650" />
                      Active Tenant License Binding
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 text-xs space-y-2">
                    <p>Tenant Registration: <strong>{tenantName}</strong> • License State: <span className="text-emerald-600 font-semibold">{licenseStatus}</span></p>
                    <p className="text-slate-400 text-[10px]">Cryptographically authenticated modules: {activeModules.join(', ') || 'HRIS Core'}</p>
                  </CardContent>
                </Card>
              </div>

            </div>
          )}

          {/* LOGIN TAB */}
          {activeTab === 'Login' && (
            <div className="space-y-6 max-w-5xl">
              <Card className="bg-white border-slate-200 shadow-2xs">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-650" />
                    Authentication Settings
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">Configure global portal access requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="google-login" 
                      checked={allowGoogleLogin} 
                      onChange={(e) => setAllowGoogleLogin(e.target.checked)} 
                      className="rounded border-slate-300 text-indigo-650 w-3.5 h-3.5 cursor-pointer"
                    />
                    <Label htmlFor="google-login" className="text-xs text-slate-700 cursor-pointer">Allow Social Authentication (Google OAuth)</Label>
                  </div>

                  <div className="space-y-1 max-w-xs">
                    <Label htmlFor="session-timeout" className="text-xs text-slate-600 font-semibold">Session Timeout (seconds)</Label>
                    <Input 
                      id="session-timeout" 
                      value={sessionTimeout} 
                      onChange={(e) => setSessionTimeout(e.target.value)} 
                      className="bg-slate-50 border-slate-250 text-xs py-1 h-8 text-slate-900"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PASSWORD TAB */}
          {activeTab === 'Password' && (
            <div className="space-y-6 max-w-5xl">
              <Card className="bg-white border-slate-200 shadow-2xs">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Key className="w-4 h-4 text-indigo-650" />
                    Password Safety Regulations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1 max-w-xs">
                    <Label htmlFor="min-pwd-len" className="text-xs text-slate-600 font-semibold">Minimum Password Length</Label>
                    <Input 
                      id="min-pwd-len" 
                      type="number"
                      value={minPasswordLength} 
                      onChange={(e) => setMinPasswordLength(e.target.value)} 
                      className="bg-slate-50 border-slate-250 text-xs py-1 h-8 text-slate-900"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* EMAIL TAB */}
          {activeTab === 'Email' && (
            <div className="space-y-6 max-w-5xl">
              <Card className="bg-white border-slate-200 shadow-2xs">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-650" />
                    Outgoing Email SMTP Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1 max-w-md">
                    <Label htmlFor="smtp-server" className="text-xs text-slate-600 font-semibold">SMTP Host Server</Label>
                    <Input 
                      id="smtp-server" 
                      value={smtpServer} 
                      onChange={(e) => setSmtpServer(e.target.value)} 
                      className="bg-slate-50 border-slate-250 text-xs py-1 h-8 text-slate-900"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* FILES TAB */}
          {activeTab === 'Files' && (
            <div className="space-y-6 max-w-5xl">
              <Card className="bg-white border-slate-200 shadow-2xs">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-650" />
                    Storage & Attachment Limits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1 max-w-xs">
                    <Label htmlFor="max-file-sz" className="text-xs text-slate-600 font-semibold">Max Attachment File Size</Label>
                    <Input 
                      id="max-file-sz" 
                      value={maxFileSize} 
                      onChange={(e) => setMaxFileSize(e.target.value)} 
                      className="bg-slate-50 border-slate-250 text-xs py-1 h-8 text-slate-900"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PLACEHOLDER TABS */}
          {['App', 'Display', 'Backups', 'Advanced'].includes(activeTab) && (
            <div className="max-w-5xl">
              <Card className="bg-white border-slate-200 shadow-2xs p-8 text-center">
                <Sliders className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-800">{activeTab} Parameters</h4>
                <p className="text-xs text-slate-400 mt-1">Configure premium modular dashboard setups for {activeTab.toLowerCase()} bindings.</p>
              </Card>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
