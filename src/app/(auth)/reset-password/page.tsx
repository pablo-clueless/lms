"use client";

import { ArrowLeft02Icon, CheckmarkCircle02Icon, LockPasswordIcon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import Link from "next/link";
import * as Yup from "yup";

import type { ResetPasswordDto } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "form" | "success" | "error" | "expired";

const TOKEN_EXPIRY_MINUTES = 15;

const schema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
    .required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [tokenData, setTokenData] = useState<{ email: string; expiresAt: number } | null>(null);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Step>("form");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setStep("error");
        setIsValidatingToken(false);
        return;
      }

      try {
        // TODO: API call to validate token
        try {
          const decoded = atob(token);
          const [email, timestamp] = decoded.split(":");
          const createdAt = parseInt(timestamp, 10);
          const expiresAt = createdAt + TOKEN_EXPIRY_MINUTES * 60 * 1000;
          if (Date.now() > expiresAt) {
            setStep("expired");
          } else {
            setTokenData({ email, expiresAt });
            setStep("form");
          }
        } catch {
          setStep("error");
        }
      } catch (error) {
        console.error({ error });
        setStep("error");
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const formik = useFormik<Omit<ResetPasswordDto, "token">>({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      if (!token) {
        setStep("error");
        return;
      }
      setIsLoading(true);
      try {
        // TODO: API call to reset password
        console.log({ values });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setStep("success");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } catch (error) {
        console.error({ error });
        formik.setFieldError("password", "Failed to reset password. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (isValidatingToken) {
    return (
      <div className="w-125 space-y-6 rounded-xl border bg-white p-6 shadow-md">
        <div className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
            <HugeiconsIcon icon={LockPasswordIcon} className="text-primary size-6" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-800">Validating...</h2>
          <p className="mt-1 text-sm text-neutral-600">Please wait while we verify your reset link.</p>
        </div>
        <div className="flex justify-center">
          <div className="border-primary size-6 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="w-125 space-y-6 rounded-xl border bg-white p-6 shadow-md">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-100">
            <HugeiconsIcon icon={AlertCircleIcon} className="size-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-800">Invalid Link</h2>
          <p className="mt-1 text-sm text-neutral-600">This password reset link is invalid or has already been used.</p>
        </div>

        <Button className="w-full" onClick={() => router.push("/forgot-password")}>
          Request new reset link
        </Button>

        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-800">
            <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  if (step === "expired") {
    return (
      <div className="w-125 space-y-6 rounded-xl border bg-white p-6 shadow-md">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-amber-100">
            <HugeiconsIcon icon={AlertCircleIcon} className="size-6 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-800">Link Expired</h2>
          <p className="mt-1 text-sm text-neutral-600">
            This password reset link has expired. Please request a new one.
          </p>
        </div>

        <Button className="w-full" onClick={() => router.push("/forgot-password")}>
          Request new reset link
        </Button>

        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-800">
            <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="w-125 space-y-6 rounded-xl border bg-white p-6 shadow-md">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-100">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-800">Password Reset!</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Your password has been successfully reset. Redirecting you to sign in...
          </p>
        </div>

        <div className="flex justify-center">
          <div className="border-primary size-6 animate-spin rounded-full border-2 border-t-transparent" />
        </div>

        <div className="text-center">
          <Link href="/" className="text-primary text-sm font-medium hover:underline">
            Click here if you&apos;re not redirected
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-125 space-y-6 rounded-xl border bg-white p-6 shadow-md">
      <div className="text-center">
        <div className="bg-primary/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
          <HugeiconsIcon icon={LockPasswordIcon} className="text-primary size-6" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-800">Set new password</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Your new password must be different from previously used passwords.
        </p>
      </div>
      <form className="w-full space-y-4" onSubmit={formik.handleSubmit}>
        <Input
          label="New Password"
          name="password"
          type="password"
          placeholder="Enter your new password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password ? formik.errors.password : undefined}
          disabled={isLoading}
          showPasswordStrength
          helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
        />
        <Input
          label="Confirm Password"
          name="confirm_password"
          type="password"
          placeholder="Confirm your new password"
          value={formik.values.confirm_password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirm_password ? formik.errors.confirm_password : undefined}
          disabled={isLoading}
          isValid={
            formik.touched.confirm_password &&
            !formik.errors.confirm_password &&
            formik.values.confirm_password.length > 0
          }
        />

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Resetting password..." : "Reset password"}
        </Button>
      </form>
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-800">
          <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default Page;
