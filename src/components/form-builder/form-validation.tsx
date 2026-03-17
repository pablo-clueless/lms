"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  Settings02Icon,
  Upload01Icon,
  Link01Icon,
  Loading01Icon,
} from "@hugeicons/core-free-icons";
import { useRef, useState } from "react";
import { toast } from "sonner";

import type { ApplicationFormFieldDto, FormFieldOption, OptionsApiConfig, OptionsSourceType } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  selected: ApplicationFormFieldDto | null;
  selectedIndex: number | null;
  onUpdateField: (index: number, field: ApplicationFormFieldDto) => void;
}

const parseCSV = (content: string): FormFieldOption[] => {
  const lines = content.trim().split("\n");
  const options: FormFieldOption[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle CSV with or without headers
    const parts = line.split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));

    if (parts.length >= 2) {
      // If two columns: label, value
      options.push({ label: parts[0], value: parts[1] });
    } else if (parts.length === 1) {
      // If one column: use same for label and value
      const val = parts[0];
      options.push({ label: val, value: val.toLowerCase().replace(/\s+/g, "_") });
    }
  }

  return options;
};

export const FormValidation = ({ selected, selectedIndex, onUpdateField }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  if (!selected || selectedIndex === null) {
    return (
      <div className="grid h-100 w-full place-items-center rounded-md border border-dashed">
        <div className="flex flex-col items-center gap-y-2 text-center">
          <div className="bg-muted flex size-12 items-center justify-center rounded-full">
            <HugeiconsIcon icon={Settings02Icon} className="text-muted-foreground size-6" />
          </div>
          <div>
            <p className="font-medium">No field selected</p>
            <p className="text-muted-foreground text-sm">Select a field to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (key: keyof ApplicationFormFieldDto, value: unknown) => {
    onUpdateField(selectedIndex, { ...selected, [key]: value });
  };

  const handleValidationChange = (key: string, value: unknown) => {
    onUpdateField(selectedIndex, {
      ...selected,
      validation: { ...selected.validation, [key]: value },
    });
  };

  const handleApiConfigChange = (key: keyof OptionsApiConfig, value: unknown) => {
    onUpdateField(selectedIndex, {
      ...selected,
      options_api_config: { ...selected.options_api_config, [key]: value } as OptionsApiConfig,
    });
  };

  const handleAddOption = () => {
    const newOption: FormFieldOption = {
      label: `Option ${(selected.options?.length || 0) + 1}`,
      value: `option_${(selected.options?.length || 0) + 1}`,
    };
    handleChange("options", [...(selected.options || []), newOption]);
  };

  const handleUpdateOption = (index: number, key: keyof FormFieldOption, value: string) => {
    const newOptions = [...(selected.options || [])];
    newOptions[index] = { ...newOptions[index], [key]: value };
    handleChange("options", newOptions);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = (selected.options || []).filter((_, i) => i !== index);
    handleChange("options", newOptions);
  };

  const handleClearOptions = () => {
    handleChange("options", []);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const isValidType = validTypes.includes(file.type) || file.name.endsWith(".csv") || file.name.endsWith(".xlsx");

    if (!isValidType) {
      toast.error("Please upload a CSV or Excel file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;

      if (file.name.endsWith(".xlsx")) {
        toast.error("Excel (.xlsx) parsing requires additional setup. Please use CSV format.");
        return;
      }

      try {
        const options = parseCSV(content);
        if (options.length === 0) {
          toast.error("No valid options found in the file");
          return;
        }
        handleChange("options", options);
        handleChange("options_source", "file" as OptionsSourceType);
        toast.success(`Imported ${options.length} options`);
      } catch {
        toast.error("Failed to parse the file");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  const handleFetchFromApi = async () => {
    const config = selected.options_api_config;
    if (!config?.url) {
      toast.error("Please enter an API URL");
      return;
    }

    if (!config.label_field || !config.value_field) {
      toast.error("Please specify the label and value fields");
      return;
    }

    setIsLoadingApi(true);
    try {
      const response = await fetch(config.url, {
        method: config.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const items = Array.isArray(data) ? data : data.data || data.items || data.results || [];

      if (!Array.isArray(items)) {
        throw new Error("Response is not an array");
      }

      const options: FormFieldOption[] = items.map((item: Record<string, unknown>) => ({
        label: String(item[config.label_field] || ""),
        value: String(item[config.value_field] || ""),
      }));

      handleChange("options", options);
      handleChange("options_source", "api" as OptionsSourceType);
      toast.success(`Fetched ${options.length} options from API`);
    } catch (error) {
      toast.error(`Failed to fetch: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoadingApi(false);
    }
  };

  const showOptions = selected.type === "SELECT" || selected.type === "RADIO" || selected.type === "CHECKBOX";
  const showMinMax = selected.type === "NUMBER";
  const showMinMaxLength = selected.type === "TEXT" || selected.type === "TEXTAREA" || selected.type === "EMAIL";
  const showPattern = selected.type === "TEXT" || selected.type === "EMAIL" || selected.type === "PHONE";

  return (
    <div className="w-full space-y-4 rounded-md border p-4">
      <div>
        <h4 className="font-semibold">Field Properties</h4>
        <p className="text-muted-foreground text-xs">Configure the selected field</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs">
            Field Name
          </Label>
          <Input
            id="name"
            value={selected.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="field_name"
            className="h-8 text-sm"
          />
          <p className="text-muted-foreground text-xs">Used as the field identifier (no spaces)</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="label" className="text-xs">
            Label
          </Label>
          <Input
            id="label"
            value={selected.label}
            onChange={(e) => handleChange("label", e.target.value)}
            placeholder="Field Label"
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="placeholder" className="text-xs">
            Placeholder
          </Label>
          <Input
            id="placeholder"
            value={selected.placeholder}
            onChange={(e) => handleChange("placeholder", e.target.value)}
            placeholder="Enter placeholder text"
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="helper_text" className="text-xs">
            Helper Text
          </Label>
          <Textarea
            id="helper_text"
            value={selected.helper_text}
            onChange={(e) => handleChange("helper_text", e.target.value)}
            placeholder="Additional instructions for this field"
            className="min-h-16 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="width" className="text-xs">
            Width
          </Label>
          <Select
            value={String(selected.width)}
            onValueChange={(v) => handleChange("width", Number(v) as 1 | 2 | 3 | 4)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">25% (1/4)</SelectItem>
              <SelectItem value="2">50% (2/4)</SelectItem>
              <SelectItem value="3">75% (3/4)</SelectItem>
              <SelectItem value="4">100% (Full)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showOptions && (
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium">Options</h5>
                <p className="text-muted-foreground text-xs">
                  {selected.options?.length || 0} options configured
                </p>
              </div>
              {(selected.options?.length || 0) > 0 && (
                <Button variant="ghost" size="sm" className="h-6 text-xs text-red-500" onClick={handleClearOptions}>
                  Clear All
                </Button>
              )}
            </div>

            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-8">
                <TabsTrigger value="manual" className="text-xs">
                  Manual
                </TabsTrigger>
                <TabsTrigger value="file" className="text-xs">
                  CSV/Excel
                </TabsTrigger>
                <TabsTrigger value="api" className="text-xs">
                  API
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="mt-3 space-y-2">
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="h-6 text-xs" onClick={handleAddOption}>
                    <HugeiconsIcon icon={Add01Icon} className="mr-1 size-3" />
                    Add Option
                  </Button>
                </div>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {(selected.options || []).map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option.label}
                        onChange={(e) => handleUpdateOption(index, "label", e.target.value)}
                        placeholder="Label"
                        className="h-7 flex-1 text-xs"
                      />
                      <Input
                        value={option.value}
                        onChange={(e) => handleUpdateOption(index, "value", e.target.value)}
                        placeholder="Value"
                        className="h-7 flex-1 text-xs"
                      />
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => handleRemoveOption(index)}>
                        <HugeiconsIcon icon={Delete02Icon} className="size-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {(!selected.options || selected.options.length === 0) && (
                    <p className="text-muted-foreground py-4 text-center text-xs">No options added yet</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="file" className="mt-3 space-y-3">
                <div className="rounded-lg border border-dashed p-4">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <HugeiconsIcon icon={Upload01Icon} className="text-muted-foreground size-8" />
                    <div>
                      <p className="text-sm font-medium">Upload CSV or Excel</p>
                      <p className="text-muted-foreground text-xs">Format: label,value per row</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
                <div className="bg-muted rounded-md p-3">
                  <p className="text-xs font-medium">CSV Format Example:</p>
                  <pre className="text-muted-foreground mt-1 text-xs">
                    {`Nigeria,NG\nGhana,GH\nKenya,KE`}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="api" className="mt-3 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">API URL</Label>
                  <Input
                    value={selected.options_api_config?.url || ""}
                    onChange={(e) => handleApiConfigChange("url", e.target.value)}
                    placeholder="https://api.example.com/options"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Method</Label>
                  <Select
                    value={selected.options_api_config?.method || "GET"}
                    onValueChange={(v) => handleApiConfigChange("method", v)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Label Field</Label>
                    <Input
                      value={selected.options_api_config?.label_field || ""}
                      onChange={(e) => handleApiConfigChange("label_field", e.target.value)}
                      placeholder="name"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Value Field</Label>
                    <Input
                      value={selected.options_api_config?.value_field || ""}
                      onChange={(e) => handleApiConfigChange("value_field", e.target.value)}
                      placeholder="id"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleFetchFromApi}
                  disabled={isLoadingApi}
                >
                  {isLoadingApi ? (
                    <>
                      <HugeiconsIcon icon={Loading01Icon} className="mr-2 size-4 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon icon={Link01Icon} className="mr-2 size-4" />
                      Fetch Options
                    </>
                  )}
                </Button>

                <div className="bg-muted rounded-md p-3">
                  <p className="text-xs font-medium">Expected Response:</p>
                  <pre className="text-muted-foreground mt-1 text-xs">
                    {`[{ "name": "Option 1", "id": "1" }]`}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        <div className="border-t pt-4">
          <h5 className="mb-3 text-sm font-medium">Validation</h5>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="required"
                checked={selected.validation.required}
                onCheckedChange={(checked) => handleValidationChange("required", checked)}
              />
              <Label htmlFor="required" className="text-xs font-normal">
                Required field
              </Label>
            </div>

            {showMinMaxLength && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="min_length" className="text-xs">
                    Min Length
                  </Label>
                  <Input
                    id="min_length"
                    type="number"
                    min={0}
                    value={selected.validation.min_length || ""}
                    onChange={(e) =>
                      handleValidationChange("min_length", e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="max_length" className="text-xs">
                    Max Length
                  </Label>
                  <Input
                    id="max_length"
                    type="number"
                    min={0}
                    value={selected.validation.max_length || ""}
                    onChange={(e) =>
                      handleValidationChange("max_length", e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            )}

            {showMinMax && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="min" className="text-xs">
                    Min Value
                  </Label>
                  <Input
                    id="min"
                    type="number"
                    value={selected.validation.min || ""}
                    onChange={(e) =>
                      handleValidationChange("min", e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="max" className="text-xs">
                    Max Value
                  </Label>
                  <Input
                    id="max"
                    type="number"
                    value={selected.validation.max || ""}
                    onChange={(e) =>
                      handleValidationChange("max", e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            )}

            {showPattern && (
              <div className="space-y-1">
                <Label htmlFor="pattern" className="text-xs">
                  Regex Pattern
                </Label>
                <Input
                  id="pattern"
                  value={selected.validation.pattern || ""}
                  onChange={(e) => handleValidationChange("pattern", e.target.value)}
                  placeholder="^[a-zA-Z]+$"
                  className="h-8 font-mono text-xs"
                />
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="message" className="text-xs">
                Error Message
              </Label>
              <Input
                id="message"
                value={selected.validation.message || ""}
                onChange={(e) => handleValidationChange("message", e.target.value)}
                placeholder="Custom validation error message"
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
