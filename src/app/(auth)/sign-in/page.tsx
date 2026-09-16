"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { signInSchema } from "@/src/schemas/signInSchema";
import { signIn } from "next-auth/react";

const page = () => {
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast.add({
        title: "Login Failed",
        description: "Incorrect username or password",
        type: "error",
      });
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl shadow-indigo-100/50 backdrop-blur-xl sm:p-10">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 text-xl font-bold text-white shadow-lg shadow-indigo-200">
            F
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Sign in to continue to Feedvox
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <Field>
            <FieldLabel htmlFor="identifier">Username or Email</FieldLabel>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                id="identifier"
                type="text"
                autoComplete="username"
                placeholder="Enter your Username or Email"
                className="h-11 rounded-xl border-gray-200 bg-gray-50/50 pl-10 pr-4 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                {...form.register("identifier")}
              />
            </div>
            <FieldError errors={[form.formState.errors.identifier]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter your password"
                className="h-11 rounded-xl border-gray-200 bg-gray-50/50 pl-10 pr-4 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                {...form.register("password")}
              />
            </div>

            <FieldError errors={[form.formState.errors.password]} />
          </Field>
          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl disabled:opacity-70 hover:-translate-y-0.5"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Lock className="h-3.5 w-3.5" />
          Your identity stays private
        </div>

        <div className="mt-5 border-t border-gray-100 pt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
