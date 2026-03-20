import { HugeiconsIcon } from "@hugeicons/react";
import { ConstructionIcon } from "@hugeicons/core-free-icons";

interface PagePlaceholderProps {
  title: string;
  description?: string;
}

export const PagePlaceholder = ({ title, description }: PagePlaceholderProps) => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <div className="bg-muted mb-6 flex h-20 w-20 items-center justify-center rounded-full">
        <HugeiconsIcon icon={ConstructionIcon} className="text-muted-foreground size-10" />
      </div>
      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground max-w-md text-center">
        {description || "This page is under construction. Check back soon for updates."}
      </p>
    </div>
  );
};
