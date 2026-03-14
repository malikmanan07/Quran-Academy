CREATE TABLE "certificates" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"url" text,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "daily_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"teacher_id" integer NOT NULL,
	"date" date NOT NULL,
	"sabaq_surah" varchar(255),
	"sabaq_ayat_from" varchar(50),
	"sabaq_ayat_to" varchar(50),
	"sabaq_grade" varchar(50),
	"sabqi_grade" varchar(50),
	"manzil_grade" varchar(50),
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "enrollment_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"preferred_time" varchar(30),
	"preferred_days" varchar(100),
	"message" text,
	"status" varchar(20) DEFAULT 'pending',
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "feedback_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"teacher_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"overall_grade" text DEFAULT 'good' NOT NULL,
	"sabaq_progress" text,
	"tajweed_progress" text,
	"behavior" text,
	"recommendations" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" integer NOT NULL,
	"receiver_id" integer NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "parent_student" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quran_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"para_number" integer NOT NULL,
	"status" varchar(20) DEFAULT 'not-started',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trial_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone" varchar(30),
	"country" varchar(60),
	"timezone" varchar(60),
	"course_id" integer,
	"preferred_time" varchar(30),
	"message" text,
	"status" varchar(20) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "attendance" ALTER COLUMN "status" SET DEFAULT 'present';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "teacher_id" integer;--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "meeting_platform" varchar(30) DEFAULT 'other';--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "meeting_id" varchar(100);--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "scheduled_by" integer;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payment_method" varchar(30);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "transaction_id" varchar(100);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "submitted_at" timestamp;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "specialization" varchar(100);--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_progress" ADD CONSTRAINT "daily_progress_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_progress" ADD CONSTRAINT "daily_progress_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment_requests" ADD CONSTRAINT "enrollment_requests_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment_requests" ADD CONSTRAINT "enrollment_requests_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_reports" ADD CONSTRAINT "feedback_reports_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_reports" ADD CONSTRAINT "feedback_reports_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_student" ADD CONSTRAINT "parent_student_parent_id_users_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_student" ADD CONSTRAINT "parent_student_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quran_progress" ADD CONSTRAINT "quran_progress_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trial_requests" ADD CONSTRAINT "trial_requests_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cert_student_idx" ON "certificates" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "cert_course_idx" ON "certificates" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "enroll_student_idx" ON "enrollment_requests" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "enroll_status_idx" ON "enrollment_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ps_parent_idx" ON "parent_student" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "ps_student_idx" ON "parent_student" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "qp_student_idx" ON "quran_progress" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "qp_para_idx" ON "quran_progress" USING btree ("para_number");--> statement-breakpoint
CREATE INDEX "trial_status_idx" ON "trial_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "trial_email_idx" ON "trial_requests" USING btree ("email");--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_scheduled_by_users_id_fk" FOREIGN KEY ("scheduled_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "att_student_idx" ON "attendance" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "att_class_idx" ON "attendance" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "att_date_idx" ON "attendance" USING btree ("date");--> statement-breakpoint
CREATE INDEX "class_teacher_idx" ON "classes" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "class_student_idx" ON "classes" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "class_date_idx" ON "classes" USING btree ("class_date");--> statement-breakpoint
CREATE INDEX "class_status_idx" ON "classes" USING btree ("status");--> statement-breakpoint
CREATE INDEX "course_name_idx" ON "courses" USING btree ("name");--> statement-breakpoint
CREATE INDEX "payment_student_idx" ON "payments" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "payment_status_idx" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "progress_student_idx" ON "progress" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "progress_teacher_idx" ON "progress" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "status_idx" ON "users" USING btree ("status");--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_name_unique" UNIQUE("name");