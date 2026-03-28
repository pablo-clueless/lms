"use client";

import { RefreshIcon, PencilEdit02Icon, Cancel01Icon, Tick01Icon, Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

import { useGetSystemConfigs, useBulkUpdateConfigs } from "@/lib/api/system-config";
import { Breadcrumb, Loader, TabPanel } from "@/components/shared";
import type { ConfigValue, SystemConfig } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, fromSnakeCase } from "@/lib";

type ConfigValueType = "string" | "number" | "boolean" | "array";

const breadcrumbs = [{ label: "System Configurations", href: "/superadmin/system-config" }];

function detectValueType(value: ConfigValue): ConfigValueType {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (Array.isArray(value)) return "array";
  return "string";
}

function toStringArray(value: ConfigValue): string[] {
  if (Array.isArray(value)) return value.map(String);
  return [];
}

interface ConfigValueDisplayProps {
  value: ConfigValue;
  isSensitive: boolean;
  showSensitive: boolean;
}

function ConfigValueDisplay({ value, isSensitive, showSensitive }: ConfigValueDisplayProps) {
  if (isSensitive && !showSensitive) {
    return <code className="bg-muted rounded px-2 py-1 text-sm">••••••••</code>;
  }

  const type = detectValueType(value);

  if (type === "boolean") {
    return (
      <div className="flex items-center gap-x-2">
        <Switch checked={value as boolean} disabled />
        <span className="text-sm">{value ? "Enabled" : "Disabled"}</span>
      </div>
    );
  }

  if (type === "array") {
    const items = toStringArray(value);
    if (items.length === 0) {
      return <code className="bg-muted rounded px-2 py-1 text-sm">[]</code>;
    }
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, index) => (
          <span key={index} className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            {item}
          </span>
        ))}
      </div>
    );
  }

  if (type === "number") {
    return <code className="bg-muted rounded px-2 py-1 font-mono text-sm">{value}</code>;
  }

  return <code className="bg-muted rounded px-2 py-1 text-sm">{value}</code>;
}

interface ConfigValueEditorProps {
  value: ConfigValue;
  onChange: (value: ConfigValue) => void;
  onSave: () => void;
  onCancel: () => void;
  isUpdating: boolean;
}

