import Link from "next/link";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="">
      <div className="container mx-auto flex h-20 items-center justify-between py-6">
        <Link href="/">
          <h1 className="text-2xl font-bold text-neutral-800">ArcLMS</h1>
        </Link>
        <div className=""></div>
      </div>
      <div className="bg-auth container mx-auto grid h-[calc(100vh-146px)] place-items-center bg-cover bg-center bg-no-repeat">
        {children}
      </div>
      <div className="container mx-auto flex h-[68px] items-center justify-between py-6">
        <p className="text-sm text-neutral-600">&copy; {new Date().getFullYear()} ArcLMS. All rights reserved.</p>
        <div className="flex items-center gap-x-4">
          <Link className="text-sm text-neutral-600" href="/terms-of-service">
            Terms of Service
          </Link>
          <Link className="text-sm text-neutral-600" href="/privacy-policy">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
