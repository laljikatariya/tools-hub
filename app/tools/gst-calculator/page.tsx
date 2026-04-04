'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Percent, RefreshCcw } from 'lucide-react';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { SEOContentSection } from '@/app/components/seo-content-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getSEOContent } from '@/lib/seo-content';
import { getToolName } from '@/lib/translations';

type CalculationMode = 'exclusive' | 'inclusive';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatMoney(value: number) {
  return currencyFormatter.format(value);
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-5 text-slate-500">{description}</p>
    </div>
  );
}

function FieldBlock({
  label,
  helper,
  value,
  onChange,
  suffix,
  min,
  step,
  inputMode,
}: {
  label: string;
  helper: string;
  value: number;
  onChange: (value: number) => void;
  suffix: string;
  min: number;
  step: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-sm font-semibold text-slate-900">
          {suffix === '%' ? `${value.toFixed(2)}%` : formatMoney(value)}
        </span>
      </div>
      <Input
        type="number"
        min={min}
        step={step}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
        className="h-12 rounded-xl border-[#DBE3EF] bg-white text-slate-900 shadow-none focus-visible:ring-[#0F766E]"
        aria-label={label}
      />
      <p className="text-xs text-slate-500">{helper}</p>
    </div>
  );
}

export default function GstCalculatorPage() {
  const [amount, setAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState<CalculationMode>('exclusive');

  const toolName = getToolName('gst-calculator');
  const seoContent = getSEOContent('gst-calculator');

  const calculations = useMemo(() => {
    const safeAmount = Math.max(0, amount);
    const safeRate = Math.max(0, gstRate);
    const rateFactor = safeRate / 100;

    if (mode === 'inclusive') {
      const originalAmount = rateFactor === 0 ? safeAmount : safeAmount / (1 + rateFactor);
      const gstAmount = Math.max(0, safeAmount - originalAmount);

      return {
        gstAmount,
        totalAmount: safeAmount,
        originalAmount,
      };
    }

    const gstAmount = safeAmount * rateFactor;
    const totalAmount = safeAmount + gstAmount;

    return {
      gstAmount,
      totalAmount,
      originalAmount: safeAmount,
    };
  }, [amount, gstRate, mode]);

  const resetCalculator = () => {
    setAmount(1000);
    setGstRate(18);
    setMode('exclusive');
  };

  const amountLabel = mode === 'inclusive' ? 'Amount including GST' : 'Amount excluding GST';
  const amountHelper = mode === 'inclusive'
    ? 'Enter the final amount you already charge or pay.'
    : 'Enter the base amount before GST is applied.';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(240,253,250,0.95)_0%,rgba(248,250,252,1)_45%,rgba(226,232,240,1)_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>

          <div className="mb-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
              <Calculator className="h-3.5 w-3.5" />
              Calculators
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              {toolName}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Enter an amount and GST rate, then switch between inclusive and exclusive GST to see the tax amount, final total, and original amount update instantly.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-slate-200 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
              <CardHeader className="space-y-2 border-b border-slate-100 pb-6">
                <CardTitle className="text-xl">GST details</CardTitle>
                <CardDescription>Use the toggle to set whether the entered amount already includes GST.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-slate-700">Amount type</label>
                    <span className="text-sm font-semibold text-slate-900">
                      {mode === 'inclusive' ? 'Include GST' : 'Exclude GST'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 rounded-full border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => setMode('exclusive')}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        mode === 'exclusive'
                          ? 'bg-white text-slate-950 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                      aria-pressed={mode === 'exclusive'}
                    >
                      Exclude GST
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('inclusive')}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        mode === 'inclusive'
                          ? 'bg-white text-slate-950 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                      aria-pressed={mode === 'inclusive'}
                    >
                      Include GST
                    </button>
                  </div>
                  <p className="text-xs leading-5 text-slate-500">{amountHelper}</p>
                </div>

                <FieldBlock
                  label={amountLabel}
                  helper="Live results update as soon as you type."
                  value={amount}
                  onChange={setAmount}
                  suffix="₹"
                  min={0}
                  step={1}
                  inputMode="decimal"
                />

                <FieldBlock
                  label="GST rate (%)"
                  helper="Choose the tax percentage that applies to the amount."
                  value={gstRate}
                  onChange={setGstRate}
                  suffix="%"
                  min={0}
                  step={0.01}
                  inputMode="decimal"
                />

                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">Quick rates</p>
                  <div className="flex flex-wrap gap-2">
                    {[5, 12, 18, 28].map((rate) => (
                      <Button
                        key={rate}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setGstRate(rate)}
                        className={`rounded-full border-slate-200 ${gstRate === rate ? 'border-teal-500 bg-teal-50 text-teal-700' : ''}`}
                      >
                        <Percent className="mr-2 h-3.5 w-3.5" />
                        {rate}%
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-2">
                  <Button type="button" variant="outline" onClick={resetCalculator}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-slate-200 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 px-6 py-7 text-white sm:px-8">
                <p className="text-xs uppercase tracking-[0.24em] text-teal-200/80">Final Price</p>
                <div className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {formatMoney(calculations.totalAmount)}
                </div>
                <p className="mt-2 max-w-md text-sm leading-6 text-teal-100/80">
                  The total amount is highlighted here so you can scan the final price immediately.
                </p>
              </div>

              <CardContent className="space-y-4 p-6 sm:p-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <MetricCard
                    label="GST Amount"
                    value={formatMoney(calculations.gstAmount)}
                    description={mode === 'inclusive' ? 'Tax extracted from the entered amount.' : 'Tax added on top of the entered amount.'}
                  />
                  <MetricCard
                    label="Original Amount"
                    value={formatMoney(calculations.originalAmount)}
                    description={mode === 'inclusive' ? 'Amount before GST is removed.' : 'Base amount before GST is applied.'}
                  />
                </div>

                <div className="rounded-3xl border border-teal-100 bg-teal-50/70 p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-white p-3 text-teal-600 shadow-sm">
                      <Percent className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-950">Instant breakdown</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        GST amount: {formatMoney(calculations.gstAmount)} · Total amount: {formatMoney(calculations.totalAmount)} · Original amount: {formatMoney(calculations.originalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {seoContent && (
            <SEOContentSection seoContent={seoContent} toolName={toolName} slug="gst-calculator" />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}