"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const appointmentData = {
  labels: ["Feb", "Mar", "Apr"],
  datasets: [
    {
      label: "Appointments",
      data: [20, 40, 104],
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};

const revenueData = {
  labels: ["Feb", "Mar", "Apr"],
  datasets: [
    {
      label: "Revenue",
      data: [2000, 3500, 5200],
      borderColor: "rgb(53, 162, 235)",
      tension: 0.1,
    },
  ],
};

const followupData = {
  labels: ["Apr 13", "Apr 20", "Apr 27"],
  datasets: [
    {
      label: "Actual",
      data: [10, 25, 50],
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
    {
      label: "Goal",
      data: [40, 40, 40],
      borderColor: "rgb(255, 99, 132)",
      borderDash: [5, 5],
      tension: 0.1,
    },
  ],
};

const appointmentTypeData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "New Patient",
      data: [0, 0, 0, 0],
      borderColor: "rgb(255, 99, 132)",
      tension: 0.1,
    },
    {
      label: "Established",
      data: [20, 25, 30, 20],
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
    {
      label: "New Visit",
      data: [20, 25, 30, 20],
      borderColor: "rgb(255, 205, 86)",
      tension: 0.1,
    },
    {
      label: "Established Long",
      data: [40, 35, 30, 40],
      borderColor: "rgb(54, 162, 235)",
      tension: 0.1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const label = context.dataset.label || "";
          const value = context.parsed.y;
          return (
            label +
            ": " +
            (context.dataset.label === "Revenue"
              ? "$" + value.toLocaleString()
              : value)
          );
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value: any) {
          if (this.chart.canvas.id === "revenue-chart") {
            return "$" + value.toLocaleString();
          }
          return value;
        },
      },
    },
  },
};

// Types for our data
type AppointmentMetrics = {
  date: string;
  count: number;
};

type RevenueMetrics = {
  date: string;
  amount: number;
};

type FollowupMetrics = {
  date: string;
  actual: number;
  goal: number;
};

type AppointmentTypeMetrics = {
  week: string;
  newPatient: number;
  established: number;
  newVisit: number;
  establishedLong: number;
};

const monthOrder = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Add this line before the Home component
const availableMonths = monthOrder;

