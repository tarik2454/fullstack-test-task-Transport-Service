import { z } from "zod";

export function formatZodErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  error.errors.forEach(({ path, message }) => {
    if (path.length > 0) {
      errors[path[0]] = message;
    }
  });
  return errors;
}
