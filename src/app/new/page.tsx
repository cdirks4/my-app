"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
  Label,
  Sector,
  LabelList,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import React from "react";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { ChartConfig } from "@/components/ui/chart";

type ProjectedMetrics = {
  week_start_date: string;
  upcoming_existing_patient_appointments: number;
  upcoming_new_patient_appointments: number;
  occurred_rate: number;
  total_potential_appointments: number;
  trailing_weekly_revenue: number;
  availability_hours: number;
  booked_rate: number;
};

type Provider = {
  id: string;
  first_name: string;
  last_name: string;
};

type MetricCard = {
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  format?: "percentage" | "currency" | "number";
};

type MetricCardProps = {
  metric: MetricCard;
};

function MetricCard({ metric }: MetricCardProps) {
  const formattedValue = () => {
    switch (metric.format) {
      case "percentage":
        return `${(Number(metric.value) * 100).toFixed(1)}%`;
      case "currency":
        return `$${Number(metric.value).toLocaleString()}`;
      default:
        return metric.value;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{metric.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue()}</div>
        {metric.description && (
          <p className="text-muted-foreground text-sm mt-1">
            {metric.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

type ChartContainerProps = {
  children: React.ReactNode;
  config?: ChartConfig;
  className?: string;
};

export function RevenueTrendCard({ data }: { data: any[] }) {
  const chartConfig = {
    weeklyRevenue: {
      label: "Weekly Revenue",
      color: "hsl(171, 77%, 35%)",
    },
  } satisfies ChartConfig;

  // Calculate monthly average and current month comparison
  const currentMonth =
    data.slice(-4).reduce((acc, curr) => acc + curr.weeklyRevenue, 0) / 4;
  const previousMonths = data.slice(0, -4);
  const monthlyAverage =
    previousMonths.reduce((acc, curr) => acc + curr.weeklyRevenue, 0) /
    previousMonths.length;

  const trend = ((currentMonth - monthlyAverage) / monthlyAverage) * 100;

  return (
    <div className="bg-[#002137] rounded-xl p-6">
      <h2 className="text-2xl mb-2">Revenue Trend</h2>
      <p className="text-gray-400 mb-6">Weekly revenue performance</p>
      <LineChart data={data} className="h-[200px] w-full">
        <CartesianGrid stroke="#0A3142" />
        <XAxis
          dataKey="date"
          stroke="#4A6B7C"
          tickFormatter={(value) => value.split(" ")[0]}
        />
        <YAxis stroke="#4A6B7C" tickFormatter={(value) => `${value}k`} />
        <Line
          type="monotone"
          dataKey="weeklyRevenue"
          stroke="#00E5D1"
          strokeWidth={2}
          dot={false}
        />
        <Tooltip
          cursor={{ stroke: "#4A6B7C", strokeWidth: 1 }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-[#001524] p-3 rounded border border-[#4A6B7C]">
                  <p className="text-white">{payload[0].payload.date}</p>
                  <p className="text-[#00E5D1]">
                    ${payload[0].value.toLocaleString()}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
      </LineChart>
      <div className="mt-4">
        <p className="text-[#00E5D1] text-lg">
          {trend > 0 ? "Up" : "Down"} {Math.abs(trend).toFixed(1)}
        </p>
      </div>
    </div>
  );
}

const AppointmentProjectionsChart = ({ data, provider }) => {
  return (
    <div className="bg-[#5D3D61] rounded-xl p-6 mb-8">
      <h2 className="text-2xl mb-4">Appointment Projections</h2>
      <p className="text-lg mb-6 text-gray-400">
        {provider?.first_name} {provider?.last_name}
      </p>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="existingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E94E77" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#E94E77" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="newGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8E4585" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#8E4585" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#6D4D70" />
            <XAxis dataKey="date" stroke="#4A6B7C" tick={{ fill: "#4A6B7C" }} />
            <YAxis stroke="#4A6B7C" tick={{ fill: "#4A6B7C" }} />
            <Tooltip
              cursor={{ stroke: "#4A6B7C", strokeWidth: 1 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#4A314D] p-3 rounded border border-[#8E4585]">
                      <p className="text-white">{payload[0].payload.date}</p>
                      <p className="text-[#E94E77]">New: {payload[1].value}</p>
                      <p className="text-[#E1B5E8]">
                        Existing: {payload[0].value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="existingPatients"
              stackId="1"
              stroke="#E94E77"
              fill="url(#existingGradient)"
              name="Existing Patients"
            />
            <Area
              type="monotone"
              dataKey="newPatients"
              stackId="1"
              stroke="#8E4585"
              fill="url(#newGradient)"
              name="New Patients"
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ color: "#4A6B7C" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const AreaChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 w-48 bg-[#0A3142] rounded mb-4" />
    <div className="h-6 w-32 bg-[#0A3142] rounded mb-6" />
    <div className="h-[300px] w-full bg-[#0A3142] rounded" />
  </div>
);

const PieChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 w-40 bg-[#0A3142] rounded mb-4" />
    <div className="h-6 w-48 bg-[#0A3142] rounded mb-6" />
    <div className="h-[300px] w-full bg-[#0A3142] rounded" />
  </div>
);

const BarChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 w-44 bg-[#0A3142] rounded mb-4" />
    <div className="h-6 w-48 bg-[#0A3142] rounded mb-6" />
    <div className="h-[300px] w-full bg-[#0A3142] rounded" />
  </div>
);

const LineChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 w-40 bg-[#0A3142] rounded mb-4" />
    <div className="h-6 w-56 bg-[#0A3142] rounded mb-6" />
    <div className="h-[200px] w-full bg-[#0A3142] rounded mb-4" />
    <div className="h-6 w-48 bg-[#0A3142] rounded mb-2" />
    <div className="h-12 w-40 bg-[#0A3142] rounded" />
  </div>
);

const RadarChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 w-48 bg-[#0A3142] rounded mb-4" />
    <div className="h-6 w-44 bg-[#0A3142] rounded mb-6" />
    <div className="h-[300px] w-full bg-[#0A3142] rounded" />
  </div>
);

const CornerHealthLogo = () => (
  <img
    src="https://framerusercontent.com/images/XIjlgrPNZUO7Gdbb1RYEFQgUVx8.png?scale-down-to=512"
    alt="Corner Health"
    className="h-8" // This will maintain the height at 32px while preserving aspect ratio
  />
);

export default function ProjectedMetricsPage() {
  const [weekOptions, setWeekOptions] = useState<string[]>([]);

  const [projectedMetrics, setProjectedMetrics] = useState<ProjectedMetrics[]>(
    []
  );
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [weeksToShow, setWeeksToShow] = useState(12);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [activePatientType, setActivePatientType] =
    React.useState("newPatients");

  const patientTypes = [
    { key: "newPatients", label: "New Patients" },
    { key: "existingPatients", label: "Existing Patients" },
  ];

  useEffect(() => {
    if (projectedMetrics.length > 0) {
      const options = [
        ...new Set(projectedMetrics.map((m) => m.week_start_date)),
      ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      setWeekOptions(options);
      if (!startDate) setStartDate(options[options.length - 1]);
      if (!endDate) setEndDate(options[0]);
    }
  }, [projectedMetrics]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const metricsUrl =
          selectedProvider === "all"
            ? "/api/metrics/projected"
            : `/api/metrics/projected?provider_id=${selectedProvider}`;

        const [metricsRes, providersRes] = await Promise.all([
          fetch(metricsUrl),
          fetch("/api/providers"),
        ]);

        const [metricsData, providersData] = await Promise.all([
          metricsRes.json(),
          providersRes.json(),
        ]);

        setProjectedMetrics(metricsData);
        setProviders(providersData);

        // Set date range options
        const sortedDates = [
          ...new Set(
            metricsData.map((m: ProjectedMetrics) => m.week_start_date)
          ),
        ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        setWeekOptions(sortedDates);
        if (!startDate) setStartDate(sortedDates[sortedDates.length - 1]);
        if (!endDate) setEndDate(sortedDates[0]);

        setLoading(false);
      } catch (err) {
        console.error("Error in fetchData:", err);
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedProvider]);

  const filteredMetrics = [...projectedMetrics].sort(
    (a, b) =>
      new Date(b.week_start_date).getTime() -
      new Date(a.week_start_date).getTime()
  );

  const visibleMetrics = filteredMetrics.slice(0, weeksToShow);

  const chartConfig = {
    existingPatients: {
      label: "Existing Patients",
      color: "#E94E77",
      theme: "pink",
    },
    newPatients: {
      label: "New Patients",
      color: "#8E4585",
      theme: "purple",
    },
    weeklyRevenue: {
      label: "Weekly Revenue",
      color: "#E94E77",
    },
    utilizationRate: {
      label: "Utilization Rate",
      color: "#8E4585",
      theme: "purple",
    },
  };

  const chartData = React.useMemo(() => {
    // First, group by date and aggregate values
    const aggregatedData = projectedMetrics
      .filter((m) => {
        const date = new Date(m.week_start_date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        return start && end ? date >= start && date <= end : true;
      })
      .reduce((acc, m) => {
        const date = new Date(m.week_start_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        if (!acc[date]) {
          acc[date] = {
            date,
            existingPatients: 0,
            newPatients: 0,
            weeklyRevenue: 0,
            utilizationRate: 0,
            count: 0,
          };
        }

        acc[date].existingPatients +=
          m.upcoming_existing_patient_appointments ?? 0;
        acc[date].newPatients += m.upcoming_new_patient_appointments ?? 0;
        acc[date].weeklyRevenue += Number(m.trailing_weekly_revenue ?? 0);
        acc[date].utilizationRate +=
          (m.availability_hours / m.total_potential_appointments) * 100;
        acc[date].count += 1;

        return acc;
      }, {} as Record<string, any>);

    // Convert to array and calculate averages
    return Object.values(aggregatedData)
      .map((item) => ({
        ...item,
        existingPatients: Math.round(item.existingPatients / item.count),
        newPatients: Math.round(item.newPatients / item.count),
        weeklyRevenue: Number((item.weeklyRevenue / item.count).toFixed(2)),
        utilizationRate: Number((item.utilizationRate / item.count).toFixed(2)),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [projectedMetrics, startDate, endDate]);

  const latestMetrics = projectedMetrics.find(
    (m) => m.week_start_date === endDate
  ) || {
    booked_rate: 0,
    occurred_rate: 0,
    availability_hours: 0,
    trailing_weekly_revenue: 0,
    upcoming_existing_patient_appointments: 0,
    upcoming_new_patient_appointments: 0,
    week_start_date: "",
    total_potential_appointments: 0,
  };

  console.log("Selected week data:", latestMetrics);
  console.log("API data for selected week:", latestMetrics);

  const providerBookedRate = latestMetrics.booked_rate ?? 0;
  const practiceAvgBookedRate = 2.3; // Assuming a default practice average booked rate

  const bookedHours = latestMetrics.availability_hours ?? 0;
  const availableHours = latestMetrics.total_potential_appointments ?? 0;

  const latestWeek = latestMetrics.week_start_date
    ? new Date(latestMetrics.week_start_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const firstWeek = filteredMetrics.length
    ? new Date(filteredMetrics[0].week_start_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";
  const lastWeek = filteredMetrics.length
    ? new Date(
        filteredMetrics[filteredMetrics.length - 1].week_start_date
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const provider = providers.find((p) => p.id === selectedProvider);

  return (
    <div className="min-h-screen bg-[#FFF5F3] text-[#4A314D] p-8">
      <h1 className="text-5xl font-bold mb-8">PROJECTED METRICS</h1>

      <div className="flex justify-between items-center mb-8 bg-[#4A314D] text-white rounded-xl p-4">
        <div className="flex gap-4">
          <div>
            <label className="text-gray-400 text-sm block mb-2">Provider</label>
            <Select
              value={selectedProvider}
              onValueChange={setSelectedProvider}
            >
              <SelectTrigger className="w-[200px] bg-[#4A314D] border-[#8E4585] text-white">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent className="bg-[#4A314D] border-[#8E4585] text-white">
                <SelectItem value="all">All Providers</SelectItem>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.first_name} {provider.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-2">
              Date Range
            </label>
            <div className="flex gap-2">
              <Select value={startDate} onValueChange={setStartDate}>
                <SelectTrigger className="w-[150px] bg-[#4A314D] border-[#8E4585] text-white">
                  <SelectValue placeholder="Start date" />
                </SelectTrigger>
                <SelectContent className="bg-[#4A314D] border-[#8E4585] text-white">
                  {weekOptions.map((week) => (
                    <SelectItem key={week} value={week}>
                      {new Date(week).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={endDate} onValueChange={setEndDate}>
                <SelectTrigger className="w-[150px] bg-[#4A314D] border-[#8E4585] text-white">
                  <SelectValue placeholder="End date" />
                </SelectTrigger>
                <SelectContent className="bg-[#4A314D] border-[#8E4585] text-white">
                  {weekOptions.map((week) => (
                    <SelectItem key={week} value={week}>
                      {new Date(week).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Stats Row */}
      <div className="bg-[#4A314D] text-white rounded-xl p-6 mb-8">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl">Provider</h2>
            <p className="text-2xl font-semibold mt-2">
              {provider?.first_name} {provider?.last_name}
            </p>
          </div>
          <div>
            <h2 className="text-xl">Booked Rate</h2>
            <p className="text-2xl font-semibold mt-2">
              {(latestMetrics.booked_rate * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <h2 className="text-xl">Occurred Rate</h2>
            <p className="text-2xl font-semibold mt-2">
              {(latestMetrics.occurred_rate * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <h2 className="text-xl">Available Hours</h2>
            <p className="text-2xl font-semibold mt-2">
              {latestMetrics.availability_hours.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Appointment Projections */}
      <div className="bg-[#4A314D] text-white rounded-xl p-6 mb-8">
        {loading ? (
          <AreaChartSkeleton />
        ) : (
          <AppointmentProjectionsChart data={chartData} provider={provider} />
        )}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Patient Mix */}
        <div className="bg-[#4A314D] text-white rounded-xl p-6">
          <h2 className="text-2xl mb-2">Patient Mix</h2>
          <p className="text-gray-400 mb-6">New booked vs. capacity</p>
          {loading ? (
            <PieChartSkeleton />
          ) : (
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "New Patients",
                        value:
                          latestMetrics.upcoming_new_patient_appointments ?? 0,
                        fill: "#8E4585",
                      },
                      {
                        name: "Existing Patients",
                        value:
                          latestMetrics.upcoming_existing_patient_appointments ??
                          0,
                        fill: "#E94E77",
                      },
                    ]}
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    <Label
                      value={`${
                        latestMetrics.upcoming_new_patient_appointments +
                        latestMetrics.upcoming_existing_patient_appointments
                      }`}
                      position="center"
                      className="text-2xl font-bold text-white"
                    />
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#4A314D] p-3 rounded border border-[#8E4585]">
                            <p className="text-[#8E4585]">{payload[0].name}</p>
                            <p className="text-white">
                              {payload[0].value} patients
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Weekly Utilization */}
        <div className="bg-[#4A314D] text-white rounded-xl p-6">
          <h2 className="text-2xl mb-2">Weekly Utilization</h2>
          <p className="text-gray-400 mb-6">Hours booked vs capacity</p>
          {loading ? (
            <BarChartSkeleton />
          ) : (
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid stroke="#6D4D70" />
                  <XAxis
                    dataKey="date"
                    stroke="#4A6B7C"
                    tickFormatter={(value) => value.split(" ")[0]}
                  />
                  <YAxis stroke="#4A6B7C" />
                  <Bar
                    dataKey="utilizationRate"
                    fill="#8E4585"
                    radius={[4, 4, 0, 0]}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(74, 107, 124, 0.1)" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#4A314D] p-3 rounded border border-[#8E4585]">
                            <p className="text-white">
                              {payload[0].payload.date}
                            </p>
                            <p className="text-[#8E4585]">
                              {payload[0].value.toFixed(1)}% utilized
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Revenue Trend */}
        <div className="bg-[#4A314D] text-white rounded-xl p-6">
          <h2 className="text-2xl mb-2">Revenue Trend</h2>
          <p className="text-gray-400 mb-6">Weekly revenue performance</p>
          {loading ? (
            <LineChartSkeleton />
          ) : (
            <div className="w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#6D4D70" />
                  <XAxis
                    dataKey="date"
                    stroke="#4A6B7C"
                    tickFormatter={(value) => value.split(" ")[0]}
                  />
                  <YAxis
                    stroke="#4A6B7C"
                    tickFormatter={(value) => `${value}k`}
                  />
                  <Line
                    type="monotone"
                    dataKey="weeklyRevenue"
                    stroke="#8E4585"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Tooltip
                    cursor={{ stroke: "#4A6B7C", strokeWidth: 1 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#4A314D] p-3 rounded border border-[#8E4585]">
                            <p className="text-white">
                              {payload[0].payload.date}
                            </p>
                            <p className="text-[#8E4585]">
                              ${payload[0].value.toLocaleString()}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="mt-4">
            <p className="text-[#8E4585] text-lg">Down 14.8% from average</p>
            <p className="text-gray-400 mt-2">
              Current month: $3,267
              <br />
              Historical average: $33,137
            </p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-[#4A314D] text-white rounded-xl p-6">
          <h2 className="text-2xl mb-2">Performance Metrics</h2>
          <p className="text-gray-400 mb-6">Key performance metrics</p>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={[
                  {
                    subject: "Utilization",
                    value: latestMetrics.booked_rate * 100,
                    fullMark: 100,
                  },
                  {
                    subject: "Occurred Rate",
                    value: latestMetrics.occurred_rate * 100,
                    fullMark: 100,
                  },
                  {
                    subject: "Revenue",
                    value: (latestMetrics.trailing_weekly_revenue / 5000) * 100, // Normalized to percentage
                    fullMark: 100,
                  },
                ]}
              >
                <PolarGrid stroke="#6D4D70" gridType="circle" />
                <PolarAngleAxis
                  dataKey="subject"
                  stroke="#4A6B7C"
                  tick={{ fill: "#4A6B7C", fontSize: 14 }}
                />
                <PolarRadiusAxis
                  stroke="#6D4D70"
                  tick={{ fill: "#4A6B7C" }}
                  angle={30}
                  domain={[0, 100]}
                />
                <Radar
                  name="Metrics"
                  dataKey="value"
                  stroke="#8E4585"
                  fill="#8E4585"
                  fillOpacity={0.3}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#4A314D] p-3 rounded border border-[#8E4585]">
                          <p className="text-white">
                            {payload[0].payload.subject}
                          </p>
                          <p className="text-[#8E4585]">
                            {payload[0].value.toFixed(1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-end mt-4">
            <CornerHealthLogo />
          </div>
        </div>
      </div>
    </div>
  );
}
