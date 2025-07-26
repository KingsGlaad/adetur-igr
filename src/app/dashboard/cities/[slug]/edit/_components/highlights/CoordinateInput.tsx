import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CoordinateInputProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder: string;
  error?: string;
}

export function CoordinateInput({
  label,
  value,
  onChange,
  placeholder,
  error,
}: CoordinateInputProps) {
  const [inputValue, setInputValue] = useState(value?.toString() || "");

  useEffect(() => {
    setInputValue(value?.toString() || "");
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^0-9.-]/g, "");
    setInputValue(sanitizedValue);
  };

  const handleBlur = () => {
    if (
      inputValue.trim() === "" ||
      inputValue.trim() === "-" ||
      inputValue.trim() === "."
    ) {
      onChange(undefined);
      return;
    }

    const parsedValue = parseFloat(inputValue);

    if (!isNaN(parsedValue)) {
      onChange(parsedValue);
    } else {
      setInputValue(value?.toString() || "");
    }
  };

  return (
    <div>
      <Label className={error ? "text-red-500" : ""}>{label}</Label>
      <Input
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
