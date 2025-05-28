-- CreateTable
CREATE TABLE "aggregated_appointment_metrics" (
    "id" TEXT NOT NULL,
    "week_start_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "provider_id" TEXT NOT NULL,
    "appointment_type" TEXT NOT NULL,
    "mean_duration_in_hours" DOUBLE PRECISION NOT NULL,
    "practice" TEXT,
    "org" TEXT,
    "mean_appointment_revenue" DOUBLE PRECISION,

    CONSTRAINT "aggregated_appointment_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT,
    "patient_first_name" TEXT,
    "patient_last_name" TEXT,
    "provider_id" TEXT NOT NULL,
    "provider_first_name" TEXT,
    "provider_last_name" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "length" INTEGER NOT NULL,
    "contact_type" TEXT NOT NULL,
    "appointment_type" TEXT,
    "pm_status" TEXT,
    "pm_status_changed_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "practice" TEXT,
    "org" TEXT,
    "is_first_appointment" BOOLEAN,
    "cancellation_reason" TEXT,
    "pm_status_last_changed_by_id" TEXT,
    "pm_status_last_changed_by_first_name" TEXT,
    "pm_status_last_changed_by_last_name" TEXT,
    "initiator_id" TEXT,
    "patient_reschedule_count" INTEGER NOT NULL DEFAULT 0,
    "client_confirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_forms" (
    "id" TEXT NOT NULL,
    "external_id" TEXT,
    "patient_id" TEXT,
    "appointment_id" TEXT,
    "patient_first_name" TEXT,
    "patient_last_name" TEXT,
    "cash_appointment" BOOLEAN,
    "promo_code" TEXT,
    "practice" TEXT,
    "org" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "billing_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_items" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "patient_first_name" TEXT,
    "patient_last_name" TEXT,
    "description" TEXT NOT NULL,
    "amount_paid" DOUBLE PRECISION NOT NULL,
    "payment_state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "practice" TEXT,
    "org" TEXT,
    "date_of_service" TIMESTAMP(3),
    "is_copay" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "billing_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charting_notes" (
    "id" TEXT NOT NULL,
    "external_id" TEXT,
    "patient_id" TEXT,
    "appointment_id" TEXT,
    "current_summary" TEXT,
    "name" TEXT,
    "finished" BOOLEAN NOT NULL,
    "frozen" BOOLEAN,
    "locked_at" TIMESTAMP(3),
    "locked_by_id" TEXT,
    "patient_first_name" TEXT,
    "patient_last_name" TEXT,
    "signed" BOOLEAN,
    "signed_at" TIMESTAMP(3),
    "cpt_code_1" TEXT,
    "cpt_code_2" TEXT,
    "cpt_code_3" TEXT,
    "cpt_code_4" TEXT,
    "addendum_1" TEXT,
    "addendum_2" TEXT,
    "addendum_3" TEXT,
    "practice" TEXT,
    "org" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "time_mdm_edited" BOOLEAN,
    "discount_code" TEXT,

    CONSTRAINT "charting_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "patient_first_name" TEXT,
    "patient_last_name" TEXT,
    "billing_provider_id" TEXT,
    "billing_provider_name" TEXT,
    "rendering_provider_first_name" TEXT,
    "amount_paid" DOUBLE PRECISION,
    "client_responsibility" DOUBLE PRECISION,
    "copay" DOUBLE PRECISION,
    "copay_still_owed" DOUBLE PRECISION,
    "total_charge" DOUBLE PRECISION,
    "reimbursed_at" TIMESTAMP(3),
    "cpt_code_names" TEXT,
    "date_of_service" TIMESTAMP(3),
    "primary_plan_name" TEXT,
    "reasons" TEXT,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "practice" TEXT,
    "org" TEXT,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intake_flow" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT,
    "patient_first_name" TEXT,
    "patient_last_name" TEXT,
    "practice" TEXT,
    "org" TEXT,
    "status" TEXT,
    "view_url" TEXT,
    "form_type" TEXT,
    "item_type" TEXT,
    "date_to_show" TIMESTAMP(3),
    "display_name" TEXT,
    "form_answer_group_id" TEXT,
    "request_label" TEXT,
    "request_details" TEXT,
    "request_date" TIMESTAMP(3),
    "complete_date" TIMESTAMP(3),

    CONSTRAINT "intake_flow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "provider_id" TEXT,
    "provider_first_name" TEXT,
    "provider_last_name" TEXT,
    "age" TEXT,
    "gender" TEXT,
    "zipcode" TEXT,
    "ref_type" TEXT,
    "ref_source" TEXT,
    "readable_source" TEXT,
    "patient_source" TEXT,
    "patient_source_detail" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "quick_notes" TEXT,
    "primary_ins_id" TEXT,
    "primary_ins_payer_name" TEXT,
    "primary_ins_payer_id" TEXT,
    "secondary_ins_id" TEXT,
    "secondary_ins_payer_name" TEXT,
    "secondary_ins_payer_id" TEXT,
    "tertiary_ins_id" TEXT,
    "tertiary_ins_payer_name" TEXT,
    "tertiary_ins_payer_id" TEXT,
    "practice" TEXT,
    "org" TEXT,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projected_appointment_metrics" (
    "id" TEXT NOT NULL,
    "week_start_date" TIMESTAMP(3) NOT NULL,
    "provider_id" TEXT NOT NULL,
    "provider_first_name" TEXT,
    "provider_last_name" TEXT,
    "trailing_weekly_revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_potential_appointments" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "practice" TEXT,
    "org" TEXT,
    "occurred_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "upcoming_existing_patient_appointments" INTEGER NOT NULL DEFAULT 0,
    "upcoming_new_patient_appointments" INTEGER NOT NULL DEFAULT 0,
    "in_visit_followup_count" INTEGER NOT NULL DEFAULT 0,
    "in_visit_followup_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saved_cancellation_count" INTEGER NOT NULL DEFAULT 0,
    "saved_cancellation_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "occurred_count" INTEGER NOT NULL DEFAULT 0,
    "availability_hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "booked_count" INTEGER NOT NULL DEFAULT 0,
    "cancellation_count" INTEGER NOT NULL DEFAULT 0,
    "mean_duration_in_hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "no_show_count" INTEGER NOT NULL DEFAULT 0,
    "no_show_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "same_day_cancellation_count" INTEGER NOT NULL DEFAULT 0,
    "same_day_cancellation_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "other_count" INTEGER NOT NULL DEFAULT 0,
    "other_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "attended_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "booked_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mean_appointment_revenue" DOUBLE PRECISION,
    "total_available_hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_busy_hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trailing_saved_cancellation_count" INTEGER NOT NULL DEFAULT 0,
    "trailing_saved_cancellation_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "projected_appointment_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "providers" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "practice" TEXT,
    "org" TEXT NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reconciled_claims" (
    "id" SERIAL NOT NULL,
    "practice" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "provider_name" TEXT NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "appointment_date" TIMESTAMP(3) NOT NULL,
    "patient_name" TEXT NOT NULL,
    "appointment_name" TEXT NOT NULL,
    "insurance" TEXT,
    "cpt_code_1" TEXT,
    "cpt_code_2" TEXT,
    "cpt_code_3" TEXT,
    "cpt_code_4" TEXT,
    "time_mdm_edited" BOOLEAN,
    "charting_note_signed_locked" BOOLEAN,
    "billing_type" TEXT,
    "discount_code" TEXT,
    "payment_state" TEXT,
    "copay_cents" INTEGER,
    "copay_charged_at" TIMESTAMP(3),
    "copay_note" TEXT,
    "copay_charged" BOOLEAN,
    "copay_billing_item_id" INTEGER,
    "cash_pay_billing_item_id" INTEGER,
    "cpt_code_1_amount" DOUBLE PRECISION,
    "cpt_code_1_modified" TEXT,
    "cpt_code_1_modified_amount" DOUBLE PRECISION,
    "cpt_code_2_amount" DOUBLE PRECISION,
    "cpt_code_2_modified" TEXT,
    "cpt_code_2_modified_amount" DOUBLE PRECISION,
    "cpt_code_3_amount" DOUBLE PRECISION,
    "cpt_code_3_modified" TEXT,
    "cpt_code_3_modified_amount" DOUBLE PRECISION,
    "cpt_code_4_amount" DOUBLE PRECISION,
    "cpt_code_4_modified" TEXT,
    "cpt_code_4_modified_amount" DOUBLE PRECISION,
    "matched_insurance_name" TEXT,
    "total_contracted_amount" DOUBLE PRECISION,
    "provider_net_amount" DOUBLE PRECISION,
    "submitted" TEXT,
    "submitted_date" TIMESTAMP(3),
    "payment_status" TEXT,
    "cleared_validation_at" TIMESTAMP(3),
    "paid_to_company_at" TIMESTAMP(3),
    "paid_to_provider" TIMESTAMP(3),
    "processing_status" TEXT,
    "internal_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reconciled_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reconciliation_view" (
    "id" SERIAL NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "patient_id" TEXT,
    "patient_first_name" TEXT,
    "patient_last_name" TEXT,
    "provider_name" TEXT,
    "appointment_description" TEXT,
    "appointment_notes" TEXT,
    "insurance" TEXT,
    "appointment_status" TEXT,
    "promo_code" TEXT,
    "appointment_status_needs_review" BOOLEAN,
    "billing_type" TEXT,
    "copay" DOUBLE PRECISION,
    "charting_note_exists" BOOLEAN NOT NULL DEFAULT false,
    "charting_note_signed_locked" BOOLEAN NOT NULL DEFAULT false,
    "copay_charged" BOOLEAN NOT NULL DEFAULT false,
    "payment_state" TEXT,
    "claim_created" BOOLEAN NOT NULL DEFAULT false,
    "claim_status" TEXT,
    "amount_reimbursed" DOUBLE PRECISION,
    "patient_responsibility" DOUBLE PRECISION,
    "time_mdm_edited" BOOLEAN,
    "cpt_code_1" TEXT,
    "cpt_code_2" TEXT,
    "cpt_code_3" TEXT,
    "cpt_code_4" TEXT,
    "claim_cpt_codes" TEXT,
    "addendum_1" TEXT,
    "addendum_2" TEXT,
    "addendum_3" TEXT,
    "practice" TEXT,
    "org" TEXT NOT NULL,
    "quick_notes" TEXT,
    "claim_created_at" TIMESTAMP(3),
    "reimbursed_at" TIMESTAMP(3),
    "discount_code" TEXT,
    "provider_id" TEXT,

    CONSTRAINT "reconciliation_view_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "aggregated_appointment_metric_provider_id_appointment_type__idx" ON "aggregated_appointment_metrics"("provider_id", "appointment_type", "week_start_date");

-- CreateIndex
CREATE UNIQUE INDEX "reconciled_claims_practice_appointment_id_idx" ON "reconciled_claims"("practice", "appointment_id");
