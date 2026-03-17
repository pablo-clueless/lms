"use client";

import { ArrowRight01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SYSTEM_CONFIGURATION_TABS, type ConfigChild, type ConfigField } from "@/config/tabs";
import { Breadcrumb, TabPanel } from "@/components/shared";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "System Configurations", href: "/superadmin/system-configurations" }];

const ConfigFieldRenderer = ({ field }: { field: ConfigField }) => {
  switch (field.type) {
    case "text":
    case "number":
    case "color":
      return (
        <Input
          type={field.type}
          label={field.label}
          placeholder={field.placeholder}
          defaultValue={field.defaultValue as string | number | undefined}
          helperText={field.description}
        />
      );
    case "file":
      return <Input type="file" label={field.label} helperText={field.description} />;
    case "textarea":
      return (
        <Textarea
          label={field.label}
          placeholder={field.placeholder}
          defaultValue={field.defaultValue as string | undefined}
          helperText={field.description}
        />
      );
    case "switch":
      return (
        <div className="bg-card flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="text-sm font-medium">{field.label}</p>
            {field.description && <p className="text-muted-foreground text-xs">{field.description}</p>}
          </div>
          <Switch defaultChecked={field.defaultValue as boolean | undefined} />
        </div>
      );
    case "select":
      return (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{field.label}</label>
          <Select defaultValue={field.defaultValue as string | undefined}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.description && <p className="text-muted-foreground text-sm">{field.description}</p>}
        </div>
      );
    default:
      return null;
  }
};

const ChildContent = ({ child, onBack }: { child: ConfigChild; onBack: () => void }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b pb-4">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          Back
        </button>
        <div>
          <h4 className="text-xl font-semibold">{child.name}</h4>
          <p className="text-muted-foreground text-sm">{child.description}</p>
        </div>
      </div>
      <div className="space-y-4">
        {child.fields.map((field) => (
          <ConfigFieldRenderer key={field.name} field={field} />
        ))}
      </div>
      <div className="flex justify-end gap-3 border-t pt-4">
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

const Page = () => {
  const [activeTab, setActiveTab] = useState(SYSTEM_CONFIGURATION_TABS[0].tab);
  const [selectedChild, setSelectedChild] = useState<ConfigChild | null>(null);

  const handleChildClick = (child: ConfigChild) => {
    setSelectedChild(child);
  };

  const handleBack = () => {
    setSelectedChild(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedChild(null);
  };

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="">
          <h3 className="text-foreground text-3xl">System Configurations</h3>
          <p className="text-sm text-neutral-600">Manage system configurations and settings</p>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="w-60 shrink-0 space-y-2">
          {SYSTEM_CONFIGURATION_TABS.map((tab) => (
            <button
              key={tab.tab}
              onClick={() => handleTabChange(tab.tab)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors",
                activeTab === tab.tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 hover:bg-muted text-foreground",
              )}
            >
              <HugeiconsIcon
                icon={tab.icon}
                className={cn("size-5", activeTab === tab.tab ? "text-primary-foreground" : "text-muted-foreground")}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{tab.tab}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-hidden">
          {SYSTEM_CONFIGURATION_TABS.map((tab) => (
            <TabPanel key={tab.tab} selected={activeTab} value={tab.tab}>
              <div className="relative">
                <AnimatePresence mode="wait" initial={false}>
                  {selectedChild === null ? (
                    <motion.div
                      key="menu"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -100, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="space-y-4"
                    >
                      <div className="border-b pb-4">
                        <h4 className="text-foreground text-xl font-semibold">{tab.tab}</h4>
                        <p className="text-muted-foreground text-sm">{tab.description}</p>
                      </div>
                      <div className="grid gap-4">
                        {tab.children.map((child) => (
                          <div
                            key={child.name}
                            onClick={() => handleChildClick(child)}
                            className="group bg-card hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors"
                          >
                            <div>
                              <p className="text-foreground font-medium">{child.name}</p>
                              <p className="text-muted-foreground text-sm">{child.description}</p>
                            </div>
                            <HugeiconsIcon
                              icon={ArrowRight01Icon}
                              className="text-muted-foreground size-5 transition-transform group-hover:translate-x-1"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 100, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <ChildContent child={selectedChild} onBack={handleBack} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </TabPanel>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
