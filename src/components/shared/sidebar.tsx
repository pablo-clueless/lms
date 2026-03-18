"use client";

import { Logout01Icon } from "@hugeicons/core-free-icons";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type RouteConfig, getRoleRoutes } from "@/config/routes";
import { useGlobalStore, useUserStore } from "@/store/core";
import { cn, getInitials, normalize } from "@/lib";
import { Button } from "../ui/button";
import type { Role } from "@/types";

interface Props {
  role: Role;
}

const sidebarVariants = {
  expanded: {
    width: 256,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  collapsed: {
    width: 64,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
} as const;

const textVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    display: "block",
    transition: {
      delay: 0.1,
      duration: 0.2,
    },
  },
  collapsed: {
    opacity: 0,
    x: -10,
    transitionEnd: {
      display: "none",
    },
    transition: {
      duration: 0.15,
    },
  },
};

const CollapsibleChildren = ({}: { route: RouteConfig }) => {
  return <motion.div className="space-y-1"></motion.div>;
};

const NavLink = ({
  route,
  isActive,
  isCollapsed,
}: {
  route: RouteConfig;
  isActive: boolean;
  isCollapsed: boolean;
  hasChildren?: boolean;
}) => {
  return (
    <Link
      className={cn(
        "text-sidebar-foreground relative flex items-center gap-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
        isActive ? "bg-foreground text-background" : "hover:bg-neutral-200",
        isCollapsed && "justify-center px-0",
      )}
      href={route.href}
      title={isCollapsed ? route.name : undefined}
    >
      <motion.div
        className="flex shrink-0 items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <HugeiconsIcon icon={route.icon} className="size-5" />
      </motion.div>
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.span
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={textVariants}
            className="whitespace-nowrap"
          >
            {route.name}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
};

export const Sidebar = ({ role }: Props) => {
  const { isCollapsed } = useGlobalStore();
  const { signout, user } = useUserStore();
  const ROUTES = getRoleRoutes(role);
  const pathname = usePathname();

  return (
    <motion.aside
      className="bg-sidebar h-full overflow-hidden border-r py-4"
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
    >
      <motion.div
        className={cn("flex h-full w-full flex-col justify-between", isCollapsed ? "px-2" : "px-4")}
        layout
        transition={{ duration: 0.2 }}
      >
        <motion.nav className="space-y-1" layout>
          {ROUTES.map((route, index) => {
            const isActive = normalize(pathname) === route.href;
            const hasChildren = role === "SUPER_ADMIN" && route.children && route.children.length > 0;

            return (
              <motion.div
                key={route.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                className="space-y-1"
              >
                <NavLink route={route} isActive={isActive} isCollapsed={isCollapsed} hasChildren={hasChildren} />
                {hasChildren && !isCollapsed && <CollapsibleChildren route={route} />}
              </motion.div>
            );
          })}
        </motion.nav>
        <motion.div
          className={cn("flex items-center border-t py-4", isCollapsed ? "justify-center" : "justify-between")}
        >
          {!isCollapsed && (
            <motion.div className="flex max-w-45 items-center gap-x-2">
              <Avatar>
                <AvatarImage src={user?.profile?.avatar || ""} />
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
              <div className="max-w-35">
                <h5 className="text-xs font-medium">{user?.name}</h5>
                <p className="text-[10px] text-gray-600">{user?.email}</p>
              </div>
            </motion.div>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="bg-red-500 text-white hover:bg-red-500/80 hover:text-white"
                size="icon"
                variant="outline"
                title="Sign out"
              >
                <HugeiconsIcon icon={Logout01Icon} className="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-red-500/10">
                  <HugeiconsIcon icon={Logout01Icon} className="size-6 text-red-500" />
                </div>
                <div className="text-center">
                  <DialogTitle className="text-lg font-semibold">Sign out</DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-1 text-sm">
                    Are you sure you want to sign out? You will need to sign in again to access your account.
                  </DialogDescription>
                </div>
              </div>
              <div className="flex gap-3">
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </DialogTrigger>
                <Button variant="destructive" className="flex-1" onClick={() => signout()}>
                  Sign out
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </motion.div>
    </motion.aside>
  );
};
