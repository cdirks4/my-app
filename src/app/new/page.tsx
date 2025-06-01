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
  ReferenceLine,
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
import { CalendarIcon, CheckCheckIcon, ClockIcon } from "lucide-react";

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
  icon?: React.ReactNode;
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
    <Card
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
      title={metric.description}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {metric.icon && <div className="flex-shrink-0 mr-4">{metric.icon}</div>}
          <div className="text-[#4A314D]">
            <h3 className="text-sm font-medium mb-1">{metric.title}</h3>
            <div className="text-3xl font-semibold">{formattedValue()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type ChartContainerProps = {
  children: React.ReactNode;
  config?: ChartConfig;
  className?: string;
};

// Color palette constants
const colors = {
  background: "#FFF5F3", // Soft peach background
  text: "#4A314D", // Deep purple text
  coral: "#FFB5B5", // Soft coral for new patients
  lavender: "#E6D7E9", // Soft lavender for existing patients
  white: "#FFFFFF",
  gridLines: "#F4E6E6", // Light grid lines
  tooltipBg: "#4A314D", // Dark purple for tooltip
  progressBar: "#E6D7E9", // Progress bar color
  progressBg: "#F4E6E6", // Progress bar background
  utilizationEmpty: '#D6D2D9', // A light, neutral gray distinct from grid lines
  revenueChart: {
    line: "#E6D7E9", // Line color
    background: "#FFF5F3", // Background fill
  },
};

// Update chart config
const chartConfig = {
  newPatients: {
    label: "New Patients",
    color: colors.coral,
    fillOpacity: 0.3,
  },
  existingPatients: {
    label: "Existing Patients",
    color: colors.lavender,
    fillOpacity: 0.3,
  },
};

export function RevenueTrendCard({ data }: { data: any[] }) {
  // Calculate monthly average and current month comparison
  const currentMonthData = data.slice(-4);
  const previousMonthsData = data.slice(0, data.length - 4);

  const currentMonthRevenue = currentMonthData.length > 0
    ? currentMonthData.reduce((acc, curr) => acc + curr.weeklyRevenue, 0) / currentMonthData.length
    : 0;

  const historicalAverageRevenue = previousMonthsData.length > 0
    ? previousMonthsData.reduce((acc, curr) => acc + curr.weeklyRevenue, 0) / previousMonthsData.length
    : 0;

  const trend = historicalAverageRevenue !== 0
    ? ((currentMonthRevenue - historicalAverageRevenue) / historicalAverageRevenue) * 100
    : (currentMonthRevenue > 0 ? 100 : 0); // Handle case where historical average is 0

  return (
    <div className="bg-white text-[#4A314D] rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl mb-2" style={{ color: colors.text }}>Revenue Trend</h2>
      <p className="opacity-60 mb-6" style={{ color: colors.text }}>Weekly revenue performance</p>
      <LineChart data={data} className="h-[200px] w-full">
        <CartesianGrid stroke={colors.gridLines} />
        <XAxis
          dataKey="date"
          stroke={colors.text}
          tick={{ fill: colors.text, fontSize: 12 }}
          tickLine={{ stroke: colors.text }}
          axisLine={{ stroke: colors.text }}
          tickFormatter={(value) => value.split(" ")[0]}
        />
        <YAxis
          stroke={colors.text}
          tick={{ fill: colors.text, fontSize: 12 }}
          tickLine={{ stroke: colors.text }}
          axisLine={{ stroke: colors.text }}
          tickFormatter={(value) => `${value}k`}
        />
        <Line
          type="monotone"
          dataKey="weeklyRevenue"
          stroke={colors.coral}
          strokeWidth={2}
          dot={false}
        />
        <Tooltip
          cursor={{ stroke: colors.lavender, strokeWidth: 1 }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div
                  style={{
                    backgroundColor: colors.tooltipBg,
                    padding: "0.75rem",
                    borderRadius: "0.25rem",
                    border: `1px solid ${colors.lavender}`,
                  }}
                >
                  <p style={{ color: colors.white, marginBottom: "0.25rem", fontWeight: 'bold' }}>{label}</p>
                  <p style={{ color: colors.coral }}>
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
        <p className="text-lg" style={{ color: trend >= 0 ? colors.coral : colors.text }}>
          {trend >= 0 ? "Up" : "Down"} {Math.abs(trend).toFixed(1)}%
        </p>
        {/* Optional: Display current and historical averages if needed, styled with colors.text */}
        {/* <p style={{ color: colors.text, opacity: 0.8, fontSize: '0.875rem' }}>
          Current month avg: ${currentMonthRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}<br/>
          Historical avg: ${historicalAverageRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}
        </p> */}
      </div>
    </div>
  );
}

// Custom Bar Shape for Proportional Fill
const ProportionalBar = (props: any) => {
  const { x, y, width, height, payload, fill } = props; // 'fill' from <Bar fill={...}> is background
  const utilizationRate = payload.utilizationRate || 0; // Expects 0-100

  const barRadius = 4;

  const backgroundFill = fill; // Use the fill from <Bar> for the background track
  const foregroundFill = colors.lavender; // Used hours color

  // Calculate height of the filled portion
  const filledHeight = Math.max(0, height * (utilizationRate / 100));
  // Y position for the filled rectangle (drawn from top down in SVG, so y is top)
  // For a bar filling from bottom up, the filled part's y is original_y + (total_height - filled_height)
  const filledY = y + (height - filledHeight);

  if (width <= 0 || height <= 0) {
    return null;
  }

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={backgroundFill}
        rx={barRadius}
        ry={barRadius}
      />
      {utilizationRate > 0 && ( // Only draw filled rectangle if there's utilization
        <rect
          x={x}
          y={filledY}
          width={width}
          height={filledHeight}
          fill={foregroundFill}
          rx={barRadius}
          ry={barRadius}
        />
      )}
    </g>
  );
};

const AppointmentProjectionsChart = ({ data, provider }) => (
  <div className="bg-white w-full h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
      >
        <defs>
          <linearGradient id="newGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFB5B5" stopOpacity={1} />
            <stop offset="100%" stopColor="#FFB5B5" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="existingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E6D7E9" stopOpacity={1} />
            <stop offset="100%" stopColor="#E6D7E9" stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid
          stroke="#F4E6E6"
          strokeDasharray="3 3"
          horizontal={true}
          vertical={false}
        />
        <XAxis
          dataKey="date"
          stroke="#4A314D"
          tick={{
            fill: colors.text,
            fontSize: 12,
          }}
          tickLine={{ stroke: colors.text }}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke={colors.text}
          tick={{
            fill: colors.text,
            fontSize: 12,
          }}
          tickLine={{ stroke: colors.text }}
          domain={[0, 35]}
          ticks={[0, 18, 20, 25, 30, 35]}
          axisLine={false}
          label={{
            value: "Number of Appointments",
            angle: -90,
            position: "insideLeft",
            offset: -40,
            style: {
              textAnchor: "middle",
              fill: colors.text,
              fontSize: 12,
            },
          }}
        />
        <Area
          type="monotone"
          dataKey="newPatients"
          name="New"
          stackId="1"
          stroke="none"
          fill={colors.coral}
          fillOpacity={1}
        />
        <Area
          type="monotone"
          dataKey="existingPatients"
          name="Existing"
          stackId="1"
          stroke="none"
          fill={colors.lavender}
          fillOpacity={1}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload?.length) {
              const newPatientData = payload.find(p => p.name === "New");
              const existingPatientData = payload.find(p => p.name === "Existing");
              return (
                <div
                  style={{
                    backgroundColor: colors.tooltipBg,
                    padding: "0.75rem",
                    borderRadius: "0.25rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    border: `1px solid ${colors.lavender}`,
                  }}
                >
                  <p style={{ color: colors.white, marginBottom: "0.25rem", fontWeight: 'bold' }}>
                    {label}
                  </p>
                  <div className="flex flex-col gap-1">
                    <p style={{ color: colors.lavender }}>
                      Existing : {existingPatientData ? existingPatientData.value : 0}
                    </p>
                    <p style={{ color: colors.coral }}>
                      New : {newPatientData ? newPatientData.value : 0}
                    </p>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <ReferenceLine
          x="2024-04-19" // This date might need to be dynamic or removed if not always relevant
          stroke={colors.text}
          strokeDasharray="3 3"
          strokeWidth={1}
        />
        {/* Y-axis tick values */}
        <text x={40} y={20} fill={colors.text} fontSize={12}>
          35
        </text>
        <text x={40} y={85} fill={colors.text} fontSize={12}>
          30
        </text>
        <text x={40} y={150} fill={colors.text} fontSize={12}>
          20
        </text>
        <text x={40} y={215} fill={colors.text} fontSize={12}>
          18
        </text>
        <text x={40} y={280} fill={colors.text} fontSize={12}>
          0
        </text>
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

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

// Update selection bar and metrics display
const SelectionBar = ({
  providers,
  selectedProvider,
  setSelectedProvider,
  weekOptions,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
    <div className="flex gap-8 items-center">
      <div>
        <label className="text-[#4A314D] text-sm mb-2 block">Provider</label>
        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
          <SelectTrigger className="w-[200px] bg-white border-[#E6D7E9] text-[#4A314D]">
            <SelectValue placeholder="All Providers" />
          </SelectTrigger>
          <SelectContent>
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
        <label className="text-[#4A314D] text-sm mb-2 block">Date Range</label>
        <div className="flex items-center gap-2">
          <Select value={startDate} onValueChange={setStartDate}>
            <SelectTrigger className="w-[120px] bg-white border-[#E6D7E9] text-[#4A314D]">
              <SelectValue placeholder="Start date" />
            </SelectTrigger>
            <SelectContent>
              {weekOptions.map((week) => (
                <SelectItem key={week} value={week}>
                  {new Date(week).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-[#4A314D]">to</span>
          <Select value={endDate} onValueChange={setEndDate}>
            <SelectTrigger className="w-[120px] bg-white border-[#E6D7E9] text-[#4A314D]">
              <SelectValue placeholder="End date" />
            </SelectTrigger>
            <SelectContent>
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
);

// Update metrics display
const MetricsDisplay = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
    <div className="grid grid-cols-3 gap-8">
      <div>
        <h3 className="text-[#4A314D] text-sm mb-2">Booked Rate</h3>
        <p className="text-[#4A314D] text-2xl font-semibold">75.0%</p>
      </div>
      <div>
        <h3 className="text-[#4A314D] text-sm mb-2">Occurred Rate</h3>
        <p className="text-[#4A314D] text-2xl font-semibold">71.0%</p>
      </div>
      <div>
        <h3 className="text-[#4A314D] text-sm mb-2">Available Hours</h3>
        <p className="text-[#4A314D] text-2xl font-semibold">34.3</p>
      </div>
    </div>
  </div>
);

// Update chart containers
const AppointmentProjections = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
    <h2 className="text-[#4A314D] text-xl font-semibold mb-6">
      Appointment Projections
    </h2>
    {/* Chart content */}
  </div>
);

const PatientMix = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <h2 className="text-[#4A314D] text-xl font-semibold mb-6">Patient Mix</h2>
    {/* Chart content */}
  </div>
);

const WeeklyUtilization = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <h2 className="text-[#4A314D] text-xl font-semibold mb-6">
      Weekly Utilization
    </h2>
    {/* Chart content */}
  </div>
);

// Update container styles
const chartContainerClasses = "bg-white rounded-xl p-6 shadow-sm";

// Add global styles with proper Nunito import
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap');
  
  :root {
    --font-family: "Nunito", sans-serif;
    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
  }
`;

// Update text styles in components
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

  // Removed the useEffect hook that depended on [projectedMetrics]

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

        // Authoritatively set date range options based on new metricsData
        const newSortedDates = [
          ...new Set(
            metricsData.map((m: ProjectedMetrics) => m.week_start_date)
          ),
        ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // newest to oldest

        setWeekOptions(newSortedDates);
        // Set startDate to the oldest date from the new set, endDate to the newest
        setStartDate(newSortedDates.length > 0 ? newSortedDates[newSortedDates.length - 1] : "");
        setEndDate(newSortedDates.length > 0 ? newSortedDates[0] : "");

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
            // Remove utilizationRate and count, add new hour fields
            availability_hours: 0,
            total_potential_appointments: 0,
            // count: 0, // Not strictly needed if not averaging here
          };
        }

        acc[date].existingPatients +=
          m.upcoming_existing_patient_appointments ?? 0;
        acc[date].newPatients += m.upcoming_new_patient_appointments ?? 0;
        acc[date].weeklyRevenue += Number(m.trailing_weekly_revenue ?? 0);
        acc[date].availability_hours += m.availability_hours ?? 0;
        acc[date].total_potential_appointments += m.total_potential_appointments ?? 0;
        // acc[date].count += 1; // Only if averaging something not summed

        return acc;
      }, {} as Record<string, any>);

    // Convert to array and process final fields
    return Object.values(aggregatedData)
      .map((item) => {
        // Assuming existingPatients, newPatients, weeklyRevenue are summed, not averaged
        // If they were previously divided by count, that logic needs to be here or removed if sums are desired.
        // For this task, we focus on hour fields. Assume other fields are handled as direct sums or are already correct.
        const availability_hours = item.availability_hours;
        const total_potential_appointments = item.total_potential_appointments;
        return {
          date: item.date,
          existingPatients: item.existingPatients, // Presumed sum or already handled
          newPatients: item.newPatients, // Presumed sum or already handled
          weeklyRevenue: item.weeklyRevenue, // Presumed sum or already handled
          availability_hours,
          total_potential_appointments,
          // remaining_hours: Math.max(0, total_potential_appointments - availability_hours), // This line is removed
          // Optional: Recalculate utilizationRate if needed for other charts from this chartData
          utilizationRate: total_potential_appointments > 0 ? Number(((availability_hours / total_potential_appointments) * 100).toFixed(2)) : 0,
        };
      })
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

  // Console logs for Performance Metrics progress bar values
  const utilizationValue = latestMetrics.booked_rate * 100;
  const occurredRateValue = latestMetrics.occurred_rate * 100;
  const revenueProgressValue = Math.min((latestMetrics.trailing_weekly_revenue / 5000) * 100, 100);

  console.log("Performance Metrics - Utilization Value:", utilizationValue);
  console.log("Performance Metrics - Occurred Rate Value:", occurredRateValue);
  console.log("Performance Metrics - Revenue Progress Value:", revenueProgressValue);

  return (
    <>
      <style jsx global>
        {globalStyles}
      </style>
      <div className="min-h-screen bg-[#FFF8F3] p-8 font-['Nunito']">
        <h1 className="text-[#4A314D] text-4xl font-medium mb-8">
          Projected Metrics
        </h1>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <MetricCard
            metric={{
              title: "Booked Rate",
              value: latestMetrics.booked_rate,
              format: "percentage",
              icon: <CalendarIcon className="h-6 w-6 text-[#4A314D]" />,
              description: "Percentage of appointments booked out of total available slots.",
            }}
          />
          <MetricCard
            metric={{
              title: "Occurred Rate",
              value: latestMetrics.occurred_rate,
              format: "percentage",
              icon: <CheckCheckIcon className="h-6 w-6 text-[#4A314D]" />,
              description: "Percentage of appointments that were completed as scheduled.",
            }}
          />
          <MetricCard
            metric={{
              title: "Available Hours",
              value: latestMetrics.availability_hours,
              format: "number",
              icon: <ClockIcon className="h-6 w-6 text-[#4A314D]" />,
              description: "Total number of hours available for booking this week.",
            }}
          />
        </div>

        <div className="sticky top-8 z-10 flex justify-between items-center mb-8 bg-white text-[#4A314D] rounded-xl p-4 border border-[#E6D7E9] shadow-md">
          <SelectionBar
            providers={providers}
            selectedProvider={selectedProvider}
            setSelectedProvider={setSelectedProvider}
            weekOptions={weekOptions}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>

        {/* Provider Stats Row */}
        {/* <div className="bg-[#4A314D] text-white rounded-xl p-6 mb-8">
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
        </div> */}

        {/* Appointment Projections */}
        <div className="bg-white text-[#4A314D] rounded-2xl p-6 shadow-sm border border-[#E6D7E9] mb-8">
          {loading ? (
            <AreaChartSkeleton />
          ) : (
            <AppointmentProjectionsChart data={chartData} provider={provider} />
          )}
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-2 gap-8">
          {/* Patient Mix */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E6D7E9]">
            <h2 className="text-[#4A314D] text-xl font-semibold mb-6">
              Patient Mix
            </h2>
            <p className="text-sm text-[#4A314D] opacity-60 font-semibold tracking-[-0.02em] leading-none mb-6">
              New booked vs. capacity
            </p>
            {loading ? (
              <PieChartSkeleton />
            ) : (
              <div className="bg-white w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "New Patients",
                          value:
                            latestMetrics.upcoming_new_patient_appointments ??
                            0,
                          fill: colors.coral,
                        },
                        {
                          name: "Existing Patients",
                          value:
                            latestMetrics.upcoming_existing_patient_appointments ??
                            0,
                          fill: colors.lavender,
                        },
                      ]}
                      innerRadius={60}
                      outerRadius={130}
                      dataKey="value"
                      labelLine={false}
                    >
                      <LabelList
                        dataKey="value"
                        position="outside"
                        offset={10}
                        formatter={(value: number, entry: any) => {
                          const total =
                            (latestMetrics.upcoming_new_patient_appointments ?? 0) +
                            (latestMetrics.upcoming_existing_patient_appointments ?? 0);
                          const percentage = total > 0 ? (value / total) * 100 : 0;
                          return `${percentage.toFixed(0)}% (${value})`;
                        }}
                        className="text-sm fill-gray-500"
                      />
                      <Label
                        value={`${
                          (latestMetrics.upcoming_new_patient_appointments ?? 0) +
                          (latestMetrics.upcoming_existing_patient_appointments ?? 0)
                        }`}
                        position="center"
                        className="text-2xl font-bold"
                        fill={colors.text} // Using text color for better contrast on white bg potentially
                      />
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const total =
                            (latestMetrics.upcoming_new_patient_appointments ?? 0) +
                            (latestMetrics.upcoming_existing_patient_appointments ?? 0);
                          const percentage = total > 0 ? (payload[0].value / total) * 100 : 0;
                          return (
                            <div
                              className="p-3 rounded border"
                              style={{
                                backgroundColor: colors.tooltipBg,
                                borderColor: colors.lavender,
                              }}
                            >
                              <p style={{ color: colors.coral }}>
                                {payload[0].name}
                              </p>
                              <p style={{ color: colors.white }}>
                                {payload[0].value} patients ({percentage.toFixed(0)}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      content={(props) => {
                        const { payload } = props;
                        return (
                          <ul className="flex justify-center gap-4">
                            {payload.map((entry, index) => (
                              <li
                                key={`item-${index}`}
                                className="flex items-center text-sm"
                                style={{ color: entry.color }}
                              >
                                <span
                                  className="w-3 h-3 mr-2 inline-block"
                                  style={{ backgroundColor: entry.color }}
                                ></span>
                                {entry.value}
                              </li>
                            ))}
                          </ul>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Weekly Utilization */}
          <div className="bg-white text-[#4A314D] rounded-2xl p-6 shadow-sm border border-[#E6D7E9]">
            <h2 className="text-2xl mb-2" style={{ color: colors.text }}>Weekly Utilization</h2>
            <p className="opacity-60 mb-6" style={{ color: colors.text }}>Hours booked vs capacity</p>
            {loading ? (
              <BarChartSkeleton />
            ) : (
              <div className="bg-white w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid stroke={colors.gridLines} />
                    <XAxis
                      dataKey="date"
                      stroke={colors.text}
                      tickLine={{ stroke: colors.text }}
                      axisLine={{ stroke: colors.text }}
                      tickFormatter={(value) => value.split(" ")[0]}
                      tick={{ fill: colors.text, fontSize: 12 }}
                    />
                    <YAxis
                      stroke={colors.text}
                      tickLine={{ stroke: colors.text }}
                      axisLine={{ stroke: colors.text }}
                      tick={{ fill: colors.text, fontSize: 12 }}
                      label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fill: colors.text, fontSize: 12 } }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(230, 215, 233, 0.2)" }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          const usedHours = item.availability_hours;
                          const totalHours = item.total_potential_appointments;
                          const rate = item.utilizationRate; // Already 0-100
                          return (
                            <div
                              style={{
                                backgroundColor: colors.tooltipBg,
                                padding: "0.75rem",
                                borderRadius: "0.25rem",
                                border: `1px solid ${colors.lavender}`,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                              }}
                            >
                              <p style={{ color: colors.white, fontWeight: 'bold', marginBottom: '0.25rem' }}>{label}</p>
                              <p style={{ color: colors.lavender }}>Used: {usedHours.toFixed(1)} hrs</p>
                              <p style={{ color: colors.white }}>Total: {totalHours.toFixed(1)} hrs</p>
                              <p style={{ color: colors.white }}>Rate: {rate.toFixed(1)}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="total_potential_appointments"
                      shape={<ProportionalBar />}
                      fill={colors.utilizationEmpty}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Revenue Trend */}
          <div className="bg-[#FFFFFF] text-[#4A314D] rounded-2xl p-6 shadow-sm border border-[#E6D7E9]">
            <h2 className="text-2xl mb-2">Revenue Trend</h2>
            <p className="text-[#4A314D] opacity-60 mb-6">
              Weekly revenue performance
            </p>
            {loading ? (
              <LineChartSkeleton />
            ) : (
              <div className="bg-white w-full h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#F4E6E6" strokeDasharray="3 3" />
                    <XAxis
                      stroke="#4A314D"
                      tick={{ fill: "#4A314D" }}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#4A314D"
                      tick={{ fill: "#4A314D" }}
                      axisLine={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="weeklyRevenue"
                      stroke="#E6D7E9"
                      strokeWidth={2}
                      dot={false}
                    />
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#E6D7E9"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="100%"
                          stopColor="#FFF5F3"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="weeklyRevenue"
                      fill="url(#revenueGradient)"
                      stroke="none"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="mt-4">
              {(() => {
                // Calculate current month (last 4 weeks) average
                const currentMonthRevenue =
                  chartData
                    .slice(-4)
                    .reduce((acc, curr) => acc + curr.weeklyRevenue, 0) / 4;

                // Calculate historical average (excluding last 4 weeks)
                const historicalData = chartData.slice(0, -4);
                const historicalAverage = historicalData.length
                  ? historicalData.reduce(
                      (acc, curr) => acc + curr.weeklyRevenue,
                      0
                    ) / historicalData.length
                  : 0;

                // Calculate percentage change
                const percentageChange = historicalAverage
                  ? ((currentMonthRevenue - historicalAverage) /
                      historicalAverage) *
                    100
                  : 0;

                return (
                  <>
                    <p className="text-[#8E4585] text-lg">
                      {percentageChange > 0 ? "Up" : "Down"}{" "}
                      {Math.abs(percentageChange).toFixed(1)}% from average
                    </p>
                    <p className="text-[#4A314D] opacity-60 mt-2">
                      Current month: $
                      {currentMonthRevenue.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                      <br />
                      Historical average: $
                      {historicalAverage.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-[#FFFFFF] text-[#4A314D] rounded-2xl p-6 shadow-sm border border-[#E6D7E9]">
            <h2 className="text-2xl mb-2">Performance Metrics</h2>
            <p className="text-[#4A314D] opacity-60 mb-6">
              Key performance metrics
            </p>
            <div className="mt-6">
              {/* Metric 1: Utilization */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: colors.text }}>Utilization</span>
                  <span className="text-sm font-medium" style={{ color: colors.text }}>
                    {(latestMetrics.booked_rate * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={latestMetrics.booked_rate * 100}
                  style={{ backgroundColor: colors.progressBg }}
                  className="w-full [&>[data-slot=progress-indicator]]:bg-[#E6D7E9]"
                />
              </div>

              {/* Metric 2: Occurred Rate */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: colors.text }}>Occurred Rate</span>
                  <span className="text-sm font-medium" style={{ color: colors.text }}>
                    {(latestMetrics.occurred_rate * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={latestMetrics.occurred_rate * 100}
                  style={{ backgroundColor: colors.progressBg }}
                  className="w-full [&>[data-slot=progress-indicator]]:bg-[#E6D7E9]"
                />
              </div>

              {/* Metric 3: Weekly Revenue */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: colors.text }}>Weekly Revenue</span>
                  <span className="text-sm font-medium" style={{ color: colors.text }}>
                    ${latestMetrics.trailing_weekly_revenue.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={Math.min((latestMetrics.trailing_weekly_revenue / 5000) * 100, 100)}
                  style={{ backgroundColor: colors.progressBg }}
                  className="w-full [&>[data-slot=progress-indicator]]:bg-[#E6D7E9]"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <CornerHealthLogo />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Update chart text styling
const chartTextStyle = {
  fontFamily: "Nunito",
  fontSize: 12,
  fontWeight: 500,
  fill: "#4A314D",
};

// Update tooltips and other text elements
const tooltipStyle =
  "font-['Nunito'] font-medium tracking-[-0.02em] leading-none";
