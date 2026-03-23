"use client";

import { RefreshIcon, Settings01Icon, LockIcon, Mail01Icon, CreditCardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

import { Breadcrumb, Loader, TabPanel } from "@/components/shared";
import { useGetConfigsByCategory } from "@/lib/api/system-config";
import { useGetTenant, useUpdateTenant } from "@/lib/api/tenant";
import type { ConfigType, UpdateTenantDto } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/core";
import { cn } from "@/lib";

const tabs = ["general", "security", "email", "billing"];
const breadcrumbs = [{ label: "Settings", href: "/admin/settings" }];

const schoolInfoSchema = Yup.object({
  name: Yup.string().required("School name is required"),
  contact_email: Yup.string().email("Invalid email address").required("Contact email is required"),
  address: Yup.string().required("Address is required"),
  logo: Yup.string().url("Must be a valid URL").nullable(),
  billing_contact: Yup.object({
    name: Yup.string().required("Billing contact name is required"),
    email: Yup.string().email("Invalid email address").required("Billing contact email is required"),
    phone: Yup.string().required("Billing contact phone is required"),
  }),
});

const Page = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [isEditingSchool, setIsEditingSchool] = useState(false);
  const { user } = useUserStore();

  const { data: tenant, isFetching: tenantFetching, refetch: refetchTenant } = useGetTenant(user?.tenant_id || "");
  const { mutate: updateTenant, isPending: isUpdatingTenant } = useUpdateTenant();

  const { data: generalConfigs, isPending: generalPending } = useGetConfigsByCategory("general" as ConfigType);
  const { data: securityConfigs, isPending: securityPending } = useGetConfigsByCategory("security" as ConfigType);
  const { data: emailConfigs, isPending: emailPending } = useGetConfigsByCategory("email" as ConfigType);
  const { data: billingConfigs, isPending: billingPending } = useGetConfigsByCategory("billing" as ConfigType);

  const initialValues: UpdateTenantDto = useMemo(() => {
    if (tenant) {
      return {
        name: tenant.name,
        contact_email: tenant.contact_email,
        address: tenant.address,
        logo: tenant.logo,
        configuration: {
          timezone: tenant.configuration.timezone,
          school_level: tenant.configuration.school_level,
          period_duration: tenant.configuration.period_duration,
          daily_period_limit: tenant.configuration.daily_period_limit,
          max_periods_per_week: tenant.configuration.max_periods_per_week,
          grade_weighting: {
            continuous_assessment: tenant.configuration.grade_weighting.continuous_assessment,
            examination: tenant.configuration.grade_weighting.examination,
          },
          attendance_threshold: tenant.configuration.attendance_threshold,
          invoice_grace_period: tenant.configuration.invoice_grace_period,
          suspension_threshold: tenant.configuration.suspension_threshold,
          branding_assets: tenant.configuration.branding_assets,
          communication_prefs: tenant.configuration.communication_prefs,
          supported_classes: tenant.configuration.supported_classes,
          notification_settings: tenant.configuration.notification_settings,
          meeting_recording_retention: tenant.configuration.meeting_recording_retention,
        },
        billing_contact: {
          name: tenant.billing_contact.name,
          email: tenant.billing_contact.email,
          phone: tenant.billing_contact.phone,
        },
      };
    }
    return {
      name: "",
      contact_email: "",
      address: "",
      logo: "",
      configuration: {
        timezone: "",
        school_level: "",
        period_duration: 0,
        daily_period_limit: 0,
        max_periods_per_week: {},
        grade_weighting: {
          continuous_assessment: 0,
          examination: 0,
        },
        attendance_threshold: 0,
        invoice_grace_period: 0,
        suspension_threshold: 0,
        branding_assets: {},
        communication_prefs: {},
        supported_classes: [],
        notification_settings: {},
        meeting_recording_retention: 0,
      },
      billing_contact: {
        name: "",
        email: "",
        phone: "",
      },
    };
  }, [tenant]);

  const formik = useFormik({
    initialValues,
    validationSchema: schoolInfoSchema,
    onSubmit: (values) => {
      if (!user?.tenant_id) return;

      updateTenant(
        {
          id: user.tenant_id,
          body: {
            ...values,
            configuration: tenant?.configuration || {
              timezone: "",
              school_level: "",
              period_duration: 0,
              daily_period_limit: 0,
              max_periods_per_week: {},
              grade_weighting: { continuous_assessment: 0, examination: 0 },
              attendance_threshold: 0,
              invoice_grace_period: 0,
              suspension_threshold: 0,
              branding_assets: {},
              communication_prefs: {},
              supported_classes: [],
              notification_settings: {},
              meeting_recording_retention: 0,
            },
          },
        },
        {
          onSuccess: () => {
            toast.success("School information updated successfully");
            setIsEditingSchool(false);
            refetchTenant();
          },
          onError: () => {
            toast.error("Failed to update school information");
          },
        },
      );
    },
  });

  const handleEditSchool = () => {
    setIsEditingSchool(true);
  };

  const isPending = generalPending || securityPending || emailPending || billingPending || tenantFetching;

  if (isPending) return <Loader />;

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "general":
        return Settings01Icon;
      case "security":
        return LockIcon;
      case "email":
        return Mail01Icon;
      case "billing":
        return CreditCardIcon;
      default:
        return Settings01Icon;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold">Settings</h3>
          <p className="text-sm text-gray-600">Configure school settings, branding, and preferences</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Button disabled={tenantFetching} onClick={() => refetchTenant()} variant="outline" size="sm">
            <HugeiconsIcon
              icon={RefreshIcon}
              data-icon="inline-start"
              className={cn("size-4", tenantFetching && "animate-spin")}
            />
            {tenantFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="border-b">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium capitalize transition-colors",
                  currentTab === tab
                    ? "border-primary text-primary border-b-2"
                    : "text-muted-foreground hover:text-foreground",
                )}
                key={tab}
                onClick={() => setCurrentTab(tab)}
              >
                <HugeiconsIcon icon={getTabIcon(tab)} className="size-4" />
                {tab}
              </button>
            ))}
          </div>
        </div>

        <TabPanel selected={currentTab} value="general">
          <div className="space-y-6">
            <div className="max-w-2xl space-y-4 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">School Information</h4>
                {!isEditingSchool ? (
                  <Button variant="outline" size="sm" onClick={handleEditSchool}>
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {}}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => formik.handleSubmit()} disabled={isUpdatingTenant}>
                      {isUpdatingTenant ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>

              {isEditingSchool ? (
                <form onSubmit={formik.handleSubmit} className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="School Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name ? formik.errors.name : undefined}
                    required
                  />
                  <Input
                    label="Contact Email"
                    name="contact_email"
                    type="email"
                    value={formik.values.contact_email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.contact_email ? formik.errors.contact_email : undefined}
                    required
                  />
                  <Input
                    label="Address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.address ? formik.errors.address : undefined}
                    className="md:col-span-2"
                    required
                  />
                  <Input
                    label="Logo URL"
                    name="logo"
                    value={formik.values.logo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.logo ? formik.errors.logo : undefined}
                    className="md:col-span-2"
                  />
                  <div className="md:col-span-2">
                    <p className="mb-3 text-sm font-medium">Billing Contact</p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <Input
                        label="Name"
                        name="billing_contact.name"
                        value={formik.values.billing_contact.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.billing_contact?.name ? formik.errors.billing_contact?.name : undefined}
                        required
                      />
                      <Input
                        label="Email"
                        name="billing_contact.email"
                        type="email"
                        value={formik.values.billing_contact.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.billing_contact?.email ? formik.errors.billing_contact?.email : undefined}
                        required
                      />
                      <Input
                        label="Phone"
                        name="billing_contact.phone"
                        value={formik.values.billing_contact.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.billing_contact?.phone ? formik.errors.billing_contact?.phone : undefined}
                        required
                      />
                    </div>
                  </div>
                </form>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground text-sm">School Name</p>
                    <p className="font-medium">{tenant?.name || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Contact Email</p>
                    <p className="font-medium">{tenant?.contact_email || "Not set"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground text-sm">Address</p>
                    <p className="font-medium">{tenant?.address || "Not set"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground text-sm">Logo</p>
                    <p className="font-medium">{tenant?.logo || "Not set"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground mb-2 text-sm">Billing Contact</p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-muted-foreground text-xs">Name</p>
                        <p className="text-sm font-medium">{tenant?.billing_contact?.name || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Email</p>
                        <p className="text-sm font-medium">{tenant?.billing_contact?.email || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Phone</p>
                        <p className="text-sm font-medium">{tenant?.billing_contact?.phone || "Not set"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {generalConfigs?.configs && generalConfigs.configs.length > 0 && (
              <div className="max-w-2xl space-y-4 rounded-lg border p-6">
                <h4 className="font-semibold">General Configuration</h4>
                <div className="space-y-4">
                  {generalConfigs.configs.map((config) => (
                    <div key={config.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{config.key}</p>
                        <p className="text-muted-foreground text-xs">{config.description}</p>
                      </div>
                      <p className="text-sm">{config.is_sensitive ? "••••••••" : config.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabPanel>

        <TabPanel selected={currentTab} value="security">
          <div className="max-w-2xl space-y-4 rounded-lg border p-6">
            <h4 className="font-semibold">Security Settings</h4>
            {securityConfigs?.configs && securityConfigs.configs.length > 0 ? (
              <div className="space-y-4">
                {securityConfigs.configs.map((config) => (
                  <div key={config.id} className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
                    <div>
                      <p className="text-sm font-medium">{config.key}</p>
                      <p className="text-muted-foreground text-xs">{config.description}</p>
                    </div>
                    <p className="font-mono text-sm">{config.is_sensitive ? "••••••••" : config.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No security configurations available.</p>
            )}
          </div>
        </TabPanel>

        <TabPanel selected={currentTab} value="email">
          <div className="max-w-2xl space-y-4 rounded-lg border p-6">
            <h4 className="font-semibold">Email Configuration</h4>
            {emailConfigs?.configs && emailConfigs.configs.length > 0 ? (
              <div className="space-y-4">
                {emailConfigs.configs.map((config) => (
                  <div key={config.id} className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
                    <div>
                      <p className="text-sm font-medium">{config.key}</p>
                      <p className="text-muted-foreground text-xs">{config.description}</p>
                    </div>
                    <p className="font-mono text-sm">{config.is_sensitive ? "••••••••" : config.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No email configurations available.</p>
            )}
          </div>
        </TabPanel>

        <TabPanel selected={currentTab} value="billing">
          <div className="max-w-2xl space-y-4 rounded-lg border p-6">
            <h4 className="font-semibold">Billing Configuration</h4>
            {billingConfigs?.configs && billingConfigs.configs.length > 0 ? (
              <div className="space-y-4">
                {billingConfigs.configs.map((config) => (
                  <div key={config.id} className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
                    <div>
                      <p className="text-sm font-medium">{config.key}</p>
                      <p className="text-muted-foreground text-xs">{config.description}</p>
                    </div>
                    <p className="font-mono text-sm">{config.is_sensitive ? "••••••••" : config.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No billing configurations available.</p>
            )}
          </div>
        </TabPanel>
      </div>
    </div>
  );
};

export default Page;
