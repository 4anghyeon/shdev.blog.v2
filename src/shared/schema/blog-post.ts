import { z } from "zod";
import { SERIES_ITEMS } from "#/shared/constant/series-itmes";

export const blogPostSchema = z.object({
  title: z.string(),
  published: z.iso.date(),
  updated: z.iso.date().optional(),
  description: z.string(),
  tags: z.array(z.string()),
  content: z.string(),
  series: z.enum(SERIES_ITEMS.map((item) => item.id)).optional(),
});

export type BlogPost = z.infer<typeof blogPostSchema> & {
  slug: string;
};
