"use client";

import Cookies from "js-cookie";
import type React from "react";

import { useWebSocket } from "@/hooks";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export const NotificationProvider = ({ children }: Props) => {
  const token = Cookies.get("ACCESS_TOKEN");
  const { connectionState, subscribe } = useWebSocket({ token, autoConnect: true });

  useEffect(() => {
    if (connectionState === "connected") {
      console.log("Connected to websocket");
      subscribe("PING", (message) => {
        console.log({ message });
      });
    }
  }, [connectionState, subscribe]);

  return <>{children}</>;
};
