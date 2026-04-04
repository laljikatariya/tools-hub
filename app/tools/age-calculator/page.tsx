'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, CakeSlice, Clock3, RefreshCcw } from 'lucide-react';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getToolName } from '@/lib/translations';

type AgeBreakdown = {
  years: number;
  months: number;
  days: number;
  nextBirthdayDate: Date;
  countdownDays: number;
};

function getDateOnly(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addYears(date: Date, years: number) {
  const nextDate = new Date(date);
  nextDate.setFullYear(nextDate.getFullYear() + years);
  return nextDate;
}

function addMonths(date: Date, months: number) {
  const target = new Date(date);
  const targetDay = target.getDate();
  target.setMonth(target.getMonth() + months, 1);
  const daysInTargetMonth = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(targetDay, daysInTargetMonth));
  return target;
}

function differenceInDays(later: Date, earlier: Date) {
  const diff = later.getTime() - earlier.getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

function calculateAge(birthDate: Date, today = getDateOnly()): AgeBreakdown {
  const safeBirthDate = getDateOnly(birthDate);

  let years = today.getFullYear() - safeBirthDate.getFullYear();
  let anniversary = addYears(safeBirthDate, years);

  if (anniversary > today) {
    years -= 1;
    anniversary = addYears(safeBirthDate, years);
  }

  let months = (today.getFullYear() - anniversary.getFullYear()) * 12 + (today.getMonth() - anniversary.getMonth());
  let monthAnniversary = addMonths(anniversary, months);

  if (monthAnniversary > today) {
    months -= 1;
    monthAnniversary = addMonths(anniversary, months);
  }

  const days = differenceInDays(today, monthAnniversary);
  const nextBirthdayDate = addYears(safeBirthDate, years + 1);
  const countdownDays = differenceInDays(nextBirthdayDate, today);

  return {
    years,
    months,
    days,
    nextBirthdayDate,
    countdownDays,
  };
}

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{value}</p>
    </div>
  );
}

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState('');
  const today = useMemo(() => getDateOnly(), []);
  const toolName = getToolName('age-calculator');

  const age = useMemo(() => {
    if (!birthDate) {
      return null;
    }

    const parsedBirthDate = new Date(`${birthDate}T00:00:00`);
    if (Number.isNaN(parsedBirthDate.getTime())) {
      return null;
    }

    if (parsedBirthDate > today) {
      return null;
    }

    return calculateAge(parsedBirthDate, today);
  }, [birthDate, today]);

  const clearBirthDate = () => setBirthDate('');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(248,250,252,1)_0%,rgba(241,245,249,1)_42%,rgba(226,232,240,1)_100%)]">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>

          <div className="flex flex-1 items-center justify-center py-4 sm:py-8">
            <Card className="w-full border-slate-200 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
              <CardHeader className="space-y-4 border-b border-slate-100 pb-6 text-center">
                <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                  <CakeSlice className="h-3.5 w-3.5" />
                  Calculators
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    {toolName}
                  </CardTitle>
                  <CardDescription className="mx-auto max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                    Pick a date of birth and see the age update instantly in years, months, and days, plus the time until the next birthday.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6 sm:p-8">
                <div className="mx-auto max-w-md space-y-3">
                  <label className="text-sm font-medium text-slate-700" htmlFor="birth-date">
                    Date of Birth
                  </label>
                  <div className="flex gap-3">
                    <Input
                      id="birth-date"
                      type="date"
                      value={birthDate}
                      onChange={(event) => setBirthDate(event.target.value)}
                      max={formatDateInput(today)}
                      className="h-12 rounded-xl border-slate-300 bg-white text-slate-950 shadow-none focus-visible:ring-amber-500"
                      aria-label="Date of birth"
                    />
                    <Button type="button" variant="outline" onClick={clearBirthDate} className="shrink-0">
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                  </div>
                  <p className="text-xs leading-5 text-slate-500">
                    Results update as soon as you choose a birth date. Future dates are blocked.
                  </p>
                </div>

                {!age ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                    <CalendarDays className="mx-auto h-10 w-10 text-slate-400" />
                    <p className="mt-4 text-lg font-medium text-slate-900">Choose a date of birth to see the result.</p>
                    <p className="mt-2 text-sm text-slate-500">The calculator will show your exact age and birthday countdown immediately.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 px-6 py-7 text-white shadow-[0_20px_50px_rgba(15,23,42,0.22)] sm:px-8">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-amber-200/80">Current Age</p>
                          <div className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                            {age.years} years, {age.months} months, {age.days} days
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-right backdrop-blur-sm">
                          <p className="text-xs uppercase tracking-[0.2em] text-amber-100/80">Birthday</p>
                          <p className="mt-1 text-sm font-medium text-white">{formatLongDate(age.nextBirthdayDate)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <MetricCard label="Years" value={`${age.years}`} />
                      <MetricCard label="Months" value={`${age.months}`} />
                      <MetricCard label="Days" value={`${age.days}`} />
                    </div>

                    <Card className="border-amber-100 bg-amber-50/80 shadow-none">
                      <CardContent className="flex flex-col items-center justify-between gap-4 p-5 text-center sm:flex-row sm:text-left">
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-white p-3 text-amber-600 shadow-sm">
                            <Clock3 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-950">Next birthday countdown</p>
                            <p className="text-sm text-slate-600">{formatLongDate(age.nextBirthdayDate)}</p>
                          </div>
                        </div>
                        <div className="rounded-2xl bg-white px-5 py-4 shadow-sm">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Time left</p>
                          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                            {age.countdownDays} days
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}