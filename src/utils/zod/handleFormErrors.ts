import { FormInstance, message } from "antd";

export function handleFormErrors(error: unknown, form: FormInstance) {
  if (error && typeof error === "object" && !Array.isArray(error)) {
    form.setFields(
      Object.entries(error).map(([name, errors]) => ({
        name: [name],
        errors: Array.isArray(errors) ? errors : [String(errors)],
      }))
    );
  } else if (typeof error === "string") {
    message.error(error);
  } else {
    message.error("Save error");
  }
}
