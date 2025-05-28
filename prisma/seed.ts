import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();

export const PRACTICE_NAMES = [
  "Main Street Medical",
  "Downtown Health",
  "Wellness Center",
];
export const ORGS = ["Healthcare Corp", "Medical Group A", "Wellness Network"];

export const APPOINTMENT_TYPES = [
  "New Patient",
  "Follow-up",
  "Medication Refill",
  "Established Patient",
  "New Patient Visit",
  "Annual Visit",
  "Hormone Optimization",
];

export const CONTACT_TYPES = ["in-person", "video", "phone"];
export const PM_STATUSES = ["scheduled", "completed", "cancelled", "no-show"];
export const INSURANCE_PROVIDERS = [
  "Blue Cross",
  "Aetna",
  "UnitedHealth",
  "Cigna",
  "Medicare",
];
export const CPT_CODES = ["99213", "99214", "99215", "99205", "99204"];

export const generateId = () => faker.string.uuid();

interface Provider {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  practice?: string;
  org: string;
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  provider_id: string;
  practice?: string;
  org: string;
  created_at: Date;
}

interface AppointmentMetric {
  id: string;
  week_start_date: Date;
  provider_id: string;
  appointment_type: string;
  mean_duration_in_hours: number;
  practice?: string;
  org?: string;
  mean_appointment_revenue?: number;
  created_at: Date;
  updated_at: Date;
}

interface ProjectedMetric {
  id: string;
  week_start_date: Date;
  provider_id: string;
  provider_first_name?: string;
  provider_last_name?: string;
  practice?: string;
  org?: string;
  trailing_weekly_revenue: number;
  total_potential_appointments: number;
  occurred_rate: number;
  upcoming_existing_patient_appointments: number;
  upcoming_new_patient_appointments: number;
  in_visit_followup_count: number;
  in_visit_followup_rate: number;
  saved_cancellation_count: number;
  saved_cancellation_rate: number;
  occurred_count: number;
  availability_hours: number;
  booked_count: number;
  cancellation_count: number;
  mean_duration_in_hours: number;
  no_show_count: number;
  no_show_rate: number;
  same_day_cancellation_count: number;
  same_day_cancellation_rate: number;
  other_count: number;
  other_rate: number;
  attended_rate: number;
  booked_rate: number;
  mean_appointment_revenue?: number;
  total_available_hours: number;
  total_busy_hours: number;
  trailing_saved_cancellation_count: number;
  trailing_saved_cancellation_rate: number;
  created_at: Date;
  updated_at: Date;
}

