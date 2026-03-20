"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import Link from "next/link";
import * as Yup from "yup";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SigninDto } from "@/types/auth";
import { useUserStore } from "@/store/core";
import { useLogin } from "@/lib/api/auth";
import { getBasePathByRole } from "@/lib";
import { toast } from "sonner";

const initialValues: SigninDto = {
  email: "",
  password: "",
};

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Page = () => {
  const { isPending, mutateAsync } = useLogin();
  const { signin } = useUserStore();
  const router = useRouter();

  const { handleChange, handleSubmit } = useFormik<SigninDto>({
    initialValues,
    onSubmit: (values) => {
      mutateAsync(values)
        .then((response) => {
          signin(response, { remember: true });
          toast.success("Signed in successfully");
          const path = getBasePathByRole(response.user.role);
          setTimeout(() => {
            router.replace(path);
          }, 200);
        })
        .catch((error) => {
          console.error({ error });
          const message = error.message || "Sign in failed";
          toast.error(message);
        });
    },
    validationSchema: schema,
  });

  return (
    <div className="w-125 space-y-6 rounded-xl border bg-white p-6 shadow-md">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-800">Welcome back</h2>
        <p className="text-sm text-neutral-600">Sign in to continue</p>
      </div>
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <Input disabled={isPending} label="Email" name="email" onChange={handleChange} type="email" />
        <div className="space-y-1">
          <Input disabled={isPending} label="Password" name="password" onChange={handleChange} type="password" />
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Checkbox disabled={isPending} />
              <p className="text-sm text-neutral-600">Keep me signed in</p>
            </div>
            <Link className="link text-sm text-neutral-600" href="/forgot-password">
              Forgot password?
            </Link>
          </div>
        </div>
        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
};

export default Page;
