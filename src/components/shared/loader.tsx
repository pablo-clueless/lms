import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  isFullScreen?: boolean;
  message?: string;
}

export const Loader = ({ className, isFullScreen = false, message = "Loading..." }: Props) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        isFullScreen ? "fixed inset-0 top-0 left-0 h-screen w-screen" : "h-full w-full",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-y-10">
        <div className="relative size-16 rounded-full border-4 border-neutral-200">
          <div className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-4 border-neutral-600 border-t-transparent"></div>
        </div>
        {message && <p className="font-medium text-neutral-600">{message}</p>}
      </div>
    </div>
  );
};
