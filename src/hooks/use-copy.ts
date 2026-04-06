import { useCallback } from "react";
import { toast } from "sonner";

interface UseCopyReturns {
  handleCopy: () => void;
}

export const useCopy = (value?: string, callback?: () => void): UseCopyReturns => {
  const handleCopy = useCallback(() => {
    if (!value) {
      toast.error("Nothing to copy");
      return;
    }
    navigator.clipboard
      .writeText(value)
      .then(() => {
        toast.success("Text copied");
        callback?.();
      })
      .catch((error) => {
        toast.error("Error copying text");
        console.error({ error });
      });
  }, [callback, value]);

  return { handleCopy };
};
