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

export default function CagrCalculatorPage() {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [finalValue, setFinalValue] = useState(25000);
  const [durationYears, setDurationYears] = useState(5);
  
  const [visibleYears, setVisibleYears] = useState(15);

  const seoContent = getSEOContent('cagr-calculator');

  // Core calculations
  const { cagrPercentage, absoluteReturn, totalGain, yearlySchedule } = useMemo(() => {
    const PV = Math.max(1, initialInvestment);
    const FV = Math.max(0, finalValue);
    const t = Math.max(1, durationYears);
    
    // CAGR Formula: (FV / PV)^(1 / t) - 1
    const cagr = Math.pow(FV / PV, 1 / t) - 1;
    const cagrPercent = cagr * 100;
    
    // Total Gain / Loss
    const gain = FV - PV;
    
    // Absolute Return
    const absolute = (gain / PV) * 100;

    // Generate yearly schedule (smooth geometric growth)
    const schedule = [];
    for (let year = 1; year <= t; year++) {
      const currentGrossValue = PV * Math.pow(1 + cagr, year);
      const currentGain = currentGrossValue - PV;
      
      schedule.push({
        year,
        invested: PV,
        returns: currentGain,
        value: currentGrossValue,
      });
    }

    return {
      cagrPercentage: isNaN(cagrPercent) ? 0 : cagrPercent,
      absoluteReturn: isNaN(absolute) ? 0 : absolute,
      totalGain: gain,
      yearlySchedule: schedule,
    };
  }, [initialInvestment, finalValue, durationYears]);

  const resetValues = () => {
    setInitialInvestment(10000);
    setFinalValue(25000);
    setDurationYears(5);
    setVisibleYears(15);
  };

  const downloadReport = () => {
    window.print();
  };

  // Chart data
  // For donut chart, only show segments if there is a gain
  const pieData =
    totalGain > 0
      ? [
          { name: 'Initial Investment', value: initialInvestment, color: '#818cf8' }, // indigo-400
          { name: 'Total Gain', value: totalGain, color: '#312e81' }, // indigo-900
        ]
      : [
          { name: 'Initial Investment', value: initialInvestment, color: '#818cf8' },
        ];

  return (
    <>
      <Header />
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
              CAGR Calculator
            </h1>
            <p className="max-w-2xl text-base text-slate-600 print-hide">
              Calculate the true Compound Annual Growth Rate (CAGR) of your investments and track geometric growth over time.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            
            {/* LEFT COLUMN: Input Controls */}
            <div className="space-y-8">
              <Card className="border-0 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Investment Parameters</CardTitle>
                  <CardDescription>Enter the values to calculate the CAGR.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-4">
                  
                  <SliderField
                    label="Initial Investment"
                    helper="Your starting capital or investment amount."
                    value={initialInvestment}
                    min={100}
                    max={1000000}
                    step={1000}
                    displayValue={formatMoney(initialInvestment)}
                    onChange={setInitialInvestment}
                    presets={[
                      { label: '₹10k', value: 10000 },
                      { label: '₹50k', value: 50000 },
                      { label: '₹1L', value: 100000 },
                    ]}
                  />

                  <SliderField
                    label="Final Value"
                    helper="The final value of your investment."
                    value={finalValue}
                    min={100}
                    max={5000000}
                    step={1000}
                    displayValue={formatMoney(finalValue)}
                    onChange={setFinalValue}
                    presets={[
                      { label: '₹25k', value: 25000 },
                      { label: '₹1L', value: 100000 },
                      { label: '₹5L', value: 500000 },
                      { label: '₹10L', value: 1000000 },
                    ]}
                  />

                  <SliderField
                    label="Investment Duration"
                    helper="Number of years the money was invested."
                    value={durationYears}
                    min={1}
                    max={40}
                    step={1}
                    displayValue={`${durationYears} Years`}
                    onChange={setDurationYears}
                    presets={[
                      { label: '3Y', value: 3 },
                      { label: '5Y', value: 5 },
                      { label: '10Y', value: 10 },
                      { label: '20Y', value: 20 },
                    ]}
                  />

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

              {/* Area Chart: Growth over time */}
              <Card className="border-0 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                <CardHeader>
                  <CardTitle className="text-xl">Geometric Growth Simulator</CardTitle>
                  <CardDescription>Visualizing smooth compounded growth from initial to final value.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={yearlySchedule} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Yr ${val}`}/>
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val: number) => `₹${(val/1000).toFixed(0)}k`} />
                        <RechartsTooltip 
                          formatter={(value: number, name: string) => [formatMoney(value), name === 'value' ? 'Projected Value' : 'Initial Investment']}
                          labelFormatter={(label: number | string) => `Year ${label}`}
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" stackId="1" />
                        <Area type="monotone" dataKey="invested" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorInvested)" stackId="2" />
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
                  <p className="text-sm font-semibold tracking-widest text-indigo-300 uppercase mb-2">CAGR Return</p>
                  <div className={`text-5xl font-bold tracking-tight ${cagrPercentage >= 0 ? "text-white" : "text-red-400"}`}>
                    {cagrPercentage.toFixed(2)}%
                  </div>
                  <p className="mt-2 text-sm text-indigo-200">Per annum over {durationYears} years</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 divide-x divide-indigo-800/50 bg-indigo-900/20">
                    <div className="p-6">
                      <p className="text-xs font-semibold tracking-widest text-indigo-300 uppercase mb-2">Abs. Return</p>
                      <p className={`text-xl font-semibold ${absoluteReturn >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {absoluteReturn >= 0 ? "+" : ""}{absoluteReturn.toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-semibold tracking-widest text-indigo-300 uppercase mb-2">Total Gain</p>
                      <p className={`text-xl font-semibold ${totalGain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {totalGain >= 0 ? "+" : ""}{formatMoney(Math.abs(totalGain))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Donut Chart */}
              {totalGain > 0 && (
                <Card className="border-0 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Investment vs Yield</CardTitle>
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
                          <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                          <span className="text-slate-600 font-medium">Initial Amount</span>
                        </div>
                        <span className="font-semibold text-slate-900">{((initialInvestment / finalValue) * 100 || 0).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-indigo-900"></div>
                          <span className="text-slate-600 font-medium">Total Gain</span>
                        </div>
                        <span className="font-semibold text-slate-900">{((totalGain / finalValue) * 100 || 0).toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="mt-16 print-break">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Yearly Projection (at {cagrPercentage.toFixed(2)}%)</h2>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-900">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Year</th>
                      <th className="px-6 py-4 font-semibold text-right">Initial Invested</th>
                      <th className="px-6 py-4 font-semibold text-right">Cumulative Gain</th>
                      <th className="px-6 py-4 font-semibold text-right">Total Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {yearlySchedule.slice(0, visibleYears).map((row) => (
                      <tr key={row.year} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{row.year}</td>
                        <td className="px-6 py-4 text-right">{formatMoney(row.invested)}</td>
                        <td className={`px-6 py-4 text-right ${row.returns >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {row.returns >= 0 ? "+" : ""}{formatMoney(row.returns)}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-indigo-700">{formatMoney(row.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {visibleYears < yearlySchedule.length && (
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-center print-hide">
                  <Button variant="outline" onClick={() => setVisibleYears((v) => Math.min(v + 15, yearlySchedule.length))}>
                    Load More Years
                  </Button>
                </div>
              )}
            </div>
          </div>

          {seoContent && (
            <div className="print-hide">
              <SEOContentSection seoContent={seoContent} toolName="CAGR Calculator" slug="cagr-calculator" />
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
