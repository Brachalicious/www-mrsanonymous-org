import { TRIGGER_OPTIONS } from "@/lib/board-options";

export function TriggerWarningPicker({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  return <fieldset className="mt-4"><legend className="text-sm font-semibold text-foreground">Trigger warnings</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{TRIGGER_OPTIONS.map((warning) => <label key={warning} className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={value.includes(warning)} onChange={(event) => onChange(event.target.checked ? [...value, warning] : value.filter((item) => item !== warning))} />{warning}</label>)}</div></fieldset>;
}