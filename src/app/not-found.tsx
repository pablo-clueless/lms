import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="relative">
        <h1 className="text-[12rem] leading-none font-bold tracking-tighter text-transparent [-webkit-text-stroke:2px_hsl(var(--muted-foreground)/0.3)] sm:text-[16rem]">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Page not found</h2>
            <p className="text-muted-foreground mt-2 max-w-md text-sm sm:text-base">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">
            <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
            Back to Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/help">Get Help</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
