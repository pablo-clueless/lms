"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Notification01Icon,
  Moon02Icon,
  UserIcon,
  Settings02Icon,
  Globe02Icon,
  SecurityPasswordIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb } from "@/components/shared";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Settings", href: "/admin/settings" }];

interface SettingsSectionProps {
  icon: typeof Notification01Icon;
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingsSection = ({ icon, title, description, children }: SettingsSectionProps) => (
  <div className="bg-card rounded-xl border p-6">
    <div className="mb-6 flex items-start gap-4">
      <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
        <HugeiconsIcon icon={icon} className="text-primary size-5" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

interface SettingItemProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

const SettingItem = ({ label, description, children }: SettingItemProps) => (
  <div className="flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0">
    <div className="flex-1">
      <p className="text-sm font-medium">{label}</p>
      {description && <p className="text-muted-foreground text-xs">{description}</p>}
    </div>
    {children}
  </div>
);

const TABS = [
  { id: "notifications", label: "Notifications", icon: Notification01Icon },
  { id: "appearance", label: "Appearance", icon: Moon02Icon },
  { id: "privacy", label: "Privacy", icon: SecurityPasswordIcon },
  { id: "account", label: "Account", icon: UserIcon },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
];

const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Africa/Lagos", label: "West Africa Time (WAT)" },
];

const DATE_FORMATS = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

const Page = () => {
  const [activeTab, setActiveTab] = useState("notifications");
  const [isSaving, setIsSaving] = useState(false);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [newStudentAlerts, setNewStudentAlerts] = useState(true);
  const [assignmentAlerts, setAssignmentAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Appearance settings
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [compactMode, setCompactMode] = useState(false);

  // Privacy settings
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showActivityStatus, setShowActivityStatus] = useState(true);
  const [allowDataCollection, setAllowDataCollection] = useState(true);

  // Account settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl">Settings</h3>
          <p className="text-muted-foreground text-sm">Manage your preferences and account settings</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 shrink-0 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground",
              )}
            >
              <HugeiconsIcon
                icon={tab.icon}
                className={cn("size-4", activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground")}
              />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "notifications" && (
            <>
              <SettingsSection
                icon={Notification01Icon}
                title="Email Notifications"
                description="Configure how you receive email notifications"
              >
                <SettingItem
                  label="Email Notifications"
                  description="Receive notifications via email"
                >
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </SettingItem>
                <SettingItem
                  label="New Student Alerts"
                  description="Get notified when new students enroll"
                >
                  <Switch
                    checked={newStudentAlerts}
                    onCheckedChange={setNewStudentAlerts}
                    disabled={!emailNotifications}
                  />
                </SettingItem>
                <SettingItem
                  label="Assignment Submissions"
                  description="Get notified when students submit assignments"
                >
                  <Switch
                    checked={assignmentAlerts}
                    onCheckedChange={setAssignmentAlerts}
                    disabled={!emailNotifications}
                  />
                </SettingItem>
                <SettingItem
                  label="System Alerts"
                  description="Receive important system updates and alerts"
                >
                  <Switch
                    checked={systemAlerts}
                    onCheckedChange={setSystemAlerts}
                    disabled={!emailNotifications}
                  />
                </SettingItem>
                <SettingItem
                  label="Weekly Digest"
                  description="Receive a weekly summary of platform activity"
                >
                  <Switch
                    checked={weeklyDigest}
                    onCheckedChange={setWeeklyDigest}
                    disabled={!emailNotifications}
                  />
                </SettingItem>
              </SettingsSection>

              <SettingsSection
                icon={Notification01Icon}
                title="Push Notifications"
                description="Configure browser and mobile push notifications"
              >
                <SettingItem
                  label="Push Notifications"
                  description="Enable browser push notifications"
                >
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </SettingItem>
              </SettingsSection>
            </>
          )}

          {activeTab === "appearance" && (
            <SettingsSection
              icon={Globe02Icon}
              title="Display & Localization"
              description="Customize how the platform looks and behaves"
            >
              <SettingItem
                label="Language"
                description="Select your preferred language"
              >
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingItem>
              <SettingItem
                label="Timezone"
                description="Set your local timezone for accurate dates"
              >
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingItem>
              <SettingItem
                label="Date Format"
                description="Choose how dates are displayed"
              >
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingItem>
              <SettingItem
                label="Compact Mode"
                description="Use a more compact layout with smaller spacing"
              >
                <Switch checked={compactMode} onCheckedChange={setCompactMode} />
              </SettingItem>
            </SettingsSection>
          )}

          {activeTab === "privacy" && (
            <SettingsSection
              icon={SecurityPasswordIcon}
              title="Privacy Settings"
              description="Control your privacy and data sharing preferences"
            >
              <SettingItem
                label="Show Online Status"
                description="Let others see when you're online"
              >
                <Switch checked={showOnlineStatus} onCheckedChange={setShowOnlineStatus} />
              </SettingItem>
              <SettingItem
                label="Show Activity Status"
                description="Let others see your recent activity"
              >
                <Switch checked={showActivityStatus} onCheckedChange={setShowActivityStatus} />
              </SettingItem>
              <SettingItem
                label="Allow Data Collection"
                description="Help us improve by allowing anonymous usage data collection"
              >
                <Switch checked={allowDataCollection} onCheckedChange={setAllowDataCollection} />
              </SettingItem>
            </SettingsSection>
          )}

          {activeTab === "account" && (
            <SettingsSection
              icon={Settings02Icon}
              title="Account & Security"
              description="Manage your account security settings"
            >
              <SettingItem
                label="Two-Factor Authentication"
                description="Add an extra layer of security to your account"
              >
                <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
              </SettingItem>
              <SettingItem
                label="Session Timeout"
                description="Automatically log out after inactivity"
              >
                <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </SettingItem>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Danger Zone</p>
                    <p className="text-muted-foreground text-xs">Irreversible account actions</p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </div>
            </SettingsSection>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
