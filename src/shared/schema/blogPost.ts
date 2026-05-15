import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  published: z.iso.date(),
  updated: z.iso.date().optional(),
  description: z.string(),
  tags: z.array(z.string()),
  content: z.string(),
  series: z.enum(["multiparadigm-programming"]).optional(),
});

export type BlogPost = z.infer<typeof blogPostSchema>;
