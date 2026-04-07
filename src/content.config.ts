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
    badge: z.string().optional(),
    recurrence: recurrenceSchema
  })
});

const localizacaoProgramacao = defineCollection({
  schema: z.object({
    title: z.string(),
    schedule: z.string(),
    summary: z.string().optional(),
    published: z.boolean().default(true),
    order: z.number().int().default(0)
  })
});

const localizacaoFaq = defineCollection({
  schema: z.object({
    question: z.string(),
    published: z.boolean().default(true),
    order: z.number().int().default(0)
  })
});

const grupos = defineCollection({
  schema: z.object({
    title: z.string(),
    audience: z.string(),
    schedule: z.string(),
    summary: z.string().optional(),
    published: z.boolean().default(true),
    order: z.number().int().default(0)
  })
});

export const collections = {
  cronograma,
  localizacaoProgramacao,
  localizacaoFaq,
  grupos
};
