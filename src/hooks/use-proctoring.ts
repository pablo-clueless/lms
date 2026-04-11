"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Infraction {
  type: string;
  timestamp: string;
}

interface UseProctoringReturn {
  fullScreenSupported: boolean;
  infractions: Infraction[];
  isFullScreen: boolean;
  numberOfInfractions: number;
  onEnterFullScreen: () => void;
  onExitFullScreen: () => void;
  startProctoring: () => void;
}

interface UseProctoringProps {
  hasSubmitted: boolean;
  onSubmit: () => void;
  maxInfractions?: number;
}

const isTouchDevice = () => {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

const isDevToolsOpen = (threshold = 200) => {
  if (typeof window === "undefined") return false;
  if (isTouchDevice()) return false;
  const outerWidth = window.outerWidth - window.innerWidth;
  const outerHeight = window.outerHeight - window.innerHeight;
  return outerWidth > threshold || outerHeight > threshold;
};

const isfullScreenSupported = () => {
  if (typeof window === "undefined") return false;
  const el = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  };
  return !!(el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen);
};

const requestFullscreen = async () => {
  const el = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  };
  if (el.requestFullscreen) {
    await el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    await el.webkitRequestFullscreen();
  } else if (el.msRequestFullscreen) {
    await el.msRequestFullscreen();
  }
};

const getFullscreenElement = () => {
  const doc = document as Document & {
    webkitFullscreenElement: Element | null;
    msFullscreenElement: Element | null;
  };
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? doc.msFullscreenElement;
};

// const getVideoDevice = async () => {
//   return await navigator.mediaDevices.getUserMedia({ video: true });
// };

export const useProctoring = ({
  hasSubmitted,
  onSubmit,
  maxInfractions = 3,
}: UseProctoringProps): UseProctoringReturn => {
  const [infractions, setInfractions] = useState<Infraction[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const fullScreenSupported = isfullScreenSupported();

  const fullScreenEverEnteredRef = useRef(false);
  const hasSubmittedRef = useRef(hasSubmitted);
  const devToolsFlaggedRef = useRef(false);
  const isFullScreenRef = useRef(false);
  const onSubmitRef = useRef(onSubmit);
  const infractionCountRef = useRef(0);
  const isActiveRef = useRef(false);

  useEffect(() => {
    hasSubmittedRef.current = hasSubmitted;
  }, [hasSubmitted]);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  const registerInfraction = useCallback(
    (infractionType: string) => {
      if (hasSubmittedRef.current || !isActiveRef.current) return;

      const newCount = infractionCountRef.current + 1;
      infractionCountRef.current = newCount;

      const infraction: Infraction = { type: infractionType, timestamp: new Date().toISOString() };
      setInfractions((prev) => [...prev, infraction]);
      if (newCount >= maxInfractions) {
        toast.error(`Too many infractions (${maxInfractions}). Test submission submitted.`);
        setTimeout(() => {
          onSubmitRef.current();
        }, 0);
      } else {
        toast.warning(
          `${newCount}/${maxInfractions}: ${infractionType}. Assessment will auto-submit after ${maxInfractions}`,
        );
      }
    },
    [maxInfractions],
  );

  const handleEnterFullscreen = useCallback(async () => {
    if (!fullScreenSupported) return;
    try {
      await requestFullscreen();
    } catch {
      toast.error("Failed to enter fullscreen mode.");
    }
  }, [fullScreenSupported]);

  const handleExitFullscreen = useCallback(() => {
    isActiveRef.current = false;
    if (getFullscreenElement()) {
      document.exitFullscreen()?.catch(() => {});
    }
  }, []);

  const startProctoring = useCallback(async () => {
    isActiveRef.current = true;
    await handleEnterFullscreen();
  }, [handleEnterFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullScreen = !!getFullscreenElement();
      isFullScreenRef.current = isCurrentlyFullScreen;
      setIsFullScreen(isCurrentlyFullScreen);

      if (isCurrentlyFullScreen) {
        fullScreenEverEnteredRef.current = true;
      }

      if (
        !isCurrentlyFullScreen &&
        fullScreenEverEnteredRef.current &&
        isActiveRef.current &&
        !hasSubmittedRef.current
      ) {
        registerInfraction("Exited fullscreen mode");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [registerInfraction]);

  useEffect(() => {
    const devToolsInterval = setInterval(() => {
      if (!isActiveRef.current) return;
      const open = isDevToolsOpen();
      if (open && !devToolsFlaggedRef.current) {
        devToolsFlaggedRef.current = true;
        registerInfraction("DevTools opened");
      } else if (!open) {
        devToolsFlaggedRef.current = false;
      }
    }, 1000);

    const handleBlur = () => {
      if (document.hidden) {
        registerInfraction("Tab switched (visibility change)");
      }
    };

    const handleVisiblityChange = () => {
      if (document.hidden && isActiveRef.current && fullScreenEverEnteredRef.current && !hasSubmittedRef.current) {
        registerInfraction("Tab switched (visibility change)");
      }
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisiblityChange);

    return () => {
      clearInterval(devToolsInterval);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisiblityChange);
    };
  }, [registerInfraction]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isActiveRef.current && !hasSubmittedRef.current) return;
      e.preventDefault();
    };

    const handleContextMenu = (e: Event) => {
      if (isActiveRef.current && !hasSubmittedRef.current) return;
      e.preventDefault();
    };

    const handleCopyPaste = (e: ClipboardEvent) => {
      if (isActiveRef.current && !hasSubmittedRef.current) return;
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActiveRef.current && hasSubmittedRef.current) return;

      if ((e.ctrlKey || e.metaKey) && ["c", "v", "u", "w"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === "F12") {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return {
    fullScreenSupported,
    infractions,
    isFullScreen,
    numberOfInfractions: maxInfractions,
    onEnterFullScreen: handleEnterFullscreen,
    onExitFullScreen: handleExitFullscreen,
    startProctoring,
  };
};
