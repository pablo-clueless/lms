"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseDownloadOptions {
  filename?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDownload = (options: UseDownloadOptions = {}) => {
  const { filename, onSuccess, onError } = options;
  const objectUrlRef = useRef<string | null>(null);

  const cleanup = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const download = useCallback(
    (file: File | Blob | undefined, customFilename?: string) => {
      if (!file) {
        onError?.(new Error("No file provided"));
        return;
      }

      try {
        cleanup();

        const href = URL.createObjectURL(file);
        objectUrlRef.current = href;

        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", customFilename || filename || (file instanceof File ? file.name : "download"));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(cleanup, 100);

        onSuccess?.();
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error("Download failed"));
      }
    },
    [filename, onSuccess, onError, cleanup],
  );

  return { download };
};
