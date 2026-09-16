"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/src/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/src/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import Link from "next/link";
import { Loader2, User, Mail, Lock, CheckCircle2, XCircle } from "lucide-react";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`,
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.add({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${data.username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";

      toast.add({
        title: "Signup failed",
        description: errorMessage,
        type: "error",
      });

      setIsSubmitting(false);
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
            Join Feedvox
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Share your thoughts. Stay anonymous.
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="alice132"
                className="h-11 rounded-xl border-gray-200 bg-gray-50/50 pl-10 pr-4 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                {...form.register("username", {
                  onChange: (e) => {
                    debounced(e.target.value);
                  },
                })}
              />
            </div>

            {isCheckingUsername && (
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Checking username...
              </div>
            )}

            {!isCheckingUsername && usernameMessage && (
              <div
                className={`mt-2 flex items-center gap-2 text-xs ${
                  usernameMessage === "Username is unique"
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {usernameMessage === "Username is unique" ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}

                {usernameMessage}
              </div>
            )}
            <FieldError errors={[form.formState.errors.username]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="alice132@email.com"
                className="h-11 rounded-xl border-gray-200 bg-gray-50/50 pl-10 pr-4 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                {...form.register("email")}
              />
            </div>

            <FieldError errors={[form.formState.errors.email]} />
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
            disabled={isSubmitting}
            focusableWhenDisabled
            className="h-11 w-full rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl disabled:opacity-70 hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Lock className="h-3.5 w-3.5" />
          Your identity stays private
        </div>

        <div className="mt-5 border-t border-gray-100 pt-6 text-center">
          <p className="text-sm text-gray-500">
            Already a member?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
