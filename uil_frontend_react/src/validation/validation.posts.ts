import { z } from "zod";
import { PostType } from "@/lib/enums";
import { MAX_FILE_SIZE_MB } from "@/lib/constants";

// --- Reusable validations ---
const validations = {
  image: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "Only JPG, PNG, or WEBP images are allowed",
      },
    )
    .refine((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024, {
      message: `Max size is ${MAX_FILE_SIZE_MB}MB`,
    })
    .optional()
    .nullable(),
};

// --- Base Schema ---
const postBaseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  post_type: z.enum(PostType, {
    message: "Please select a post type",
  }),
  content: z.string().min(1, "Content is required"),
  is_internal_only: z.boolean().default(false),
  is_published: z.boolean().default(false),
  expires_at: z.string().nullish(),
});

// --- Create Schema ---
export const postCreateSchema = postBaseSchema.extend({
  image: validations.image,
});

export type PostCreateInput = z.infer<typeof postCreateSchema>;

// --- Update Schema ---
export const postUpdateSchema = postCreateSchema.partial().extend({
  image: validations.image,
});

export type PostUpdateInput = z.infer<typeof postUpdateSchema>;

export const postDefaultValues: Partial<PostCreateInput> = {
  title: "",
  post_type: PostType.ANNOUNCEMENT,
  content: "",
  is_internal_only: false,
  is_published: false,
  expires_at: null,
};
