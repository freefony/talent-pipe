import { z } from "zod";

const applicationStageSchema = z.enum([
  "applied",
  "screening",
  "interview_scheduled",
  "technical_assessment",
  "cultural_interview",
  "offer_pending",
  "offer_accepted",
  "offer_declined",
  "rejected"
]);

export type ApplicationStage = z.infer<typeof applicationStageSchema>;

const applicationSourceSchema = z.enum([
  "website",
  "referral",
  "linkedin",
  'stack_overflow',
  'twitter',
  'recruiter',
  'other'
]);

export const jobApplicationSchema = z.object({
  id: z.string(),
  candidate: z.string(),
  job_opening_id: z.string(),
  status: applicationStageSchema,
  resume_url: z.string().url(),
  cover_letter: z.string().optional(),
  salary_expectation: z.number(),
  source: applicationSourceSchema,
  notes: z.array(z.object({
    content: z.string(),
    created_at: z.string(),
    author: z.string()
  })),
  interview_dates: z.array(z.object({
    date: z.string().datetime(),
    type: z.enum(["screening", "technical", "cultural", "final"]),
    interviewer: z.string(),
    feedback: z.string().optional()
  })),
  rejection_reason: z.string().optional(),
  last_contacted_at: z.string().datetime().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type JobApplication = z.infer<typeof jobApplicationSchema>;

export type NewJobApplication = Omit<JobApplication, "id">;
