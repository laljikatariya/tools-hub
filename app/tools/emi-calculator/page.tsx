'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, RotateCcw, Download } from 'lucide-react';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { SEOContentSection } from '@/app/components/seo-content-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getSEOContent } from '@/lib/seo-content';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

type TenureMode = 'months' | 'years';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

function formatMoney(value: number) {
  return currencyFormatter.format(value);
}

function SliderField({
  label,
  helper,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
  presets,
}: {
  label: string;
  helper: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (value: number) => void;
  presets?: { label: string; value: number }[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-slate-800">{label}</label>
        <div className="relative flex items-center gap-2">
          {displayValue !== "" && <span className="text-sm font-medium text-slate-500">{displayValue}</span>}
          <Input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value) || 0)}
            className="h-10 w-32 rounded-lg border-slate-300 bg-slate-50/50 text-right font-semibold text-slate-900 shadow-sm focus-visible:ring-indigo-500"
            aria-label={label}
          />
        </div>
      </div>

      <div className="relative pt-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 accent-indigo-600"
          aria-label={`${label} slider`}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{helper}</p>
        {presets && (
          <div className="flex gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.value)}
                className="rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmiCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureMode, setTenureMode] = useState<TenureMode>('years');
  const [tenureValue, setTenureValue] = useState(15);
  
  // Amortization pagination
  const [visibleMonths, setVisibleMonths] = useState(12);

  const seoContent = getSEOContent('emi-calculator');

  const tenureMonths = useMemo(() => {
    const rawMonths = tenureMode === 'years' ? tenureValue * 12 : tenureValue;
    return Math.max(1, rawMonths);
  }, [tenureMode, tenureValue]);

  // Core calculations
  const { emi, totalPayment, totalInterest, amortizationSchedule } = useMemo(() => {
    const principal = Math.max(0, loanAmount);
    const months = Math.max(1, tenureMonths);
    const ratePerMonth = Math.max(0, interestRate) / 12 / 100;

    const emiValue =
      ratePerMonth === 0
        ? principal / months
        : (principal * ratePerMonth * Math.pow(1 + ratePerMonth, months)) /
          (Math.pow(1 + ratePerMonth, months) - 1);

    const totalPaymentVal = emiValue * months;
    const totalInterestVal = Math.max(0, totalPaymentVal - principal);

    // Generate schedule
    let remainingBalance = principal;
    const schedule = [];
    
    for (let month = 1; month <= months; month++) {
      const interestForMonth = remainingBalance * ratePerMonth;
      const principalForMonth = emiValue - interestForMonth;
      remainingBalance = Math.max(0, remainingBalance - principalForMonth);
      
      schedule.push({
        month,
        emi: emiValue,
        principal: principalForMonth,
        interest: interestForMonth,
        balance: remainingBalance,
      });
    }

    return {
      emi: emiValue || 0,
      totalPayment: totalPaymentVal || 0,
      totalInterest: totalInterestVal || 0,
      amortizationSchedule: schedule,
    };
  }, [interestRate, loanAmount, tenureMonths]);

  const resetValues = () => {
    setLoanAmount(2500000);
    setInterestRate(8.5);
    setTenureMode('years');
    setTenureValue(15);
    setVisibleMonths(12);
  };

  const downloadReport = () => {
    window.print();
  };

  // Chart data
  const pieData = [
    { name: 'Principal', value: loanAmount, color: '#312e81' }, // indigo-900
    { name: 'Interest', value: totalInterest, color: '#818cf8' }, // indigo-400
  ];

  const areaData = useMemo(() => {
    // reduce data points for performance if tenure is long
    const step = Math.ceil(amortizationSchedule.length / 50); 
    return amortizationSchedule.filter((_, i) => i % step === 0 || i === amortizationSchedule.length - 1).map((s) => ({
      Month: s.month,
      Balance: Math.round(s.balance),
    }));
  }, [amortizationSchedule]);

  return (
    <>
      <Header />
      {/* Hide elements when printing */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          header, footer, nav, .print-hide { display: none !important; }
          main { background: white !important; }
          .utilo-container { max-width: 100% !important; padding: 0 !important; }
          .shadow-sm, .shadow-xl { box-shadow: none !important; }
          .print-break { page-break-before: always; }
        }
      `}} />
      
      <main className="min-h-screen bg-slate-50 pb-20 pt-8 sm:pt-12">
        <div className="utilo-container">
          <Link href="/tools" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 print-hide">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>

          <div className="mb-8 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 print-hide">
              <Calculator className="h-3.5 w-3.5" />
              FINANCIAL TOOLS
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              EMI Calculator
            </h1>
            <p className="max-w-2xl text-base text-slate-600 print-hide">
              Calculate your exact monthly payments, total interest, and visualize your loan repayment schedule instantly.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            
            {/* LEFT COLUMN: Input Controls */}
            <div className="space-y-8">
              <Card className="border-0 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Loan Parameters</CardTitle>
                  <CardDescription>Adjust the sliders to see instant results.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-4">
                  
                  <SliderField
                    label="Principal Loan Amount"
                    helper="The total amount you plan to borrow."
                    value={loanAmount}
                    min={10000}
                    max={10000000}
                    step={10000}
                    displayValue={formatMoney(loanAmount)}
                    onChange={setLoanAmount}
                    presets={[
                      { label: '5L', value: 500000 },
                      { label: '10L', value: 1000000 },
                      { label: '25L', value: 2500000 },
                      { label: '50L', value: 5000000 },
                    ]}
                  />

                  <SliderField
                    label="Interest Rate (%)"
                    helper="Annual interest rate offered by the lender."
                    value={interestRate}
                    min={1}
                    max={30}
                    step={0.1}
                    displayValue={`${interestRate}%`}
                    onChange={setInterestRate}
                    presets={[
                      { label: '7%', value: 7 },
                      { label: '8.5%', value: 8.5 },
                      { label: '10%', value: 10 },
                      { label: '12%', value: 12 },
                    ]}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-sm font-semibold text-slate-800">Loan Tenure</label>
                      <div className="flex bg-slate-100 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => setTenureMode('years')}
                          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                            tenureMode === 'years' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          Years
                        </button>
                        <button
                          type="button"
                          onClick={() => setTenureMode('months')}
                          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                            tenureMode === 'months' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          Months
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={1}
                        max={tenureMode === 'years' ? 30 : 360}
                        step={1}
                        value={tenureValue}
                        onChange={(event) => setTenureValue(Number(event.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 accent-indigo-600"
                        aria-label="Loan tenure slider"
                      />
                      <Input
                        type="number"
                        min={1}
                        max={tenureMode === 'years' ? 30 : 360}
                        step={1}
                        value={tenureValue}
                        onChange={(event) => setTenureValue(Number(event.target.value) || 0)}
                        className="h-10 w-24 rounded-lg border-slate-300 bg-slate-50/50 text-center font-semibold text-slate-900 shadow-sm"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-500">Duration of the loan repayment.</p>
                      <div className="flex gap-2">
                        {[5, 10, 15, 20].map(val => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => { setTenureMode('years'); setTenureValue(val); }}
                                className="rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition-colors"
                            >
                                {val}Y
                            </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-100 print-hide">
                    <Button onClick={resetValues} variant="outline" className="flex-1 bg-white hover:bg-slate-50 text-slate-700">
                      <RotateCcw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                    <Button onClick={downloadReport} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                      <Download className="mr-2 h-4 w-4" /> Export PDF
                    </Button>
                  </div>

                </CardContent>
              </Card>

              {/* Area Chart: Balance over time */}
              <Card className="border-0 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                <CardHeader>
                  <CardTitle className="text-xl">Outstanding Balance</CardTitle>
                  <CardDescription>Visualizing your loan balance dropping to zero over time.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={areaData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="Month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val: number) => `₹${(val/100000).toFixed(1)}L`} />
                        <RechartsTooltip 
                          formatter={(value: number) => [formatMoney(value), 'Balance']}
                          labelFormatter={(label: number | string) => `Month ${label}`}
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="Balance" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* RIGHT COLUMN: Summary & Donut */}
            <div className="lg:sticky lg:top-24 space-y-6">
              <Card className="overflow-hidden border-0 bg-indigo-950 text-white shadow-2xl shadow-indigo-900/20">
                <CardHeader className="border-b border-indigo-900/50 bg-indigo-950/50 pb-6 pt-8">
                  <p className="text-sm font-semibold tracking-widest text-indigo-300 uppercase mb-2">Monthly EMI</p>
                  <div className="text-5xl font-bold tracking-tight">
                    {formatMoney(emi)}
                  </div>
                  <p className="mt-2 text-sm text-indigo-200">Amount required each month</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 divide-x divide-indigo-800/50 bg-indigo-900/20">
                    <div className="p-6">
                      <p className="text-xs font-semibold tracking-widest text-indigo-300 uppercase mb-2">Total Interest</p>
                      <p className="text-2xl font-semibold text-white">{formatMoney(totalInterest)}</p>
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-semibold tracking-widest text-indigo-300 uppercase mb-2">Total Payment</p>
                      <p className="text-2xl font-semibold text-white">{formatMoney(totalPayment)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Donut Chart */}
              <Card className="border-0 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Payment Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="h-48 w-full max-w-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          formatter={(value: number) => formatMoney(value)}
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="w-full space-y-3 mt-2">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-900"></div>
                        <span className="text-slate-600 font-medium">Principal Amount</span>
                      </div>
                      <span className="font-semibold text-slate-900">{((loanAmount / totalPayment) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                        <span className="text-slate-600 font-medium">Total Interest</span>
                      </div>
                      <span className="font-semibold text-slate-900">{((totalInterest / totalPayment) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-16 print-break">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Amortization Schedule</h2>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-900">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Month</th>
                      <th className="px-6 py-4 font-semibold text-right">Principal</th>
                      <th className="px-6 py-4 font-semibold text-right">Interest</th>
                      <th className="px-6 py-4 font-semibold text-right">Total Payment</th>
                      <th className="px-6 py-4 font-semibold text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {amortizationSchedule.slice(0, visibleMonths).map((row) => (
                      <tr key={row.month} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{row.month}</td>
                        <td className="px-6 py-4 text-right text-indigo-700">{formatMoney(row.principal)}</td>
                        <td className="px-6 py-4 text-right text-rose-600">{formatMoney(row.interest)}</td>
                        <td className="px-6 py-4 text-right font-medium">{formatMoney(row.emi)}</td>
                        <td className="px-6 py-4 text-right font-medium text-slate-900">{formatMoney(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {visibleMonths < amortizationSchedule.length && (
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-center print-hide">
                  <Button variant="outline" onClick={() => setVisibleMonths((v) => Math.min(v + 24, amortizationSchedule.length))}>
                    Load More Months
                  </Button>
                </div>
              )}
            </div>
          </div>

          {seoContent && (
            <div className="print-hide">
              <SEOContentSection seoContent={seoContent} toolName="EMI Calculator" slug="emi-calculator" />
            </div>
          )}
        </div>
      </main>
      <div className="print-hide">
        <Footer />
      </div>
    </>
  );
}