import { defineCollection, z } from "astro:content";

const recurrenceSchema = z
  .object({
    frequency: z.enum(["weekly", "monthlyNth"]),
    until: z.string(),
    interval: z.number().int().positive().default(1),
    nth: z.number().int().min(1).max(5).optional(),
    months: z.array(z.number().int().min(1).max(12)).optional(),
    overrides: z
      .array(
        z.object({
          originalDate: z.string(),
          startDate: z.string(),
          endDate: z.string().optional()
        })
      )
      .optional()
  })
  .optional();

const cronograma = defineCollection({
  schema: z.object({
    title: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    parentId: z.string().optional(),
    location: z.string().optional(),
    summary: z.string().optional(),
    allDay: z.boolean().default(false),
    published: z.boolean().default(true),
    recurrence: recurrenceSchema
  })
});

export const collections = {
  cronograma
};
