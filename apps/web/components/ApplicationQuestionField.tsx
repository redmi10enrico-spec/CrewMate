import type { ApplicationQuestionRow } from "@crewmate/db";
import { FormField, Input, Select, Textarea } from "@crewmate/ui";

export function ApplicationQuestionField({ question }: { question: ApplicationQuestionRow }) {
  const options = Array.isArray(question.options) ? (question.options as string[]) : [];
  const hint = question.hint ?? undefined;
  const placeholder = question.placeholder ?? undefined;

  switch (question.type) {
    case "textarea":
      return (
        <FormField label={question.label} htmlFor={question.id} hint={hint}>
          <Textarea id={question.id} name={question.id} placeholder={placeholder} required={question.required} />
        </FormField>
      );

    case "number":
      return (
        <FormField label={question.label} htmlFor={question.id} hint={hint}>
          <Input
            id={question.id}
            name={question.id}
            type="number"
            placeholder={placeholder}
            required={question.required}
          />
        </FormField>
      );

    case "select":
      return (
        <FormField label={question.label} htmlFor={question.id} hint={hint}>
          <Select id={question.id} name={question.id} required={question.required} defaultValue="">
            <option value="" disabled>
              Seleziona...
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormField>
      );

    case "radio":
      return (
        <FormField label={question.label} hint={hint}>
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm text-text">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  required={question.required}
                  className="size-4 border-border accent-accent"
                />
                {option}
              </label>
            ))}
          </div>
        </FormField>
      );

    case "checkbox":
      return (
        <label className="flex items-start gap-2 text-sm text-text">
          <input
            type="checkbox"
            name={question.id}
            value="true"
            required={question.required}
            className="mt-0.5 size-4 rounded border-border accent-accent"
          />
          <span>
            {question.label}
            {hint ? <span className="block text-xs text-text-dim">{hint}</span> : null}
          </span>
        </label>
      );

    case "text":
    default:
      return (
        <FormField label={question.label} htmlFor={question.id} hint={hint}>
          <Input id={question.id} name={question.id} placeholder={placeholder} required={question.required} />
        </FormField>
      );
  }
}
