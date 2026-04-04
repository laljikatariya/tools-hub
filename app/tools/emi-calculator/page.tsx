'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Calculator, RotateCcw } from 'lucide-react';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { SEOContentSection } from '@/app/components/seo-content-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getSEOContent } from '@/lib/seo-content';

type TenureMode = 'months' | 'years';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const integerCurrencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

function formatMoney(value: number) {
  return currencyFormatter.format(value);
}

function formatWholeMoney(value: number) {
  return integerCurrencyFormatter.format(value);
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
}: {
  label: string;
  helper: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-sm font-semibold text-slate-900">{displayValue}</span>
      </div>
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
        className="h-12 rounded-xl border-[#DBE3EF] bg-white text-slate-900 shadow-none focus-visible:ring-[#4F46E5]"
        aria-label={label}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[#4F46E5]"
        aria-label={`${label} slider`}
      />
      <p className="text-xs text-slate-500">{helper}</p>
    </div>
  );
}

export default function EmiCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(1500000);
  const [interestRate, setInterestRate] = useState(9);
  const [tenureMode, setTenureMode] = useState<TenureMode>('years');
  const [tenureValue, setTenureValue] = useState(15);
  const [showChart, setShowChart] = useState(true);
  const seoContent = getSEOContent('emi-calculator');

  const tenureMonths = useMemo(() => {
    const rawMonths = tenureMode === 'years' ? tenureValue * 12 : tenureValue;
    return Math.max(1, rawMonths);
  }, [tenureMode, tenureValue]);

  const calculations = useMemo(() => {
    const principal = Math.max(0, loanAmount);
    const months = Math.max(1, tenureMonths);
    const ratePerMonth = Math.max(0, interestRate) / 12 / 100;

    const emi =
      ratePerMonth === 0
        ? principal / months
        : (principal * ratePerMonth * Math.pow(1 + ratePerMonth, months)) /
          (Math.pow(1 + ratePerMonth, months) - 1);

    const totalPayment = emi * months;
    const totalInterest = Math.max(0, totalPayment - principal);
    const paymentBase = Math.max(totalPayment, 1);

    return {
      emi,
      totalPayment,
      totalInterest,
      principalShare: (principal / paymentBase) * 100,
      interestShare: (totalInterest / paymentBase) * 100,
    };
  }, [interestRate, loanAmount, tenureMonths]);

  const resetValues = () => {
    setLoanAmount(1500000);
    setInterestRate(9);
    setTenureMode('years');
    setTenureValue(15);
    setShowChart(true);
  };

  const toggleTenureMode = (nextMode: TenureMode) => {
    if (nextMode === tenureMode) {
      return;
    }

    setTenureValue((currentValue) => {
      if (nextMode === 'years') {
        return Math.max(1, Math.round(currentValue / 12));
      }

      return Math.max(1, currentValue * 12);
    });

    setTenureMode(nextMode);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
        <div className="utilo-container py-8 sm:py-10">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>

          <div className="mb-8 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
              <Calculator className="h-3.5 w-3.5" />
              Calculators
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              EMI Calculator
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Adjust the loan amount, rate, and tenure to see your monthly EMI update instantly.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.9fr]">
            <Card className="border-slate-200 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
              <CardHeader className="space-y-2 border-b border-slate-100 pb-6">
                <CardTitle className="text-xl">Loan details</CardTitle>
                <CardDescription>Use the sliders for fast adjustments or type exact values.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <SliderField
                  label="Loan Amount"
                  helper="Principal amount borrowed"
                  value={loanAmount}
                  min={10000}
                  max={10000000}
                  step={10000}
                  displayValue={formatWholeMoney(loanAmount)}
                  onChange={setLoanAmount}
                />

                <SliderField
                  label="Interest Rate (%)"
                  helper="Annual interest rate on the loan"
                  value={interestRate}
                  min={0}
                  max={30}
                  step={0.1}
                  displayValue={`${interestRate.toFixed(1)}%`}
                  onChange={setInterestRate}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-slate-700">Loan Tenure</label>
                    <span className="text-sm font-semibold text-slate-900">
                      {tenureValue} {tenureMode}
                    </span>
                  </div>

                  <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => toggleTenureMode('months')}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        tenureMode === 'months'
                          ? 'bg-white text-slate-950 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                      aria-pressed={tenureMode === 'months'}
                    >
                      Months
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleTenureMode('years')}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        tenureMode === 'years'
                          ? 'bg-white text-slate-950 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                      aria-pressed={tenureMode === 'years'}
                    >
                      Years
                    </button>
                  </div>

                  <Input
                    type="number"
                    min={1}
                    max={tenureMode === 'years' ? 30 : 360}
                    step={1}
                    value={tenureValue}
                    onChange={(event) => setTenureValue(Number(event.target.value) || 0)}
                    className="h-12 rounded-xl border-[#DBE3EF] bg-white text-slate-900 shadow-none focus-visible:ring-[#4F46E5]"
                    aria-label="Loan tenure value"
                  />
                  <input
                    type="range"
                    min={1}
                    max={tenureMode === 'years' ? 30 : 360}
                    step={1}
                    value={tenureValue}
                    onChange={(event) => setTenureValue(Number(event.target.value))}
                    className="w-full accent-[#4F46E5]"
                    aria-label="Loan tenure slider"
                  />
                  <p className="text-xs text-slate-500">
                    {tenureMode === 'years' ? 'Switching to months keeps the same total tenure.' : 'Switching to years keeps the same total tenure.'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowChart((current) => !current)}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    {showChart ? 'Hide' : 'Show'} Chart
                  </Button>
                  <Button type="button" variant="ghost" onClick={resetValues}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="overflow-hidden border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-[0_20px_50px_rgba(15,23,42,0.2)]">
                <CardHeader className="border-b border-white/10 pb-5">
                  <CardTitle className="text-xl text-white">Repayment summary</CardTitle>
                  <CardDescription className="text-slate-300">
                    Updated instantly as you move the controls.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Monthly EMI</p>
                    <div className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                      {formatMoney(calculations.emi)}
                    </div>
                    <p className="mt-2 text-sm text-slate-300">Your monthly repayment amount</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Total Interest</p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {formatMoney(calculations.totalInterest)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Total Payment</p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {formatMoney(calculations.totalPayment)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-4 text-sm text-slate-300">
                      <span>Tenure</span>
                      <span className="font-medium text-white">
                        {tenureValue} {tenureMode}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-4 text-sm text-slate-300">
                      <span>Interest Rate</span>
                      <span className="font-medium text-white">{interestRate.toFixed(1)}%</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-4 text-sm text-slate-300">
                      <span>Principal</span>
                      <span className="font-medium text-white">{formatMoney(loanAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {showChart && (
                <Card className="border-slate-200 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Payment breakdown</CardTitle>
                    <CardDescription>Principal and interest as a share of your total repayment.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex h-4 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="bg-slate-900"
                        style={{ width: `${Math.max(0, Math.min(calculations.principalShare, 100))}%` }}
                      />
                      <div
                        className="bg-indigo-500"
                        style={{ width: `${Math.max(0, Math.min(calculations.interestShare, 100))}%` }}
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
                          Principal
                        </div>
                        <p className="mt-2 text-lg font-semibold text-slate-950">
                          {formatMoney(loanAmount)}
                        </p>
                        <p className="text-sm text-slate-500">{calculations.principalShare.toFixed(1)}% of repayment</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                          Interest
                        </div>
                        <p className="mt-2 text-lg font-semibold text-slate-950">
                          {formatMoney(calculations.totalInterest)}
                        </p>
                        <p className="text-sm text-slate-500">{calculations.interestShare.toFixed(1)}% of repayment</p>
                      </div>
                    </div>

                    <p className="text-xs leading-5 text-slate-500">
                      This breakdown estimates a standard fixed-rate EMI schedule and does not include fees or prepayment charges.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {seoContent && (
            <SEOContentSection seoContent={seoContent} toolName="EMI Calculator" slug="emi-calculator" />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}