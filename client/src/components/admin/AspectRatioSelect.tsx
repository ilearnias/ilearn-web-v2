import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AspectRatio = 'landscape' | 'portrait' | 'square';

type AspectRatioSelectProps = {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
  disabled?: boolean;
};

export function AspectRatioSelect({ value, onChange, disabled }: AspectRatioSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as AspectRatio)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select aspect ratio" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="landscape">
          Landscape (16:9)
        </SelectItem>
        <SelectItem value="portrait">
          Portrait (9:16)
        </SelectItem>
        <SelectItem value="square">
          Square (1:1)
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