async function seedProviders(count: number): Promise<Provider[]> {
  const data: Provider[] = [];
  for (let i = 0; i < count; i++) {
    const provider = await prisma.providers.create({
      data: {
        id: generateId(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        practice: faker.helpers.arrayElement(PRACTICE_NAMES),
        org: faker.helpers.arrayElement(ORGS),
      },
    });
    data.push({
      ...provider,
      practice: provider.practice || undefined,
    });
  }

  return data;
}

async function seedPatients(
  count: number,
  providers: Provider[]
): Promise<Patient[]> {
  const data: Patient[] = [];

  for (let i = 0; i < count; i++) {
    const provider = faker.helpers.arrayElement(providers);
    const patient = await prisma.patients.create({
      data: {
        id: generateId(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        provider_id: provider.id,
        practice: provider.practice,
        org: provider.org,
        created_at: faker.date.past(),
      },
    });
    // Convert null values to empty strings before pushing
    const sanitizedPatient = {
      ...patient,
      practice: patient.practice || "",
      org: patient.org || "",
      provider_id: patient.provider_id || "",
    };
    data.push(sanitizedPatient);
  }

  return data;
}

async function seedAppointmentMetrics(
  providers: Provider[]
): Promise<AppointmentMetric[]> {
  const data: AppointmentMetric[] = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  // Helper function to generate random number between min and max with 2 decimal places
  const randomFloat = (min: number, max: number) => {
    return Number((Math.random() * (max - min) + min).toFixed(2));
  };

  for (let i = 0; i < 52; i++) {
    const weekDate = new Date(startDate);
    weekDate.setDate(weekDate.getDate() + i * 7);

    for (const provider of providers) {
      for (const appointmentType of APPOINTMENT_TYPES) {
        const metric = await prisma.aggregated_appointment_metrics.create({
          data: {
            id: generateId(),
            week_start_date: weekDate,
            provider_id: provider.id,
            appointment_type: appointmentType,
            mean_duration_in_hours: randomFloat(0.25, 2),
            practice: provider.practice || undefined,
            org: provider.org || undefined,
            mean_appointment_revenue: randomFloat(100, 500),
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
        data.push({
          ...metric,
          practice: metric.practice || undefined,
          org: metric.org || undefined,
          mean_appointment_revenue:
            metric.mean_appointment_revenue || undefined,
        });
      }
    }
  }
  return data;
}

async function seedProjectedMetrics(
  providers: Provider[]
): Promise<ProjectedMetric[]> {
  const data: ProjectedMetric[] = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const randomFloat = (min: number, max: number) => {
    return Number((Math.random() * (max - min) + min).toFixed(2));
  };

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  for (let i = 0; i < 52; i++) {
    const weekDate = new Date(startDate);
    weekDate.setDate(weekDate.getDate() + i * 7);

    for (const provider of providers) {
      const metric = await prisma.projected_appointment_metrics.create({
        data: {
          id: generateId(),
          week_start_date: weekDate,
          provider_id: provider.id,
          provider_first_name: provider.first_name,
          provider_last_name: provider.last_name,
          practice: provider.practice || undefined,
          org: provider.org || undefined,
          trailing_weekly_revenue: randomFloat(1000, 5000),
          total_potential_appointments: randomInt(20, 40),
          occurred_rate: randomFloat(0.7, 0.95),
          upcoming_existing_patient_appointments: randomInt(10, 20),
          upcoming_new_patient_appointments: randomInt(5, 10),
          in_visit_followup_count: randomInt(3, 8),
          in_visit_followup_rate: randomFloat(0.1, 0.3),
          saved_cancellation_count: randomInt(1, 5),
          saved_cancellation_rate: randomFloat(0.05, 0.15),
          occurred_count: randomInt(15, 30),
          availability_hours: randomFloat(30, 40),
          booked_count: randomInt(20, 35),
          cancellation_count: randomInt(1, 5),
          mean_duration_in_hours: randomFloat(0.5, 2),
          no_show_count: randomInt(0, 3),
          no_show_rate: randomFloat(0, 0.1),
          same_day_cancellation_count: randomInt(0, 3),
          same_day_cancellation_rate: randomFloat(0, 0.1),
          other_count: randomInt(0, 2),
          other_rate: randomFloat(0, 0.05),
          attended_rate: randomFloat(0.8, 0.95),
          booked_rate: randomFloat(0.7, 0.9),
          mean_appointment_revenue: randomFloat(150, 400),
          total_available_hours: randomFloat(35, 45),
          total_busy_hours: randomFloat(25, 35),
          trailing_saved_cancellation_count: randomInt(5, 15),
          trailing_saved_cancellation_rate: randomFloat(0.05, 0.15),
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      data.push({
        ...metric,
        provider_first_name: metric.provider_first_name || undefined,
        provider_last_name: metric.provider_last_name || undefined,
        practice: metric.practice || undefined,
        org: metric.org || undefined,
        mean_appointment_revenue: metric.mean_appointment_revenue || undefined,
      });
    }
  }
  return data;
}

async function main() {
  try {
    const providers = await seedProviders(5);
    console.log(
      "Created providers:",
      providers.map((p) => ({
        id: p.id,
        name: `${p.first_name} ${p.last_name}`,
      }))
    );

    const patients = await seedPatients(20, providers);
    const metrics = await seedAppointmentMetrics(providers);
    const projectedMetrics = await seedProjectedMetrics(providers);

    // Log the first projected metric for verification
    const sampleMetric = projectedMetrics[0];
    console.log("Sample projected metric:", {
      provider_id: sampleMetric.provider_id,
      week_start_date: sampleMetric.week_start_date,
      booked_rate: sampleMetric.booked_rate,
    });

    console.log(
      `Seeded ${providers.length} providers, ${patients.length} patients, ${metrics.length} metrics, and ${projectedMetrics.length} projected metrics`
    );
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
