import { Breadcrumb } from "@/components/shared";

const breadcrumbs = [{ label: "Audit Logs", href: "/superadmin/audit-logs" }];

const Page = () => {
  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div></div>
    </div>
  );
};

export default Page;