export default function Home() {
  const [appointmentMetrics, setAppointmentMetrics] = useState<
    AppointmentMetrics[]
  >([]);
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics[]>([]);
  const [followupMetrics, setFollowupMetrics] = useState<FollowupMetrics[]>([]);
  const [appointmentTypeMetrics, setAppointmentTypeMetrics] = useState<
    AppointmentTypeMetrics[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Moved this up with other hooks
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, revenueRes, followupRes, typeRes] =
          await Promise.all([
            fetch("/api/metrics/appointments"),
            fetch("/api/metrics/revenue"),
            fetch("/api/metrics/followup"),
            fetch("/api/metrics/appointment-types"),
          ]);

        const [appointmentsData, revenueData, followupData, typeData] =
          await Promise.all([
            appointmentsRes.json(),
            revenueRes.json(),
            followupRes.json(),
            typeRes.json(),
          ]);

        setAppointmentMetrics(appointmentsData);
        setRevenueMetrics(revenueData);
        setFollowupMetrics(followupData);
        setAppointmentTypeMetrics(typeData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching metrics:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const followupData = {
    labels: followupMetrics.map((m) => m.date),
    datasets: [
      {
        label: "Actual",
        data: followupMetrics.map((m) => m.actual),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Goal",
        data: followupMetrics.map((m) => m.goal),
        borderColor: "rgb(255, 99, 132)",
        borderDash: [5, 5],
        tension: 0.1,
      },
    ],
  };

  const appointmentTypeData = {
    labels: appointmentTypeMetrics.map((m) => m.week),
    datasets: [
      {
        label: "New Patient",
        data: appointmentTypeMetrics.map((m) => m.newPatient),
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "Established",
        data: appointmentTypeMetrics.map((m) => m.established),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "New Visit",
        data: appointmentTypeMetrics.map((m) => m.newVisit),
        borderColor: "rgb(255, 205, 86)",
        tension: 0.1,
      },
      {
        label: "Established Long",
        data: appointmentTypeMetrics.map((m) => m.establishedLong),
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  // Calculate totals for each appointment type
  const calculateTypeMetrics = () => {
    const latestMetrics = appointmentTypeMetrics[
      appointmentTypeMetrics.length - 1
    ] || {
      newPatient: 0,
      established: 0,
      newVisit: 0,
      establishedLong: 0,
    };

    // Count non-zero values to calculate actual percentages
    const nonZeroValues = Object.values(latestMetrics).filter(
      (value) => typeof value === "number" && value > 0
    ).length;

    // Calculate total of actual values (not percentages)
    const total = Object.values(latestMetrics).reduce(
      (sum, value) => (typeof value === "number" ? sum + value : sum),
      0
    );

    // Calculate average (if we have values)
    const average = nonZeroValues > 0 ? total / nonZeroValues : 0;

    // Calculate trend using the previous week's data
    const previousMetrics =
      appointmentTypeMetrics[appointmentTypeMetrics.length - 2] ||
      latestMetrics;
    const previousTotal = Object.values(previousMetrics).reduce(
      (sum, value) => (typeof value === "number" ? sum + value : sum),
      0
    );

    const trend =
      previousTotal > 0
        ? (((total - previousTotal) / previousTotal) * 100).toFixed(1)
        : "0.0";

    return {
      total: Math.min(100, total), // Cap at 100%
      average: Math.min(100, average),
      trend,
    };
  };

  // Update the return JSX for the Monthly Appointment Type Percentage card
  const { total, average, trend } = calculateTypeMetrics();

  const sortData = (data: any[], field: "count" | "amount") => {
    return [...data].sort((a, b) => {
      const aValue = field === "count" ? a.count : a.amount;
      const bValue = field === "count" ? b.count : b.amount;
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const filterDataByMonth = (data: any[], field: "count" | "amount") => {
    if (selectedMonth === "all") {
      return sortData(data, field);
    }
    const filteredData = data.filter((item) => item.date === selectedMonth);
    return sortData(filteredData, field);
  };

  // Update the display values based on filtered data
  const getFilteredDisplayValue = (data: any[], field: "count" | "amount") => {
    const filteredData = filterDataByMonth(data, field);
    if (filteredData.length === 0) return 0;
    return filteredData[filteredData.length - 1][field];
  };

  const appointmentData = {
    labels: filterDataByMonth(appointmentMetrics, "count").map((m) => m.date),
    datasets: [
      {
        label: "Appointments (Current)",
        data: filterDataByMonth(appointmentMetrics, "count").map(
          (m) => m.count
        ),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const revenueData = {
    labels: filterDataByMonth(revenueMetrics, "amount").map((m) => m.date),
    datasets: [
      {
        label: "Revenue",
        data: filterDataByMonth(revenueMetrics, "amount").map((m) => m.amount),
        borderColor: "rgb(53, 162, 235)",
        tension: 0.1,
      },
    ],
  };

  const latestFollowupRate =
    followupMetrics.length > 0
      ? followupMetrics[followupMetrics.length - 1].actual
      : 0;

  const followupGoal =
    followupMetrics.length > 0
      ? followupMetrics[followupMetrics.length - 1].goal
      : 40;

  const latestRevenue =
    revenueMetrics.length > 0
      ? revenueMetrics[revenueMetrics.length - 1].amount
      : 0;

  // Calculate percentages for the latest month
  const getMonth = (week) => week.split(" ")[0];

  // Group by month
  const months = {};
  appointmentTypeMetrics.forEach((week) => {
    const month = getMonth(week.week);
    if (!months[month]) months[month] = [];
    months[month].push(week);
  });

  // Get the latest month
  const monthKeys = Object.keys(months);
  const latestMonth = monthKeys[monthKeys.length - 1];
  const latestWeeks = months[latestMonth] || [];

  // Sum each type for the latest month
  const typeTotals = {
    newPatient: 0,
    established: 0,
    establishedLong: 0,
    newVisit: 0,
  };
  latestWeeks.forEach((w) => {
    typeTotals.newPatient += w.newPatient || 0;
    typeTotals.established += w.established || 0;
    typeTotals.establishedLong += w.establishedLong || 0;
    typeTotals.newVisit += w.newVisit || 0;
  });
  const monthTotal = Object.values(typeTotals).reduce((a, b) => a + b, 0);

  // Calculate percentages
  const typePercentages = {};
  Object.entries(typeTotals).forEach(([type, value]) => {
    typePercentages[type] =
      monthTotal > 0 ? Math.round((value / monthTotal) * 100) : 0;
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Practice Growth Phx</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Occurred Appointments Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Occurred Appointments</CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-sm border rounded p-1"
              >
                <option value="all">All Months</option>
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <button
                onClick={toggleSort}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sort {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getFilteredDisplayValue(appointmentMetrics, "count")}
            </div>
            <div className="h-[200px]">
              <Line options={chartOptions} data={appointmentData} />
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Monthly Revenue</CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-sm border rounded p-1"
              >
                <option value="all">All Months</option>
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <button
                onClick={toggleSort}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sort {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {revenueMetrics.length > 0
                ? (
                    revenueMetrics[revenueMetrics.length - 1].amount / 1000
                  ).toFixed(1)
                : 0}
              K
            </div>
            <div className="h-[200px]">
              <Line options={chartOptions} data={revenueData} />
            </div>
          </CardContent>
        </Card>

        {/* Follow-up Rates Card */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Follow-up Rates and Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <div>
                <div className="text-sm text-muted-foreground">Actual</div>
                <div className="text-2xl font-bold">
                  {latestFollowupRate.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Goal</div>
                <div className="text-2xl font-bold">{followupGoal}%</div>
              </div>
            </div>
            <div className="h-[200px]">
              <Line options={chartOptions} data={followupData} />
            </div>
          </CardContent>
        </Card>

        {/* Projected Value Card */}
        <Card>
          <CardHeader>
            <CardTitle>4 Days Projected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${((latestRevenue * 1.2) / 1000).toFixed(1)}K
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Type Percentage Card */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Monthly Appointment Type Percentage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* <div>
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-bold">{total.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Average</div>
              <div className="text-2xl font-bold">
                {average.toFixed(1)}%/type
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Trend</div>
              <div className="text-2xl font-bold">{trend}%</div>
            </div> */}
          </div>
          <div className="flex gap-8 mb-4">
            <div>
              <div className="text-sm text-muted-foreground">New Patient</div>
              <div className="text-2xl font-bold">
                {typePercentages.newPatient}%
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Established Patient
              </div>
              <div className="text-2xl font-bold">
                {typePercentages.established}%
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Established Long
              </div>
              <div className="text-2xl font-bold">
                {typePercentages.establishedLong}%
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">New Visit</div>
              <div className="text-2xl font-bold">
                {typePercentages.newVisit}%
              </div>
            </div>
          </div>
          <div className="h-[200px]">
            <Line options={chartOptions} data={appointmentTypeData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
