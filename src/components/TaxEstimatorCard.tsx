"use client";

import { useMemo, useState } from "react";
import { Calculator, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TaxEstimatorCard() {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [deductions, setDeductions] = useState("");
  const [taxRate, setTaxRate] = useState("0.10");

  const estimate = useMemo(() => {
    const income = Number(monthlyIncome) || 0;
    const allowed = Number(deductions) || 0;
    const taxable = Math.max(income - allowed, 0);
    const yearlyTaxable = taxable * 12;
    const yearlyTax = yearlyTaxable * Number(taxRate);
    return {
      taxableMonthly: taxable,
      taxableYearly: yearlyTaxable,
      estimatedYearlyTax: yearlyTax,
      estimatedMonthlyTax: yearlyTax / 12,
    };
  }, [monthlyIncome, deductions, taxRate]);

  return (
    <Card className="mb-6 border-primary/20">
      <CardContent className="p-6">
        <p className="mb-1 flex items-center gap-2 font-semibold text-foreground">
          <Calculator className="h-4 w-4 text-primary" />
          Simple tax estimate
        </p>
        <p className="mb-4 text-sm text-muted">
          Use this quick estimate to plan. Always confirm final tax computations with official GRA guidance.
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Monthly income (GHS)</label>
            <input
              type="number"
              min="0"
              value={monthlyIncome}
              onChange={(event) => setMonthlyIncome(event.target.value)}
              placeholder="e.g. 5000"
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Monthly deductions (GHS)</label>
            <input
              type="number"
              min="0"
              value={deductions}
              onChange={(event) => setDeductions(event.target.value)}
              placeholder="e.g. 500"
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Estimate rate</label>
            <select
              value={taxRate}
              onChange={(event) => setTaxRate(event.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="0.05">5%</option>
              <option value="0.10">10%</option>
              <option value="0.15">15%</option>
              <option value="0.20">20%</option>
              <option value="0.25">25%</option>
            </select>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-soft-blue/40 p-4">
          <p className="text-sm text-muted">Estimated monthly taxable income</p>
          <p className="text-xl font-bold text-foreground">
            GHS {estimate.taxableMonthly.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <p className="text-sm text-muted">
              Estimated yearly taxable:{" "}
              <span className="font-semibold text-foreground">
                GHS {estimate.taxableYearly.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </p>
            <p className="text-sm text-muted">
              Estimated yearly tax:{" "}
              <span className="font-semibold text-foreground">
                GHS {estimate.estimatedYearlyTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          This is an educational estimate and not a final tax assessment.
        </div>

        <Button asChild variant="outline" className="mt-3">
          <a href="/assistant?topic=gra-tax-calculate">Ask AI to explain this estimate</a>
        </Button>
      </CardContent>
    </Card>
  );
}
