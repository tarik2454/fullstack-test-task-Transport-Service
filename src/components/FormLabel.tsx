type FormLabelProps = {
  text: string;
  required?: boolean;
};

export function FormLabel({ text, required = true }: FormLabelProps) {
  return (
    <span className="flex items-center gap-[2px]">
      {text}
      {required && <span className="text-red-500">*</span>}
    </span>
  );
}
