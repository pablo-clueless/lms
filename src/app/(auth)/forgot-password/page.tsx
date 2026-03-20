"use client";

import { ArrowLeft02Icon, CheckmarkCircle02Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { useState, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import Link from "next/link";
import * as Yup from "yup";

import type { ForgotPasswordDto, VerifyOtpDto } from "@/types/auth";
import { OtpInput } from "@/components/shared/otp-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "email" | "otp" | "success";

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 300; // 5 minutes
const RESEND_COOLDOWN_SECONDS = 60;

const emailSchema = Yup.object().shape({
  email: Yup.string().email("Please enter a valid email address").required("Email is required"),
});

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`)
    .matches(/^\d+$/, "OTP must contain only numbers")
    .required("OTP is required"),
});

const Page = () => {
  const router = useRouter();

  const [otpExpiryTime, setOtpExpiryTime] = useState<number | null>(null);
  const [_resetToken, setResetToken] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (!otpExpiryTime) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((otpExpiryTime - Date.now()) / 1000));
      setTimeRemaining(remaining);
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [otpExpiryTime]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldown]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const emailForm = useFormik<ForgotPasswordDto>({
    initialValues: { email: "" },
    validationSchema: emailSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // TODO: API call to send OTP
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setEmail(values.email);
        setOtpExpiryTime(Date.now() + OTP_EXPIRY_SECONDS * 1000);
        setTimeRemaining(OTP_EXPIRY_SECONDS);
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        setStep("otp");
      } catch (error) {
        console.error({ error });
        emailForm.setFieldError("email", "Failed to send OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const otpForm = useFormik<VerifyOtpDto>({
    initialValues: { email: "", otp: "" },
    validationSchema: otpSchema,
    onSubmit: async (values) => {
      if (timeRemaining === 0) {
        otpForm.setFieldError("otp", "OTP has expired. Please request a new one.");
        return;
      }

      setIsLoading(true);
      try {
        // TODO: API call to verify OTP
        console.log({ values });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const mockToken = btoa(`${email}:${Date.now()}`);
        setResetToken(mockToken);
        setStep("success");
        setTimeout(() => {
          router.push(`/reset-password?token=${encodeURIComponent(mockToken)}`);
        }, 2000);
      } catch (error) {
        console.error({ error });
        otpForm.setFieldError("otp", "Invalid OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleResendOtp = useCallback(async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    try {
      // TODO: API call to resend OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOtpExpiryTime(Date.now() + OTP_EXPIRY_SECONDS * 1000);
      setTimeRemaining(OTP_EXPIRY_SECONDS);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      otpForm.setFieldValue("otp", "");
    } catch (error) {
      console.error({ error });
    } finally {
      setIsLoading(false);
    }
  }, [resendCooldown, otpForm]);

  const handleBackToEmail = () => {
    setStep("email");
    setOtpExpiryTime(null);
    setTimeRemaining(0);
    otpForm.resetForm();
  };

  const maskEmail = (email: string): string => {
    const [username, domain] = email.split("@");
    if (username.length <= 2) {
      return `${username[0]}***@${domain}`;
    }
    return `${username[0]}${username[1]}${"*".repeat(Math.min(username.length - 2, 5))}@${domain}`;
  };

  if (step === "email") {
    return (
      <div className="w-125 space-y-6 rounded-xl border bg-white p-6 shadow-md">
        <div className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
            <HugeiconsIcon icon={Mail01Icon} className="text-primary size-6" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-800">Forgot password?</h2>
          <p className="mt-1 text-sm text-neutral-600">
            No worries, we&apos;ll send you a verification code to reset your password.
          </p>
        </div>
        <form className="w-full space-y-4" onSubmit={emailForm.handleSubmit}>
          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={emailForm.values.email}
            onChange={emailForm.handleChange}
            onBlur={emailForm.handleBlur}
            error={emailForm.touched.email ? emailForm.errors.email : undefined}
            disabled={isLoading}
          />
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send verification code"}
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
  }

  if (step === "otp") {
    return (
      <div className="w-125 space-y-6 rounded-xl border bg-white p-6 shadow-md">
        <div className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
            <HugeiconsIcon icon={Mail01Icon} className="text-primary size-6" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-800">Check your email</h2>
          <p className="mt-1 text-sm text-neutral-600">
            We sent a verification code to <span className="font-medium text-neutral-800">{maskEmail(email)}</span>
          </p>
        </div>

        <form className="w-full space-y-4" onSubmit={otpForm.handleSubmit}>
          <div className="space-y-2">
            <OtpInput
              value={otpForm.values.otp}
              onChange={(value) => otpForm.setFieldValue("otp", value)}
              length={OTP_LENGTH}
              disabled={isLoading || timeRemaining === 0}
              error={
                otpForm.touched.otp && otpForm.errors.otp ? { touched: true, message: otpForm.errors.otp } : undefined
              }
            />
            {timeRemaining > 0 ? (
              <p className="text-center text-sm text-neutral-500">Code expires in {formatTime(timeRemaining)}</p>
            ) : (
              <p className="text-center text-sm text-red-500">Code has expired</p>
            )}
          </div>
          <Button className="w-full" type="submit" disabled={isLoading || timeRemaining === 0}>
            {isLoading ? "Verifying..." : "Verify code"}
          </Button>
        </form>
        <div className="text-center">
          <p className="text-sm text-neutral-600">
            Didn&apos;t receive the code?{" "}
            {resendCooldown > 0 ? (
              <span className="text-neutral-400">Resend in {resendCooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-primary font-medium hover:underline disabled:opacity-50"
              >
                Click to resend
              </button>
            )}
          </p>
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={handleBackToEmail}
            className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-800"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" />
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-125 space-y-6 rounded-xl border bg-white p-6 shadow-md">
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-100">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-6 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-800">Verified!</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Your email has been verified. Redirecting you to reset your password...
        </p>
      </div>
      <div className="flex justify-center">
        <div className="border-primary size-6 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    </div>
  );
};

export default Page;
