import { FormInstance, message } from "antd";
import { ZodObject, ZodRawShape } from "zod";

export function getValidationRules<T extends ZodRawShape>(
  schema: ZodObject<T>,
  field: keyof T
) {
  return [
    {
      validator: async (_: unknown, value: unknown) => {
        const result = schema.shape[field].safeParse(value);
        if (result.success) return Promise.resolve();
        return Promise.reject(new Error(result.error.errors[0].message));
      },
    },
  ];
}

export function handleServerErrors(error: unknown, form?: FormInstance) {
  if (error && typeof error === "object" && !Array.isArray(error) && form) {
    form.setFields(
      Object.entries(error).map(([name, errors]) => ({
        name: name.split("."),
        errors: Array.isArray(errors) ? errors : [String(errors)],
      }))
    );
  } else if (typeof error === "string") {
    message.error(error);
  } else {
    message.error("Save error");
  }
}
