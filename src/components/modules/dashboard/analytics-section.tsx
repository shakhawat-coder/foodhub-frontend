"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { Sparkles } from "lucide-react";
import { useTheme } from "next-themes";

import { analyticsAPI, aiInsightsAPI, type DashboardAnalytics } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] animate-pulse rounded-md bg-muted" aria-label="Loading chart" />
  ),
});

type Props = {
  mode: "admin" | "provider";
  days?: number;
};

export function DashboardAnalyticsSection({ mode, days = 7 }: Props) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [insightError, setInsightError] = useState("");
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightVersion, setInsightVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const data =
          mode === "admin"
            ? await analyticsAPI.getAdmin(days)
            : await analyticsAPI.getProvider(days);
        if (!cancelled) setAnalytics(data);
      } catch {
        if (!cancelled) setAnalytics(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [mode, days]);

  useEffect(() => {
    if (!analytics) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        setInsightsLoading(true);
        setInsightError("");
        const res = await aiInsightsAPI.create(
          analytics,
          mode === "provider" ? "PROVIDER" : "ADMIN"
        );
        if (!cancelled) setInsights(res.insights ?? []);
      } catch {
        if (!cancelled) {
          setInsights([]);
          setInsightError("AI insights unavailable right now.");
        }
      } finally {
        if (!cancelled) setInsightsLoading(false);
      }
    }, 650);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [analytics, mode, insightVersion]);

  const labels = useMemo(
    () => analytics?.ordersByDate.map((d) => d.date.slice(5)) ?? [],
    [analytics]
  );

  const baseChart: ApexOptions = {
    chart: {
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 700,
      } as any,
    },
    tooltip: {
      theme: theme === "dark" ? "dark" : "light",
    },
    grid: {
      borderColor: theme === "dark" ? "#1e293b" : "#e2e8f0",
    },
    stroke: { curve: "smooth", width: 3 },
    xaxis: { 
      categories: labels,
      labels: {
        style: {
          colors: theme === "dark" ? "#94a3b8" : "#64748b",
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: theme === "dark" ? "#94a3b8" : "#64748b",
        }
      }
    },
    dataLabels: { enabled: false },
    responsive: [{ breakpoint: 640, options: { legend: { position: "bottom" } } }],
  };

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[320px] animate-pulse rounded-xl bg-muted" />
        <div className="h-[320px] animate-pulse rounded-xl bg-muted" />
        <div className="h-[320px] animate-pulse rounded-xl bg-muted" />
        <div className="h-[320px] animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Unable to load analytics data.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Card at the Top */}
      <Card className="border-primary/20 bg-linear-to-br from-primary/5 via-background to-orange-500/5 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <CardTitle className="text-xl font-bold">
                {mode === "provider" ? "AI Growth Suggestions" : "AI Strategic Insights"}
              </CardTitle>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setInsightVersion((v) => v + 1)}
              disabled={!analytics || insightsLoading}
              className="hover:bg-primary/10 hover:text-primary transition-all"
            >
              <Sparkles className={`mr-1 h-3.5 w-3.5 ${insightsLoading ? "animate-spin" : ""}`} />
              {insightsLoading ? "Analyzing..." : "Refresh"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {insights.length > 0 ? (
              insights.map((item, idx) => (
                <div key={`${item}-${idx}`} className="flex gap-3 rounded-lg border bg-background/50 p-3 shadow-sm transition-all hover:shadow-md">
                   <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                   <p className="text-sm text-muted-foreground leading-relaxed">
                    {item}
                   </p>
                </div>
              ))
            ) : insightsLoading ? (
              <div className="col-span-full py-8 text-center text-sm text-muted-foreground animate-pulse">
                AI is crunching your data to provide strategic insights...
              </div>
            ) : (
              <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                Click refresh to generate AI-powered insights for your {mode === "provider" ? "business" : "platform"}.
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-lg bg-muted/30 p-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-primary">Peak Operating Hour:</span>
              <span className="text-muted-foreground font-medium uppercase tracking-wider">{analytics.peakHour}</span>
            </div>
            <div className="h-3 w-px bg-muted" />
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-primary">Star Performer:</span>
              <span className="text-muted-foreground font-medium">{analytics.bestSellingItem}</span>
            </div>
          </div>
          {insightError && (
              <p className="mt-2 text-xs text-destructive font-medium">{insightError}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm border-muted/60 transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Orders Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactApexChart
              type="line"
              height={280}
              options={baseChart}
              series={[{ name: "Orders", data: analytics.ordersByDate.map((d) => d.count) }]}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/60 transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Revenue Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactApexChart
              type="bar"
              height={280}
              options={{
                ...baseChart,
                plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
                colors: ["#ea580c"],
              }}
              series={[{ name: "Revenue ($)", data: analytics.revenueByDate.map((d) => d.revenue) }]}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/60 transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactApexChart
              type="donut"
              height={280}
              options={{
                labels: analytics.categoryStats.map((c) => c.category),
                chart: baseChart.chart,
                legend: { position: "bottom" },
                responsive: baseChart.responsive,
                theme: { palette: "palette1" }
              }}
              series={analytics.categoryStats.map((c) => c.count)}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/60 transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Logistics Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[280px]">
            {analytics.deliveryStatusStats && analytics.deliveryStatusStats.some(s => s.count > 0) ? (
              <ReactApexChart
                type="pie"
                height={280}
                width="100%"
                options={{
                  labels: analytics.deliveryStatusStats.map((s) => 
                    s.status.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                  ),
                  chart: baseChart.chart,
                  legend: { position: "bottom" },
                  responsive: baseChart.responsive,
                  colors: ["#fbbf24", "#3b82f6", "#8b5cf6", "#f97316", "#22c55e", "#ef4444"],
                  tooltip: baseChart.tooltip,
                }}
                series={analytics.deliveryStatusStats.map((s) => s.count)}
              />
            ) : (
              <div className="text-center py-10">
                <div className="bg-muted/30 p-4 rounded-full inline-block mb-3">
                  <Sparkles className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <p className="text-sm text-muted-foreground italic">No recent logistics data available.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
