import { FormInstance, message } from "antd";

export function handleErrors(error: unknown, form?: FormInstance) {
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
