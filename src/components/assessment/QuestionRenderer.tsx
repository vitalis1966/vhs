import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AssessmentQuestion } from "@/types/assessment";

interface Props {
  question: AssessmentQuestion;
  value: string;
  jsonValue: any;
  onChange: (value: string, jsonValue?: any) => void;
}

export function QuestionRenderer({ question, value, jsonValue, onChange }: Props) {
  const { field_type, question_text, helper_text, options, is_required } = question;

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-base font-semibold text-foreground">
          {question_text}
          {is_required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {helper_text && (
          <p className="text-sm text-muted-foreground mt-1">{helper_text}</p>
        )}
      </div>

      {field_type === "short_text" && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={500}
          placeholder="Your answer..."
        />
      )}

      {field_type === "long_text" && (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={5000}
          rows={4}
          placeholder="Your answer..."
        />
      )}

      {field_type === "dropdown" && options && (
        <Select value={value} onValueChange={(v) => onChange(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field_type === "single_select" && options && (
        <RadioGroup value={value} onValueChange={(v) => onChange(v)} className="space-y-2">
          {options.map((opt) => (
            <div
              key={opt}
              className="flex items-center gap-3 bg-secondary/30 rounded-lg px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <RadioGroupItem value={opt} id={`${question.id}-${opt}`} />
              <Label htmlFor={`${question.id}-${opt}`} className="cursor-pointer text-sm font-medium flex-1">
                {opt}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {field_type === "multi_select" && options && (
        <div className="space-y-2">
          {options.map((opt) => {
            const selected: string[] = jsonValue || [];
            const isChecked = selected.includes(opt);
            return (
              <div
                key={opt}
                className="flex items-center gap-3 bg-secondary/30 rounded-lg px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <Checkbox
                  id={`${question.id}-${opt}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    const next = checked
                      ? [...selected, opt]
                      : selected.filter((s) => s !== opt);
                    onChange(next.join(", "), next);
                  }}
                />
                <Label htmlFor={`${question.id}-${opt}`} className="cursor-pointer text-sm font-medium flex-1">
                  {opt}
                </Label>
              </div>
            );
          })}
        </div>
      )}

      {field_type === "yes_no" && (
        <RadioGroup value={value} onValueChange={(v) => onChange(v)} className="flex gap-4">
          <div className="flex items-center gap-2 bg-secondary/30 rounded-lg px-5 py-3 hover:bg-secondary/50 transition-colors cursor-pointer">
            <RadioGroupItem value="yes" id={`${question.id}-yes`} />
            <Label htmlFor={`${question.id}-yes`} className="cursor-pointer text-sm font-medium">Yes</Label>
          </div>
          <div className="flex items-center gap-2 bg-secondary/30 rounded-lg px-5 py-3 hover:bg-secondary/50 transition-colors cursor-pointer">
            <RadioGroupItem value="no" id={`${question.id}-no`} />
            <Label htmlFor={`${question.id}-no`} className="cursor-pointer text-sm font-medium">No</Label>
          </div>
        </RadioGroup>
      )}

      {field_type === "number" && (
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="max-w-xs"
        />
      )}

      {field_type === "date" && (
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="max-w-xs"
        />
      )}

      {field_type === "file_upload" && (
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          <p className="text-sm text-muted-foreground">File upload will be available soon.</p>
          <p className="text-xs text-muted-foreground/70 mt-1">This feature is under development.</p>
        </div>
      )}
    </div>
  );
}
