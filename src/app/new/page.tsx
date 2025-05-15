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
import { useState, useEffect } from "react";

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

export default function ProjectedMetricsPage() {
  const [projectedMetrics, setProjectedMetrics] = useState<ProjectedMetrics[]>(
    []
  );
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Add provider_id as a query param if not "all"
        const metricsUrl =
          selectedProvider === "all"
            ? "/api/metrics/projected"
            : `/api/metrics/projected?provider_id=${selectedProvider}`;
        const metricsRes = await fetch(metricsUrl);
        const providersRes = await fetch("/api/providers");

        // Log status and content-type
        console.log(
          "metricsRes status:",
          metricsRes.status,
          "content-type:",
          metricsRes.headers.get("content-type")
        );
        console.log(
          "providersRes status:",
          providersRes.status,
          "content-type:",
          providersRes.headers.get("content-type")
        );

        // Optionally, log the raw text if not JSON
        if (
          !metricsRes.headers.get("content-type")?.includes("application/json")
        ) {
          const text = await metricsRes.text();
          console.error("metricsRes is not JSON. Raw response:", text);
          return;
        }
        if (
          !providersRes.headers
            .get("content-type")
            ?.includes("application/json")
        ) {
          const text = await providersRes.text();
          console.error("providersRes is not JSON. Raw response:", text);
          return;
        }

        const [metricsData, providersData] = await Promise.all([
          metricsRes.json(),
          providersRes.json(),
        ]);

        setProjectedMetrics(metricsData);
        setProviders(providersData);
        setLoading(false);
      } catch (err) {
        console.error("Error in fetchData:", err);
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedProvider]);

  const filteredMetrics = projectedMetrics;

  const chartData = {
    labels: filteredMetrics.map((m) =>
      new Date(m.week_start_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Upcoming Existing Patients",
        data: filteredMetrics.map(
          (m) => m.upcoming_existing_patient_appointments
        ),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Upcoming New Patients",
        data: filteredMetrics.map((m) => m.upcoming_new_patient_appointments),
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Projected Appointments",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Appointments",
        },
      },
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const latestMetrics = filteredMetrics[0] || {
    booked_rate: 0,
    occurred_rate: 0,
    availability_hours: 0,
    trailing_weekly_revenue: 0,
    upcoming_existing_patient_appointments: 0,
    upcoming_new_patient_appointments: 0,
    week_start_date: "",
    total_potential_appointments: 0,
  };

  return (
    <>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Projected Metrics</h1>

          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Providers</option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.first_name} {provider.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Booked Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(latestMetrics.booked_rate ?? 0).toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Occurred Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(latestMetrics.occurred_rate ?? 0).toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Available Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(latestMetrics.availability_hours ?? 0).toFixed(1)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Weekly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(latestMetrics.trailing_weekly_revenue ?? 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Appointment Projections
              {selectedProvider !== "all" && (
                <span className="text-sm text-muted-foreground ml-2">
                  for{" "}
                  {providers.find((p) => p.id === selectedProvider)?.first_name}{" "}
                  {providers.find((p) => p.id === selectedProvider)?.last_name}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <Line options={chartOptions} data={chartData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