function ConfigValueEditor({ value, onChange, onSave, onCancel, isUpdating }: ConfigValueEditorProps) {
  const type = detectValueType(value);
  const [arrayItems, setArrayItems] = useState<string[]>(() => toStringArray(value));
  const [newArrayItem, setNewArrayItem] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type !== "array") onSave();
    if (e.key === "Escape") onCancel();
  };

  const handleAddArrayItem = () => {
    if (newArrayItem.trim()) {
      const updatedItems = [...arrayItems, newArrayItem.trim()];
      setArrayItems(updatedItems);
      onChange(updatedItems);
      setNewArrayItem("");
    }
  };

  const handleRemoveArrayItem = (index: number) => {
    const updatedItems = arrayItems.filter((_, i) => i !== index);
    setArrayItems(updatedItems);
    onChange(updatedItems);
  };

  if (type === "boolean") {
    const boolValue = value as boolean;
    return (
      <div className="mt-3 flex items-center gap-3">
        <Switch checked={boolValue} onCheckedChange={(checked) => onChange(checked)} />
        <span className="text-sm text-gray-600">{boolValue ? "Enabled" : "Disabled"}</span>
        <Button size="sm" variant="ghost" onClick={onSave} disabled={isUpdating}>
          <HugeiconsIcon icon={Tick01Icon} className="size-5 text-green-600" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          <HugeiconsIcon icon={Cancel01Icon} className="size-5 text-red-600" />
        </Button>
      </div>
    );
  }

  if (type === "array") {
    return (
      <div className="mt-3 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {arrayItems.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700"
            >
              {item}
              <button
                type="button"
                onClick={() => handleRemoveArrayItem(index)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-blue-200"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={newArrayItem}
            onChange={(e) => setNewArrayItem(e.target.value)}
            placeholder="Add new item..."
            className="max-w-xs"
            size="sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddArrayItem();
              }
              if (e.key === "Escape") onCancel();
            }}
          />
          <Button size="sm" variant="ghost" onClick={handleAddArrayItem}>
            <HugeiconsIcon icon={Add01Icon} className="size-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onSave} disabled={isUpdating}>
            <HugeiconsIcon icon={Tick01Icon} className="size-5 text-green-600" />
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (type === "number") {
    return (
      <div className="mt-3 flex items-center gap-2">
        <Input
          type="number"
          value={String(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="max-w-xs"
          size="sm"
          autoFocus
          onKeyDown={handleKeyDown}
        />
        <Button size="sm" variant="ghost" onClick={onSave} disabled={isUpdating}>
          <HugeiconsIcon icon={Tick01Icon} className="size-5 text-green-600" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          <HugeiconsIcon icon={Cancel01Icon} className="size-5 text-red-600" />
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <Input
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-md"
        size="sm"
        autoFocus
        onKeyDown={handleKeyDown}
      />
      <Button size="sm" variant="ghost" onClick={onSave} disabled={isUpdating}>
        <HugeiconsIcon icon={Tick01Icon} className="size-5 text-green-600" />
      </Button>
      <Button size="sm" variant="ghost" onClick={onCancel}>
        <HugeiconsIcon icon={Cancel01Icon} className="size-5 text-red-600" />
      </Button>
    </div>
  );
}

const Page = () => {
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<ConfigValue | null>(null);
  const [activeTab, setActiveTab] = useState<string>("billing");
  const [showSensitive, setShowSensitive] = useState(false);

  const { data, isFetching, isPending, refetch } = useGetSystemConfigs({
    limit: 100,
    mask_sensitive: !showSensitive,
  });

  const { mutate: bulkUpdate, isPending: isUpdating } = useBulkUpdateConfigs();

  const { groupedConfigs, categories } = useMemo(() => {
    if (!data?.configs) return { groupedConfigs: {}, categories: [] };

    const grouped = data.configs.reduce<Record<string, SystemConfig[]>>((acc, config) => {
      const category = config.category || "general";
      if (!acc[category]) acc[category] = [];
      acc[category].push(config);
      return acc;
    }, {});

    return { groupedConfigs: grouped, categories: Object.keys(grouped) };
  }, [data]);

  const handleStartEdit = (config: SystemConfig) => {
    setEditingConfig(config.id);
    setEditValue(config.value);
  };

  const handleCancelEdit = () => {
    setEditingConfig(null);
    setEditValue(null);
  };

  const handleSaveEdit = (config: SystemConfig) => {
    if (editValue === config.value || editValue === null) {
      handleCancelEdit();
      return;
    }

    bulkUpdate([{ key: config.key, value: editValue }], {
      onSuccess: () => {
        toast.success("Configuration updated successfully");
        handleCancelEdit();
        refetch();
      },
      onError: () => {
        toast.error("Failed to update configuration");
      },
    });
  };

  if (isPending || !data) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">System Configurations</h3>
          <p className="text-sm font-medium text-gray-600">Configure system-wide settings and parameters</p>
        </div>
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-2">
            <Switch
              id="show-sensitive"
              checked={showSensitive}
              onCheckedChange={(checked) => {
                setShowSensitive(checked);
                refetch();
              }}
            />
            <Label htmlFor="show-sensitive" className="cursor-pointer text-sm">
              Show Sensitive
            </Label>
          </div>
          <Button disabled={isFetching} onClick={() => refetch()} variant="outline" size="sm">
            <HugeiconsIcon
              icon={RefreshIcon}
              data-icon="inline-start"
              className={cn("size-4", isFetching && "animate-spin")}
            />
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="border-b">
          <div className="flex items-center gap-1">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={cn(
                  "px-4 py-2 text-sm font-medium capitalize transition-colors",
                  activeTab === category
                    ? "border-primary text-primary border-b-2"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setActiveTab(category)}
              >
                {fromSnakeCase(category)}
              </button>
            ))}
          </div>
        </div>
        {categories.map((category) => (
          <TabPanel key={`tabpanel-${category}`} selected={activeTab} value={category}>
            <div className="space-y-3">
              {groupedConfigs[category]?.map((config) => (
                <div key={config.id} className="flex items-start justify-between gap-4 rounded-lg border p-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{config.key}</p>
                      {config.is_sensitive && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Sensitive
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{config.description}</p>
                    {editingConfig === config.id && editValue !== null ? (
                      <ConfigValueEditor
                        value={editValue}
                        onChange={setEditValue}
                        onSave={() => handleSaveEdit(config)}
                        onCancel={handleCancelEdit}
                        isUpdating={isUpdating}
                      />
                    ) : (
                      <div className="mt-2">
                        <ConfigValueDisplay
                          value={config.value}
                          isSensitive={config.is_sensitive}
                          showSensitive={showSensitive}
                        />
                      </div>
                    )}
                  </div>
                  {editingConfig !== config.id && (
                    <Button size="sm" variant="ghost" onClick={() => handleStartEdit(config)} className="shrink-0">
                      <HugeiconsIcon icon={PencilEdit02Icon} className="size-5" />
                    </Button>
                  )}
                </div>
              ))}
              {(!groupedConfigs[category] || groupedConfigs[category].length === 0) && (
                <div className="rounded-lg border p-8 text-center">
                  <p className="text-muted-foreground">No configurations found in this category</p>
                </div>
              )}
            </div>
          </TabPanel>
        ))}
      </div>
    </div>
  );
};

export default Page;
